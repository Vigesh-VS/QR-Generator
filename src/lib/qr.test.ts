import { describe, it, expect } from "vitest";
import {
  buildPayload,
  looksLikeUrl,
  prepareViewText,
  sanitizeInput,
  MAX_TEXT_LENGTH,
  MAX_URL_LENGTH,
  MAX_VIEW_LENGTH,
} from "./qr";

const ORIGIN = "https://qr.example.com";

describe("looksLikeUrl", () => {
  it.each([
    "https://example.com",
    "http://example.com/path?x=1",
    "HTTPS://EXAMPLE.COM",
    "youtube.com",
    "www.youtube.com/watch?v=abc",
    "sub.domain.co.in",
    "example.com:8080/path",
  ])("treats %s as a link", (value) => {
    expect(looksLikeUrl(value)).toBe(true);
  });

  it.each([
    "hello",
    "hello world",
    "see example.com for details", // has spaces
    "notes.pdf",
    "report.docx",
    "photo.jpeg",
    "a.b", // one-letter "TLD"
    "3.14",
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "ftp://example.com",
  ])("treats %s as plain text", (value) => {
    expect(looksLikeUrl(value)).toBe(false);
  });
});

describe("buildPayload", () => {
  it("returns an empty result for blank input", () => {
    expect(buildPayload("", ORIGIN)).toEqual({ ok: false, error: "" });
    expect(buildPayload("   ", ORIGIN)).toEqual({ ok: false, error: "" });
  });

  it("keeps full links unchanged", () => {
    expect(buildPayload("https://example.com/a?b=c", ORIGIN)).toEqual({
      ok: true,
      kind: "url",
      value: "https://example.com/a?b=c",
    });
  });

  it("adds https:// to bare domains", () => {
    expect(buildPayload("youtube.com", ORIGIN)).toEqual({
      ok: true,
      kind: "url",
      value: "https://youtube.com",
    });
  });

  it("turns plain text into a /view link on this site", () => {
    const result = buildPayload("hello world & more", ORIGIN);
    expect(result).toEqual({
      ok: true,
      kind: "text",
      value: `${ORIGIN}/view?text=hello%20world%20%26%20more`,
    });
  });

  it("never encodes script-like schemes as links", () => {
    const result = buildPayload("javascript:alert(1)", ORIGIN);
    expect(result.ok && result.kind).toBe("text");
    expect(result.ok && result.value.startsWith(ORIGIN + "/view?text=")).toBe(true);
  });

  it("refuses links that hide a different host behind a username", () => {
    const result = buildPayload("https://google.com@evil.example", ORIGIN);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toMatch(/username or password/);
  });

  it("refuses links and text that are too long", () => {
    const longLink = buildPayload(`https://example.com/${"a".repeat(MAX_URL_LENGTH)}`, ORIGIN);
    expect(longLink.ok).toBe(false);

    const longText = buildPayload("a ".repeat(MAX_TEXT_LENGTH), ORIGIN);
    expect(longText.ok).toBe(false);
  });

  it("refuses text that is short but too big once encoded", () => {
    // 450 non-ASCII characters become far more than 1800 bytes when percent-encoded
    const result = buildPayload("é".repeat(450), ORIGIN);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toMatch(/too long/);
  });

  it("accepts text right at the length limit when it fits", () => {
    expect(buildPayload("a ".repeat(MAX_TEXT_LENGTH / 2).trim(), ORIGIN).ok).toBe(true);
  });
});

describe("sanitizeInput", () => {
  it("removes control and direction-override characters", () => {
    expect(sanitizeInput("a\u0000b‮c​d")).toBe("abcd");
  });

  it("keeps normal spaces, tabs and line breaks, and trims the ends", () => {
    expect(sanitizeInput("  one two\tthree\nfour  ")).toBe("one two\tthree\nfour");
  });
});

describe("prepareViewText", () => {
  it("handles a missing value", () => {
    expect(prepareViewText(null)).toEqual({ text: "", truncated: false });
  });

  it("passes short text through", () => {
    expect(prepareViewText("hello")).toEqual({ text: "hello", truncated: false });
  });

  it("caps very long text and says so", () => {
    const result = prepareViewText("x".repeat(MAX_VIEW_LENGTH + 100));
    expect(result.text).toHaveLength(MAX_VIEW_LENGTH);
    expect(result.truncated).toBe(true);
  });
});
