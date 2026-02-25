/**
 * ViewText — Displays text content from a QR code scan.
 * Reads the `text` query parameter and renders it in a styled card.
 */
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ViewText = () => {
  const [searchParams] = useSearchParams();
  const text = searchParams.get("text");

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

          {text ? (
            <div className="rounded-lg bg-secondary/30 p-6">
              <p className="text-foreground whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
                {text}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground italic text-sm">
              No text content found in this QR code.
            </p>
          )}

          <Link to="/">
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
