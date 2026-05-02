import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Preloader = ({ onDone }: { onDone: () => void }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const obj = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 1.1,
          ease: "expo.inOut",
          onComplete: () => {
            setHidden(true);
            onDone();
          },
        });
      },
    });
    tl.to(obj, {
      v: 100,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = Math.round(obj.v).toString().padStart(3, "0");
        if (barRef.current) barRef.current.style.width = `${obj.v}%`;
      },
    });
  }, [onDone]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-background"
      aria-hidden
    >
      <div className="flex flex-col items-center gap-12 text-center">
        <div className="space-y-4">
          <div className="font-display text-[10px] uppercase tracking-[0.6em] text-accent/60">The Arena Awaits</div>
          <div className="flex items-baseline justify-center gap-3 font-display">
            <span ref={counterRef} className="text-8xl font-bold tabular-nums text-foreground sm:text-[10rem]">000</span>
            <span className="text-2xl text-muted-foreground/40">/ 100</span>
          </div>
        </div>

        <div className="relative h-px w-64 overflow-hidden bg-line/20 sm:w-80">
          <div ref={barRef} className="h-full w-0 bg-gradient-ice shadow-[0_0_15px_hsl(var(--accent)/0.5)]" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="font-display text-sm uppercase tracking-[0.4em] text-foreground">SAMADFALLAH</div>
          <div className="h-px w-8 bg-accent/40" />
          <div className="font-condensed text-[9px] uppercase tracking-[0.5em] text-muted-foreground/60">Cinematic Record · Est. 2014</div>
        </div>
      </div>

      {/* Ambient background glow for preloader */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -right-1/4 -bottom-1/4 h-1/2 w-1/2 rounded-full bg-accent/5 blur-[120px]" />
      </div>
    </div>
  );
};

export default Preloader;
