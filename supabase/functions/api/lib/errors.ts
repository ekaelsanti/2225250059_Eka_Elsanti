/** HTTP error rendered as {"detail": "..."}: the same shape as the FastAPI server, so the web app needs no change. */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
  }
}

export const TEXT = {
  notConfigured: "Tanya AI belum diaktifkan oleh guru (kunci API belum dipasang).",
  busy: "Gradi sedang sibuk. Coba lagi sebentar, ya.",
  quota: "Kuota pertanyaan AI hari ini sudah habis. Coba lagi besok, ya.",
  budget: "Mediator AI sedang istirahat sampai bulan depan. Pakai Pertanyaan Gradi dulu, ya.",
  provider: "Layanan AI sedang bermasalah. Coba lagi nanti.",
  invalid: "Isian belum lengkap atau tidak sesuai.",
  refused: "Maaf, Gradi tidak bisa membantu pertanyaan itu. Yuk, tanya seputar gradien!",
  empty: "Maaf, Gradi belum menemukan jawabannya. Coba tulis pertanyaanmu dengan kata lain.",
  internal: "Terjadi kesalahan di server. Coba lagi.",
};
