import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { id: "journey", label: "Journey" },
  { id: "stats", label: "Stats" },
  { id: "shots", label: "Shots" },
  { id: "highlights", label: "Highlights" },
  { id: "fans", label: "Fans" },
];

const Navbar = ({ onSoundToggle, soundOn }: { onSoundToggle: () => void; soundOn: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    // PERF: Throttle scroll handler with rAF to avoid excessive getBoundingClientRect calls
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 80);
        const sections = ["hero", ...links.map((l) => l.id)];
        for (const id of sections) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
            setActive(id);
            break;
          }
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Close mobile menu on navigation
  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "border-b border-line/50 bg-background/70 py-3 backdrop-blur-xl" : "py-6"
        )}
      >
        <div className="container flex items-center justify-between gap-6">
          <a href="#hero" className="group flex items-center gap-3">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-accent/40" />
              <span className="absolute inset-0 animate-pulse-ring rounded-full border border-accent" />
              <span className="h-2 w-2 rounded-full bg-accent shadow-glow-accent" />
            </span>
            <span className="font-display text-xl tracking-[0.25em] text-foreground">SAMADFALLAH</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={cn(
                  "relative rounded-full px-4 py-2 font-condensed text-sm uppercase tracking-[0.25em] transition-colors",
                  active === l.id ? "text-accent" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active === l.id && (
                  <span className="absolute inset-0 rounded-full border border-accent/40 bg-accent/5" aria-hidden />
                )}
                <span className="relative">{l.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Sound toggle */}
            <button
              onClick={onSoundToggle}
              aria-label={soundOn ? "Mute crowd sound" : "Play crowd sound"}
              className="group flex items-center gap-2 rounded-full border border-line px-4 py-2 font-condensed text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <span className="flex h-3 items-end gap-0.5">
                <span className={cn("w-0.5 bg-current transition-all", soundOn ? "h-2 animate-pulse" : "h-1")} />
                <span className={cn("w-0.5 bg-current transition-all", soundOn ? "h-3 animate-pulse [animation-delay:120ms]" : "h-1.5")} />
                <span className={cn("w-0.5 bg-current transition-all", soundOn ? "h-1.5 animate-pulse [animation-delay:240ms]" : "h-1")} />
              </span>
              <span className="hidden sm:inline">{soundOn ? "Crowd On" : "Crowd Off"}</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span className={cn(
                "h-px w-6 bg-foreground transition-all duration-300",
                mobileOpen && "translate-y-[3.5px] rotate-45"
              )} />
              <span className={cn(
                "h-px w-6 bg-foreground transition-all duration-300",
                mobileOpen && "-translate-y-[3.5px] -rotate-45"
              )} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay nav */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/98 backdrop-blur-2xl transition-all duration-500 md:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <nav className="flex flex-col items-center gap-2">
          {links.map((l, i) => (
            <button
              key={l.id}
              onClick={() => handleNavClick(l.id)}
              className={cn(
                "font-display text-5xl uppercase tracking-[0.15em] transition-all duration-300",
                active === l.id ? "text-accent" : "text-foreground/70 hover:text-foreground",
              )}
              style={{
                transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms",
                transform: mobileOpen ? "translateY(0)" : "translateY(30px)",
                opacity: mobileOpen ? 1 : 0,
              }}
            >
              {l.label}
            </button>
          ))}
        </nav>
        <div
          className="mt-12 flex items-center gap-4 font-condensed text-xs uppercase tracking-[0.4em] text-muted-foreground transition-all duration-500"
          style={{
            transitionDelay: mobileOpen ? "350ms" : "0ms",
            opacity: mobileOpen ? 1 : 0,
          }}
        >
          <span className="h-px w-8 bg-accent" />
          SAMADFALLAH
          <span className="h-px w-8 bg-accent" />
        </div>
      </div>
    </>
  );
};

export default Navbar;
