/**
 * Index page — Two-section scroll-snap layout.
 * Section 1: Hero with Pixie (pic_1) + speech bubble.
 * Section 2: Side-facing Pixie (pic_2) left + QR generator right.
 */
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import pic1 from "@/assets/pic_1.png";
import pic2 from "@/assets/pic_2.png";
import QRGenerator from "@/components/QRGenerator";
import TopBar from "@/components/TopBar";
import BottomBar from "@/components/BottomBar";
import { LightRays } from "@/components/ui/light-rays";

const Index = () => {
  const section2Ref = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [section2Visible, setSection2Visible] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const el = section2Ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSection2Visible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;
    const onScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = container;
      setAtBottom(scrollTop + clientHeight >= scrollHeight - 50);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      ref={mainRef}
      className="h-screen overflow-y-auto scrollbar-hide"
      style={{ scrollBehavior: "smooth" }}
    >
      <TopBar onLogoClick={() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })} />
      {/* Section 1 — Hero */}
      <section
        className="h-screen flex flex-col items-center justify-center bg-secondary/20 relative overflow-hidden"
      >
        <LightRays />
        {/* Speech bubble */}
        <div className="relative bg-card border-2 border-border rounded-xl px-5 py-3 shadow-md mb-1">
          <p
            className="text-base font-bold text-foreground whitespace-nowrap"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            Hi, I am Pixie!
          </p>
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid hsl(var(--border))",
            }}
          />
        </div>

        {/* Pic 1 */}
        <img
          src={pic1}
          alt="Pixie character"
          className="w-[90vw] h-[90vw] md:w-[75vh] md:h-[75vh] object-contain"
        />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 flex flex-col items-center gap-1 text-muted-foreground animate-bounce">
          <span className="text-xs font-mono">Scroll to generate QR</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* Section 2 — Generator */}
      <section
        ref={section2Ref}
        className="md:min-h-screen flex items-start pt-20 md:items-center md:pt-0 pb-20 md:pb-0 justify-center bg-background relative overflow-hidden"
      >
        <LightRays />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full px-4 md:px-8">
          {/* Pic 2 — hidden on mobile */}
          <div
            className={`hidden md:flex md:w-1/2 items-center justify-center transition-all duration-500 ease-out ${
              section2Visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <img
              src={pic2}
              alt="Pixie side view"
              className="w-full h-[85vh] object-contain"
            />
          </div>

          {/* QR Generator */}
          <div
            className={`md:w-1/2 flex items-center justify-center transition-all duration-500 ease-out delay-150 ${
              section2Visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <QRGenerator />
          </div>
        </div>
      </section>

      <BottomBar
        visible={atBottom}
        onScrollToTop={() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </main>
  );
};

export default Index;
