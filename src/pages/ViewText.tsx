/**
 * ViewText: shows the text stored in a QR code made by this app.
 * Reads the `text` query parameter and renders it as plain text only
 * (never as HTML and never as a clickable link), because anyone can
 * create a link to this page with any text in it.
 */
import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prepareViewText } from "@/lib/qr";

const ViewText = () => {
  const [searchParams] = useSearchParams();
  const { text, truncated } = prepareViewText(searchParams.get("text"));

  // Pages made from user-supplied text should not show up in search engines.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="w-full max-w-lg border-2 border-border bg-card shadow-xl">
        <CardContent className="p-8 space-y-6">
          <h1
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            QR Code Content
          </h1>

          <div
            role="note"
            className="flex gap-3 rounded-lg border-2 border-border bg-secondary/40 p-3 text-xs text-muted-foreground"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              Anyone can make a QR code that shows any text. Don&apos;t trust it
              blindly, and never enter passwords, codes or payment details because
              of what it says.
            </p>
          </div>

          {text ? (
            <div className="rounded-lg bg-secondary/30 p-6">
              <p className="text-foreground whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
                {text}
              </p>
              {truncated && (
                <p className="mt-3 text-xs text-muted-foreground italic">
                  Only the first part of this text is shown.
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground italic text-sm">
              No text content found in this QR code.
            </p>
          )}

          <Link to="/" className="block">
            <Button
              variant="outline"
              className="w-full font-mono text-xs border-2"
            >
              ← Generate your own QR code
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
};

export default ViewText;
