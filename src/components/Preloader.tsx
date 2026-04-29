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
      <div className="flex flex-col items-center gap-8">
        <div className="font-display text-xs uppercase tracking-[0.5em] text-accent">Loading the Innings</div>
        <div className="flex items-baseline gap-2 font-display">
          <span ref={counterRef} className="text-7xl text-foreground sm:text-9xl">000</span>
          <span className="text-2xl text-muted-foreground">/100</span>
        </div>
        <div className="h-px w-72 overflow-hidden bg-line sm:w-96">
          <div ref={barRef} className="h-full w-0 bg-gradient-ice" />
        </div>
        <div className="font-condensed text-xs uppercase tracking-[0.4em] text-muted-foreground">SAMADFALLAH · EST. 2014</div>
      </div>
    </div>
  );
};

export default Preloader;
