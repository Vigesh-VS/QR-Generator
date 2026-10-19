/**
 * Pure helpers that decide what a QR code will contain.
 * Kept free of React and the DOM so every rule can be unit tested.
 */

/** Longest plain text a user can turn into a QR code. */
export const MAX_TEXT_LENGTH = 500;
/** Longest link a user can turn into a QR code. */
export const MAX_URL_LENGTH = 1500;
/**
 * Hard ceiling for what is actually encoded (in bytes). A QR code at error
 * correction level M holds at most 2331 bytes; staying well below that keeps
 * the code scannable from a phone instead of a dense grid of tiny squares.
 */
export const MAX_PAYLOAD_BYTES = 1800;
/** Longest text the /view page will show. */
export const MAX_VIEW_LENGTH = MAX_TEXT_LENGTH;

/** File extensions that look like a domain ("notes.pdf") but are not websites. */
const FILE_EXTENSIONS = new Set([
  "txt", "md", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv",
  "png", "jpg", "jpeg", "gif", "svg", "webp", "zip", "rar", "mp3", "mp4",
  "json", "xml", "html", "js", "ts", "py", "java", "exe", "log",
]);

const HTTP_URL = /^https?:\/\//i;
// one or more labels, a dot, a 2+ letter TLD, optional port, optional path/query/hash, no spaces
const BARE_DOMAIN = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?::\d{1,5})?(?:[/?#]\S*)?$/i;

export type QrKind = "url" | "text";

export type QrPayload =
  | { ok: true; kind: QrKind; value: string }
  | { ok: false; error: string };

/**
 * Remove control characters and invisible direction-override characters
 * (they can hide or reorder what a reader sees). Normal spaces, tabs and
 * line breaks are kept.
 */
export function sanitizeInput(raw: string): string {
  // eslint-disable-next-line no-control-regex, no-irregular-whitespace
  return raw.replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F​-‏‪-‮⁦-⁩]/g, "").trim();
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

/** True when the text should be treated as a web address. */
export function looksLikeUrl(text: string): boolean {
  if (HTTP_URL.test(text)) return true;
  if (!BARE_DOMAIN.test(text)) return false;
  const host = text.split(/[/?#]/)[0].split(":")[0];
  const tld = host.split(".").pop()!.toLowerCase();
  return !FILE_EXTENSIONS.has(tld);
}

/**
 * Work out what to encode.
 *  - web addresses are encoded as they are (https:// is added when missing)
 *  - anything else becomes a link to this site's /view page, so scanning it
 *    shows the text instead of trying to open it as an address
 */
export function buildPayload(raw: string, origin: string): QrPayload {
  const text = sanitizeInput(raw);
  if (!text) return { ok: false, error: "" };

  if (looksLikeUrl(text)) {
    if (text.length > MAX_URL_LENGTH) {
      return { ok: false, error: `Links can be at most ${MAX_URL_LENGTH} characters.` };
    }
    const candidate = HTTP_URL.test(text) ? text : `https://${text}`;
    let parsed: URL;
    try {
      parsed = new URL(candidate);
    } catch {
      return { ok: false, error: "That doesn't look like a valid link." };
    }
    if (parsed.username || parsed.password) {
      // https://google.com@evil.com is a classic phishing trick
      return { ok: false, error: "Links with a username or password in them are not supported." };
    }
    if (byteLength(candidate) > MAX_PAYLOAD_BYTES) {
      return { ok: false, error: "That link is too long to fit in a QR code." };
    }
    return { ok: true, kind: "url", value: candidate };
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return { ok: false, error: `Text can be at most ${MAX_TEXT_LENGTH} characters.` };
  }
  const value = `${origin}/view?text=${encodeURIComponent(text)}`;
  if (byteLength(value) > MAX_PAYLOAD_BYTES) {
    return { ok: false, error: "That text is too long to fit in a QR code. Try something shorter." };
  }
  return { ok: true, kind: "text", value };
}

/** Text shown on the /view page: control characters removed and length capped. */
export function prepareViewText(raw: string | null): { text: string; truncated: boolean } {
  if (!raw) return { text: "", truncated: false };
  const cleaned = sanitizeInput(raw);
  if (cleaned.length > MAX_VIEW_LENGTH) {
    return { text: cleaned.slice(0, MAX_VIEW_LENGTH), truncated: true };
  }
  return { text: cleaned, truncated: false };
}
