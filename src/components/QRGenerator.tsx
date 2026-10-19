/**
 * QRGenerator: the main QR code generation interface.
 * Generates the code as the user types and exports it as PNG or SVG.
 * What goes into the code (and what is refused) is decided in @/lib/qr.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { buildPayload, MAX_TEXT_LENGTH, MAX_URL_LENGTH } from "@/lib/qr";

/** Size of the on-screen preview, and of the downloaded PNG (sharp enough to print). */
const PREVIEW_SIZE = 280;
const EXPORT_SIZE = 1024;

const QR_OPTIONS = {
  margin: 2,
  color: { dark: "#000000", light: "#ffffff" },
  errorCorrectionLevel: "M" as const,
};

function download(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.click();
}

const QRGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** Draw the QR code, or clear everything when there is nothing valid to show. */
  const render = useCallback(async (text: string) => {
    const result = buildPayload(text, window.location.origin);
    if (!result.ok) {
      setPayload("");
      setError(result.error);
      return;
    }
    setError("");
    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, result.value, {
          ...QR_OPTIONS,
          width: PREVIEW_SIZE,
        });
      }
      setPayload(result.value);
    } catch (err) {
      console.error("QR generation failed:", err);
      setPayload("");
      setError("Couldn't create a QR code from that. Try something shorter.");
    }
  }, []);

  /** Wait 150 ms after the user stops typing before drawing. */
  useEffect(() => {
    const timer = setTimeout(() => render(inputText), 150);
    return () => clearTimeout(timer);
  }, [inputText, render]);

  /** Export a large PNG, rendered fresh so it is sharp at any size. */
  const exportPNG = async () => {
    if (!payload) return;
    try {
      const url = await QRCode.toDataURL(payload, { ...QR_OPTIONS, width: EXPORT_SIZE });
      download(url, "qrcode.png");
    } catch (err) {
      console.error("PNG export failed:", err);
      setError("Couldn't export the PNG. Please try again.");
    }
  };

  /** Export a vector SVG that scales without losing quality. */
  const exportSVG = async () => {
    if (!payload) return;
    try {
      const svg = await QRCode.toString(payload, { ...QR_OPTIONS, type: "svg" });
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      download(url, "qrcode.svg");
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("SVG export failed:", err);
      setError("Couldn't export the SVG. Please try again.");
    }
  };

  const hasQR = payload.length > 0;
  const maxLength = Math.max(MAX_TEXT_LENGTH, MAX_URL_LENGTH);

  return (
    <Card className="w-full max-w-md border-2 border-border bg-card shadow-xl">
      <CardContent className="p-6 space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <h1
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            QR Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Paste any text or URL to generate a QR code.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label htmlFor="qr-input" className="sr-only">
            Text or URL to turn into a QR code
          </label>
          <Input
            id="qr-input"
            type="text"
            placeholder="Enter text or URL..."
            value={inputText}
            maxLength={maxLength}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "qr-error" : undefined}
            onChange={(e) => setInputText(e.target.value)}
            className="font-mono text-sm border-2 focus-visible:ring-offset-0"
          />
          <p
            id="qr-error"
            role="alert"
            className={`text-xs text-destructive min-h-[1rem] ${error ? "" : "invisible"}`}
          >
            {error}
          </p>
        </div>

        {/* QR code preview */}
        <div className="flex items-center justify-center min-h-[200px] rounded-lg bg-secondary/30">
          <div
            className={`p-4 bg-white rounded-md shadow-sm ${hasQR ? "" : "hidden"}`}
            style={{ imageRendering: "pixelated" }}
          >
            <canvas ref={canvasRef} role="img" aria-label="Generated QR code" />
          </div>
          {!hasQR && (
            <p className="text-sm text-muted-foreground italic">
              Your QR code will appear here
            </p>
          )}
        </div>

        {/* Export buttons */}
        {hasQR && (
          <div className="flex gap-3">
            <Button
              onClick={exportPNG}
              className="flex-1 gap-2 font-mono text-xs transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <Download className="w-4 h-4" />
              Export PNG
            </Button>
            <Button
              onClick={exportSVG}
              variant="outline"
              className="flex-1 gap-2 font-mono text-xs border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <Download className="w-4 h-4" />
              Export SVG
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRGenerator;
