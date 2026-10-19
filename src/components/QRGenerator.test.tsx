import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// jsdom has no canvas, so replace the QR library with a small fake.
const toCanvas = vi.fn().mockResolvedValue(undefined);
const toDataURL = vi.fn().mockResolvedValue("data:image/png;base64,AAAA");
const toString = vi.fn().mockResolvedValue("<svg></svg>");
vi.mock("qrcode", () => ({
  default: {
    toCanvas: (...args: unknown[]) => toCanvas(...args),
    toDataURL: (...args: unknown[]) => toDataURL(...args),
    toString: (...args: unknown[]) => toString(...args),
  },
}));

import QRGenerator from "./QRGenerator";
import { MAX_TEXT_LENGTH } from "@/lib/qr";

const input = () => screen.getByLabelText(/text or url/i);

describe("QRGenerator", () => {
  beforeEach(() => {
    toCanvas.mockClear();
    toDataURL.mockClear();
    toString.mockClear();
  });

  it("starts empty with no export buttons", () => {
    render(<QRGenerator />);
    expect(screen.getByText(/Your QR code will appear here/i)).toBeInTheDocument();
    expect(screen.queryByText(/Export PNG/i)).not.toBeInTheDocument();
  });

  it("draws a QR code for a link and shows the export buttons", async () => {
    render(<QRGenerator />);
    fireEvent.change(input(), { target: { value: "youtube.com" } });
    await waitFor(() => expect(toCanvas).toHaveBeenCalled());
    expect(toCanvas.mock.calls[0][1]).toBe("https://youtube.com");
    expect(await screen.findByText(/Export PNG/i)).toBeInTheDocument();
    expect(screen.getByText(/Export SVG/i)).toBeInTheDocument();
  });

  it("encodes plain text as a /view link", async () => {
    render(<QRGenerator />);
    fireEvent.change(input(), { target: { value: "hello there" } });
    await waitFor(() => expect(toCanvas).toHaveBeenCalled());
    expect(toCanvas.mock.calls[0][1]).toBe(`${window.location.origin}/view?text=hello%20there`);
  });

  it("explains why it refuses text that is too long and draws nothing", async () => {
    render(<QRGenerator />);
    fireEvent.change(input(), { target: { value: "a ".repeat(MAX_TEXT_LENGTH) } });
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/at most/i));
    expect(toCanvas).not.toHaveBeenCalled();
    expect(screen.queryByText(/Export PNG/i)).not.toBeInTheDocument();
  });

  it("explains why it refuses a link with a username in it", async () => {
    render(<QRGenerator />);
    fireEvent.change(input(), { target: { value: "https://google.com@evil.example" } });
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/username or password/i));
  });

  it("shows an error instead of crashing when the QR library fails", async () => {
    toCanvas.mockRejectedValueOnce(new Error("boom"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<QRGenerator />);
    fireEvent.change(input(), { target: { value: "hello" } });
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/Couldn't create/i));
    spy.mockRestore();
  });

  it("exports a 1024 px PNG", async () => {
    render(<QRGenerator />);
    fireEvent.change(input(), { target: { value: "https://example.com" } });
    fireEvent.click(await screen.findByText(/Export PNG/i));
    await waitFor(() => expect(toDataURL).toHaveBeenCalled());
    expect(toDataURL.mock.calls[0][1]).toMatchObject({ width: 1024 });
  });
});
