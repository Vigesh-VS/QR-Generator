/**
 * QRGenerator — The main QR code generation interface.
 * Generates QR codes in real-time as the user types,
 * with PNG and SVG export functionality.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";

const QRGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [svgMarkup, setSvgMarkup] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  /** Generate QR code to both canvas (for PNG) and SVG string */
  const generateQR = useCallback(async (text: string) => {
    if (!text.trim()) {
      setSvgMarkup("");
      // Clear canvas
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      return;
    }

    try {
      const opts: QRCode.QRCodeRenderersOptions = {
        width: 280,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "M",
      };

      // Detect URLs: either starts with http(s):// or looks like a domain (e.g. youtube.com)
      const isUrl = /^(https?:\/\/)/i.test(text) ||
                    /^[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/.*)?$/.test(text.trim());
      const finalUrl = isUrl
        ? (text.match(/^https?:\/\//i) ? text : `https://${text}`)
        : null;
      const encodedValue = finalUrl
        ? finalUrl
        : `${window.location.origin}/view?text=${encodeURIComponent(text)}`;

      // Render to canvas for PNG export
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, encodedValue, opts);
      }

      // Generate SVG string for SVG export
      const svg = await QRCode.toString(encodedValue, { ...opts, type: "svg" });
      setSvgMarkup(svg);
    } catch (err) {
      console.error("QR generation failed:", err);
    }
  }, []);

  /** Debounced generation — triggers 150ms after user stops typing */
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => generateQR(inputText), 150);
    return () => clearTimeout(debounceRef.current);
  }, [inputText, generateQR]);

  /** Export QR code as PNG via canvas-to-blob */
  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  /** Export QR code as SVG file */
  const exportSVG = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasContent = inputText.trim().length > 0;

  return (
    <Card className="w-full max-w-md border-2 border-border bg-card shadow-xl">
      <CardContent className="p-6 space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "'Courier New', monospace" }}>
            QR Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Paste any text or URL to generate a QR code.
          </p>
        </div>

        {/* Input field — accepts anything, no validation */}
        <Input
          type="text"
          placeholder="Enter text or URL..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="font-mono text-sm border-2 focus-visible:ring-offset-0"
        />

        {/* QR Code preview area */}
        <div className="flex items-center justify-center min-h-[200px] rounded-lg bg-secondary/30">
          {hasContent ? (
            <div className="p-4 bg-white rounded-md shadow-sm"
                 style={{ imageRendering: "pixelated" }}>
              <canvas ref={canvasRef} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Your QR code will appear here
            </p>
          )}
          {/* Hidden canvas when no content */}
          {!hasContent && <canvas ref={canvasRef} className="hidden" />}
        </div>

        {/* Export buttons */}
        {hasContent && (
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
