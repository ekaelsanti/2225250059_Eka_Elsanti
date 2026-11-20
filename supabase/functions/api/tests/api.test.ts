// Edge Function "api" tests (Node, no network, no database): npm run api:test
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createApp } from "../app.ts";
import { callGemini, fromResponse, ModelBusy, ModelUnavailable, type ChatMessage } from "../ai/gemini.ts";
import { systemPrompt } from "../ai/prompt.ts";
import type { Settings } from "../lib/env.ts";
import { buildMessages, parseAskBody } from "../routes/ask.ts";
import { clientHash, MemoryUsageStore, wibDay } from "../services/usage.ts";

const SETTINGS: Settings = {
  appEnv: "test",
  databaseUrl: undefined,
  corsOrigins: ["http://localhost:5173"],
  geminiApiKey: "test-key",
  geminiModel: "main-model",
  geminiFallbackModel: "fallback-model",
  timeoutSeconds: 10,
  dailyQuota: 3,
  monthlyBudgetUsd: 1,
  priceIn: 1 / 1_000_000,
  priceOut: 2 / 1_000_000,
  usageSalt: "test-salt-1234567890",
};

function setup(over: Partial<Settings> = {}, reply = "Coba hitung Δy dulu, ya.") {
  const store = new MemoryUsageStore();
  const calls: { system: string; messages: ChatMessage[] }[] = [];
  const app = createApp({
    settings: () => ({ ...SETTINGS, ...over }),
    store: () => store,
    callModel: (system, messages) => {
      calls.push({ system, messages });
      return Promise.resolve({ text: reply, refused: false, model: "main-model", inputTokens: 100, outputTokens: 50, latencyMs: 5 });
    },
  });
  const post = (body: unknown, ip = "1.2.3.4") =>
    app.request("/api/v1/ask", { method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify(body) });
  return { app, store, calls, post };
}

describe("endpoint kesehatan & status", () => {
  it("health dan status mengikuti kunci API", async () => {
    const { app } = setup();
    assert.deepEqual(await (await app.request("/api/v1/health")).json(), { ok: true, ai_configured: true });
    assert.deepEqual(await (await app.request("/api/v1/ask/status")).json(), { enabled: true });
    const off = setup({ geminiApiKey: undefined });
    assert.deepEqual(await (await off.app.request("/api/v1/ask/status")).json(), { enabled: false });
  });
  it("tanpa kunci API: 503 dengan pesan ramah (bentuk {detail} sama dengan FastAPI)", async () => {
    const res = await setup({ geminiApiKey: undefined }).post({ question: "Apa itu gradien?" });
    assert.equal(res.status, 503);
    assert.match((await res.json()).detail, /belum diaktifkan/);
  });
  it("rute tidak dikenal: 404", async () => {
    assert.equal((await setup().app.request("/api/v1/tidak-ada")).status, 404);
  });
});

describe("validasi & privasi", () => {
  it("menolak field tambahan seperti kode peserta", async () => {
    assert.equal((await setup().post({ question: "gradien?", participant: "S01" })).status, 422);
    assert.equal((await setup().post({ question: "gradien?", context: { phase: "amati", student: "S01" } })).status, 422);
  });
  it("menolak pertanyaan kosong, terlalu panjang, atau riwayat tidak sah", async () => {
    const { post } = setup();
    assert.equal((await post({ question: "" })).status, 422);
    assert.equal((await post({ question: "x".repeat(501) })).status, 422);
    assert.equal((await post({ question: "a", history: [{ role: "system", content: "x" }] })).status, 422);
    assert.equal((await post("bukan objek")).status, 422);
  });
  it("riwayat dipotong dan selalu diawali giliran siswa", () => {
    const body = parseAskBody({ question: "Q", history: [{ role: "assistant", content: "halo" }, { role: "user", content: "u1" }, { role: "assistant", content: "a1" }] });
    const msgs = buildMessages(body);
    assert.equal(msgs[0].role, "user");
    assert.deepEqual(msgs.at(-1), { role: "user", content: "Q" });
  });
  it("log penggunaan tidak menyimpan teks pertanyaan", async () => {
    const { post, store } = setup();
    await post({ question: "Rahasia: nama saya Budi", context: { lesson: "gradien", phase: "amati" } });
    assert.equal(JSON.stringify(store.log).includes("Budi"), false);
    assert.equal(store.log[0].surface, "rmt");
    assert.equal(store.log[0].phase, "amati");
  });
  it("hash klien stabil, bergaram, dan bukan alamat aslinya", async () => {
    const a = await clientHash("1.2.3.4", "salt-a");
    assert.equal(a, await clientHash("1.2.3.4", "salt-a"));
    assert.notEqual(a, await clientHash("1.2.3.4", "salt-b"));
    assert.equal(a.includes("1.2.3.4"), false);
  });
});

describe("tanya jawab", () => {
  it("jawaban AI diteruskan; konteks RMT menjadikan Gradi mediator", async () => {
    const { post, calls } = setup();
    const res = await post({ question: "Kenapa perosotan bukan yang paling curam?", context: { lesson: "gradien", phase: "amati" } });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { answer: "Coba hitung Δy dulu, ya.", source: "ai" });
    assert.match(calls[0].system, /Jalur RMT/);
    assert.match(calls[0].system, /fase Amati/);
  });
  it("tanpa konteks: prompt Tanya AI biasa", () => {
    assert.equal(systemPrompt().includes("Jalur RMT"), false);
    assert.equal(systemPrompt({ phase: "fase-palsu" }).includes("Jalur RMT"), false);
  });
  it("kuota harian per klien: 429 setelah batas, klien lain tidak terpengaruh", async () => {
    const { post } = setup();
    for (let i = 0; i < 3; i++) assert.equal((await post({ question: `q${i}` })).status, 200);
    const over = await post({ question: "q4" });
    assert.equal(over.status, 429);
    assert.match((await over.json()).detail, /Kuota/);
    assert.equal((await post({ question: "q" }, "5.6.7.8")).status, 200);
  });
  it("anggaran bulanan habis: 503, model tidak dipanggil", async () => {
    const { post, store, calls } = setup();
    store.monthly.set(wibDay().month, 1);
    const res = await post({ question: "q" });
    assert.equal(res.status, 503);
    assert.match((await res.json()).detail, /istirahat/);
    assert.equal(calls.length, 0);
  });
  it("biaya dicatat dari jumlah token", async () => {
    const { post, store } = setup();
    await post({ question: "q" });
    assert.ok(Math.abs((await store.monthCost(wibDay().month)) - (100 * 1 + 50 * 2) / 1_000_000) < 1e-12);
  });
});

describe("klien Gemini", () => {
  const ok = (text: string) => new Response(JSON.stringify({
    candidates: [{ content: { parts: [{ text }] }, finishReason: "STOP" }],
    usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5, thoughtsTokenCount: 3 },
  }), { status: 200 });
  const opt = (fetchImpl: typeof fetch) => ({ apiKey: "k", models: ["main", "cadangan"], timeoutSeconds: 10, fetchImpl });

  it("model utama sibuk (503) → pakai model cadangan", async () => {
    const seen: string[] = [];
    const fake = ((url: string) => {
      seen.push(url);
      return Promise.resolve(url.includes("/main:") ? new Response("busy", { status: 503 }) : ok("halo"));
    }) as unknown as typeof fetch;
    const r = await callGemini("sys", [{ role: "user", content: "q" }], opt(fake));
    assert.equal(r.text, "halo");
    assert.equal(r.model, "cadangan");
    assert.equal(r.outputTokens, 8);
    assert.equal(seen.length, 2);
  });
  it("kunci salah (400/403) → ModelUnavailable tanpa mencoba model lain", async () => {
    let n = 0;
    const fake = (() => {
      n++;
      return Promise.resolve(new Response("bad key", { status: 403 }));
    }) as unknown as typeof fetch;
    await assert.rejects(callGemini("s", [{ role: "user", content: "q" }], opt(fake)), ModelUnavailable);
    assert.equal(n, 1);
  });
  it("semua model sibuk → ModelBusy", async () => {
    const fake = (() => Promise.resolve(new Response("x", { status: 429 }))) as unknown as typeof fetch;
    await assert.rejects(callGemini("s", [{ role: "user", content: "q" }], opt(fake)), ModelBusy);
  });
  it("respons diblokir filter keamanan dianggap penolakan", () => {
    assert.equal(fromResponse({ promptFeedback: { blockReason: "SAFETY" } }, "m", 1).refused, true);
    assert.equal(fromResponse({ candidates: [{ finishReason: "SAFETY" }] }, "m", 1).refused, true);
  });
  it("riwayat dikirim dengan peran Gemini (assistant → model) dan kunci di header", async () => {
    let sent: { headers: Record<string, string>; body: string } | null = null;
    const fake = ((_url: string, init: { headers: Record<string, string>; body: string }) => {
      sent = init;
      return Promise.resolve(ok("x"));
    }) as unknown as typeof fetch;
    await callGemini("sys", [{ role: "user", content: "a" }, { role: "assistant", content: "b" }, { role: "user", content: "c" }], opt(fake));
    const body = JSON.parse(sent!.body);
    assert.deepEqual(body.contents.map((c: { role: string }) => c.role), ["user", "model", "user"]);
    assert.equal(sent!.headers["x-goog-api-key"], "k");
    assert.equal(sent!.body.includes("\"k\""), false);
  });
});
