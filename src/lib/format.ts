export const TZ = "Europe/Istanbul";

export function formatTRY(v: number | string | null | undefined) {
  if (v === null || v === undefined || v === "") return null;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Number(v));
}

export function formatDuration(min: number) {
  if (min < 60) return `${min} dk`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} sa ${m} dk` : `${h} sa`;
}

export function formatDateTR(
  d: Date | string,
  opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  },
) {
  return new Intl.DateTimeFormat("tr-TR", { timeZone: TZ, ...opts }).format(
    new Date(d),
  );
}

export function formatTimeTR(d: Date | string) {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}

/** YYYY-MM-DD of a date as seen in Istanbul. */
export function istanbulDateKey(d: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export const bookingErrorMessage: Record<string, string> = {
  SLOT_TAKEN: "Bu saat az önce doldu. Lütfen başka bir saat seçin.",
  KVKK_REQUIRED:
    "Devam etmek için KVKK aydınlatma metnini onaylamanız gerekir.",
  INVALID_PHONE:
    "Lütfen geçerli bir cep telefonu numarası girin (05XX XXX XX XX).",
  INVALID_NAME: "Lütfen ad ve soyadınızı eksiksiz girin.",
  TOO_LONG: "Girdiğiniz bilgilerden biri çok uzun.",
  SERVICE_NOT_FOUND: "Seçtiğiniz hizmet artık sunulmuyor.",
};

export function mapBookingError(message?: string) {
  const code = Object.keys(bookingErrorMessage).find((k) =>
    message?.includes(k),
  );
  return code
    ? bookingErrorMessage[code]
    : "Randevu oluşturulamadı. Lütfen tekrar deneyin.";
}
