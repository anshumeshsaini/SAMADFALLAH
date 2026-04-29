import { useEffect, useState } from "react";
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

  useEffect(() => {
    const onScroll = () => {
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
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
