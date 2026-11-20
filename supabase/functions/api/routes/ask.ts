// F-34 Tanya AI + F-35 Mediator AI. Same endpoints and JSON as the FastAPI server (mathengine/api.py),
// so the web app works with either backend: GET /ask/status, POST /ask.
import { Hono } from "hono";
import type { ChatMessage, ModelResult } from "../ai/gemini.ts";
import { ModelBusy, ModelUnavailable } from "../ai/gemini.ts";
import { systemPrompt } from "../ai/prompt.ts";
import type { Settings } from "../lib/env.ts";
import { HttpError, TEXT } from "../lib/errors.ts";
import { clientHash, type UsageStore, wibDay } from "../services/usage.ts";

export type CallModel = (system: string, messages: ChatMessage[]) => Promise<ModelResult>;

export interface AskDeps {
  settings: () => Settings;
  store: () => UsageStore;
  callModel: CallModel;
}

const MAX_TURNS = 8;

interface AskBody {
  question: string;
  history: ChatMessage[];
  context?: { lesson?: string; phase?: string };
}

const isStr = (v: unknown, min: number, max: number): v is string => typeof v === "string" && v.length >= min && v.length <= max;
const onlyKeys = (o: Record<string, unknown>, keys: string[]) => Object.keys(o).every((k) => keys.includes(k));

/** Strict validation like Pydantic extra="forbid": unknown fields (e.g. a participant code) are rejected. */
export function parseAskBody(raw: unknown): AskBody {
  const bad = () => new HttpError(422, TEXT.invalid);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw bad();
  const o = raw as Record<string, unknown>;
  if (!onlyKeys(o, ["question", "history", "context"])) throw bad();
  if (!isStr(o.question, 1, 500) || !o.question.trim()) throw bad();
  const history = o.history ?? [];
  if (!Array.isArray(history) || history.length > MAX_TURNS * 2) throw bad();
  for (const t of history) {
    if (!t || typeof t !== "object" || !onlyKeys(t as Record<string, unknown>, ["role", "content"])) throw bad();
    if (!["user", "assistant"].includes((t as ChatMessage).role) || !isStr((t as ChatMessage).content, 1, 1500)) throw bad();
  }
  let context: AskBody["context"];
  if (o.context !== undefined) {
    const c = o.context as Record<string, unknown>;
    if (!c || typeof c !== "object" || !onlyKeys(c, ["lesson", "phase"])) throw bad();
    for (const k of ["lesson", "phase"]) {
      if (c[k] !== undefined && !(isStr(c[k], 1, 40) && /^[a-z0-9-]+$/.test(c[k] as string))) throw bad();
    }
    context = { lesson: c.lesson as string | undefined, phase: c.phase as string | undefined };
  }
  return { question: o.question, history: history as ChatMessage[], context };
}

/** Last turns only, always starting with a user turn, then the new question. */
export function buildMessages(body: AskBody): ChatMessage[] {
  const turns = body.history.slice(-MAX_TURNS * 2);
  while (turns.length && turns[0].role !== "user") turns.shift();
  return [...turns, { role: "user", content: body.question }];
}

function clientAddress(h: (name: string) => string | undefined): string {
  return h("x-nf-client-connection-ip") ?? h("cf-connecting-ip") ?? h("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export function askRoutes(deps: AskDeps): Hono {
  const r = new Hono();

  r.get("/ask/status", (c) => c.json({ enabled: Boolean(deps.settings().geminiApiKey) }));

  r.post("/ask", async (c) => {
    const s = deps.settings();
    let raw: unknown;
    try {
      raw = JSON.parse(await c.req.text());
    } catch {
      raw = undefined;
    }
    const body = parseAskBody(raw);
    if (!s.geminiApiKey) throw new HttpError(503, TEXT.notConfigured);

    const store = deps.store();
    const { day, month } = wibDay();
    if ((await store.monthCost(month)) >= s.monthlyBudgetUsd) throw new HttpError(503, TEXT.budget);
    const hash = await clientHash(clientAddress((n) => c.req.header(n)), s.usageSalt);
    if ((await store.countToday(hash, day)) > s.dailyQuota) throw new HttpError(429, TEXT.quota);

    const surface = body.context?.phase ? "rmt" : "tanya";
    const base = { surface, lesson: body.context?.lesson ?? null, phase: body.context?.phase ?? null } as const;
    let result: ModelResult;
    try {
      result = await deps.callModel(systemPrompt(body.context), buildMessages(body));
    } catch (e) {
      const busy = e instanceof ModelBusy;
      await store.record(month, { ...base, model: null, status: busy ? "busy" : "error", inputTokens: 0, outputTokens: 0, costUsd: 0, latencyMs: 0 });
      if (busy) throw new HttpError(429, TEXT.busy);
      if (e instanceof ModelUnavailable) throw new HttpError(502, TEXT.provider);
      throw e;
    }
    const costUsd = result.inputTokens * s.priceIn + result.outputTokens * s.priceOut;
    await store.record(month, {
      ...base,
      model: result.model,
      status: result.refused ? "refused" : "ok",
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      costUsd,
      latencyMs: result.latencyMs,
    });
    const answer = result.refused ? TEXT.refused : result.text || TEXT.empty;
    return c.json({ answer, source: "ai" });
  });

  return r;
}
