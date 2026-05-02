import { useEffect, useRef } from "react";

/** PERF: Uses transform: scaleX() instead of width to avoid layout thrashing.
 *  Also uses refs + direct DOM mutation instead of useState to avoid
 *  React re-renders on every scroll frame. */
const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? window.scrollY / h : 0;
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${pct})`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-line/30" aria-hidden>
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-ice"
        style={{
          transform: "scaleX(0)",
          boxShadow: "0 0 16px hsl(var(--accent) / 0.6), 0 0 4px hsl(var(--accent))",
          willChange: "transform",
        }}
      />
    </div>
  );
};

export default ScrollProgress;
