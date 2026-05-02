import { useEffect, useRef, useState } from "react";

const Footer = () => {
  const items = ["SAMADFALLAH", "EST. 2014", "CAP NO. 287", "LEFT-ARM MEDIUM", "287 WICKETS", "SAMADFALLAH", "EST. 2014", "CAP NO. 287", "LEFT-ARM MEDIUM", "287 WICKETS"];
  const [showTop, setShowTop] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="relative overflow-hidden border-t border-line bg-background pb-10 pt-20">
        {/* Marquee ticker */}
        <div className="overflow-hidden border-y border-line py-10">
          <div className="flex animate-ticker gap-12 whitespace-nowrap">
            {[...items, ...items].map((t, i) => (
              <span key={i} className="font-display text-7xl uppercase tracking-tight text-foreground/90 md:text-9xl">
                {t} <span className="text-accent">★</span>
              </span>
            ))}
          </div>
        </div>

        <div className="container mt-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-accent/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="font-display text-2xl tracking-[0.25em] text-foreground">SAMADFALLAH</span>
            </div>
            <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
              A cinematic record of an ongoing innings. Built with obsession by a fan, for the fans.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="h-px w-8 bg-line" />
              <span className="font-condensed text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                Left-Arm Medium · Indian Cricketer · 287 FC Wickets
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 font-condensed text-xs uppercase tracking-[0.3em] text-muted-foreground md:items-end">
            <span>© {new Date().getFullYear()} — All Rights Reserved</span>
            <span>Press <kbd className="mx-1 rounded border border-line bg-surface px-1.5 py-0.5 text-foreground">S</kbd> for an easter egg</span>
            <button
              onClick={scrollToTop}
              className="mt-2 flex items-center gap-2 text-accent transition-colors hover:text-foreground"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-accent/50">↑</span>
              Back to top
            </button>
          </div>
        </div>

        {/* Bottom glow */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </footer>

      {/* Floating back-to-top button */}
      <button
        ref={btnRef}
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`back-to-top ${showTop ? "visible" : ""}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </>
  );
};

export default Footer;
