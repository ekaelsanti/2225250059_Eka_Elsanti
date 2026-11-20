// Gemini (Google AI Studio) via the REST generateContent endpoint. No SDK: one fetch, easy to test.
// Model order: main model, then the fallback when the main one is overloaded (429/5xx) or slow.

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ModelResult {
  text: string;
  refused: boolean;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
}

export interface GeminiOptions {
  apiKey: string;
  models: string[];
  timeoutSeconds: number;
  fetchImpl?: typeof fetch;
}

/** Bad key or bad request: another model will not help. */
export class ModelUnavailable extends Error {}
/** Every model was busy, or the time budget ran out. */
export class ModelBusy extends Error {}

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; thoughtsTokenCount?: number };
}

/** Converts a Gemini response into the tutor result (exported for tests). */
export function fromResponse(data: GeminiResponse, model: string, latencyMs: number): ModelResult {
  const usage = data.usageMetadata ?? {};
  const cand = data.candidates?.[0];
  const text = (cand?.content?.parts ?? []).filter((p) => !p.thought).map((p) => p.text ?? "").join("").trim();
  const refused = Boolean(data.promptFeedback?.blockReason) || ["SAFETY", "PROHIBITED_CONTENT", "BLOCKLIST", "SPII"].includes(cand?.finishReason ?? "");
  return {
    text,
    refused,
    model,
    inputTokens: usage.promptTokenCount ?? 0,
    outputTokens: (usage.candidatesTokenCount ?? 0) + (usage.thoughtsTokenCount ?? 0),
    latencyMs,
  };
}

export async function callGemini(system: string, messages: ChatMessage[], opt: GeminiOptions): Promise<ModelResult> {
  const doFetch = opt.fetchImpl ?? fetch;
  const started = Date.now();
  const deadline = started + opt.timeoutSeconds * 1000;
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: 2048, temperature: 0.6 },
  });
  for (const model of opt.models) {
    const remaining = deadline - Date.now();
    if (remaining < 2000) break;
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), remaining);
    try {
      const res = await doFetch(`${ENDPOINT}/${encodeURIComponent(model)}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": opt.apiKey },
        body,
        signal: abort.signal,
      });
      if (res.ok) return fromResponse((await res.json()) as GeminiResponse, model, Date.now() - started);
      // Provider error text only (never the student's question): Supabase → Edge Functions → api → Logs.
      console.error(`gemini error model=${model} status=${res.status}: ${(await res.text()).replace(/\s+/g, " ").slice(0, 500)}`);
      if (res.status >= 400 && res.status < 500 && res.status !== 429 && res.status !== 408) {
        throw new ModelUnavailable(`Gemini ${res.status}`);
      }
      // overloaded or rate limited: try the next model
    } catch (e) {
      if (e instanceof ModelUnavailable) throw e;
      console.error(`gemini network/timeout model=${model}: ${(e as Error).name}`);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new ModelBusy("all models busy or time budget used");
}
