import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import DarkModeToggle from "@/components/DarkModeToggle";
import QRCode from "qrcode";
import { LightRays } from "@/components/ui/light-rays";

const UPI_ID = "thevigesh17@oksbi";
const UPI_NAME = "Vigesh V S";
const UPI_URI = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}`;

const retroBtn =
  "border-2 border-current rounded-[5px] shadow-[4px_4px_0_currentColor] px-4 py-2 text-sm font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_currentColor] transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

const Contribute = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, UPI_URI, {
        width: 250,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background px-4 gap-6 relative overflow-hidden"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      <LightRays />
      <div className="fixed top-4 right-8 z-50">
        <DarkModeToggle />
      </div>

      <Card className="relative z-10 w-full max-w-sm border-2 border-border bg-card shadow-xl">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <h1 className="text-xl font-bold text-foreground">Contribute</h1>

          <div className="p-3 bg-white rounded-md shadow-sm">
            <canvas ref={canvasRef} />
          </div>

          <p className="text-sm font-bold text-foreground">{UPI_NAME}</p>
          <p className="text-xs text-muted-foreground">UPI ID: {UPI_ID}</p>
          <a
            href={UPI_URI}
            className={`${retroBtn} text-foreground text-center`}
          >
            Pay with UPI
          </a>
          <p className="text-xs text-muted-foreground italic">
            Scan to pay with any UPI app
          </p>
        </CardContent>
      </Card>

      <Link to="/" className={`relative z-10 ${retroBtn} text-foreground`}>
        ← Back
      </Link>
    </div>
  );
};

export default Contribute;
