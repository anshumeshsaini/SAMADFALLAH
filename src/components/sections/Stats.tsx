import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LottieIcon from "../LottieIcon";
import wicketAnim from "@/assets/lottie/wicket-stumps.json";
import pulseAnim from "@/assets/lottie/pulse-dot.json";
import ballAnim from "@/assets/lottie/cricket-ball.json";

gsap.registerPlugin(ScrollTrigger);

interface RadialProps {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  detail: string;
  format: string;
}

const Radial = ({ label, value, max, suffix = "", detail, format }: RadialProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const RADIUS = 86;
  const CX = 100;
  const CY = 110;
  // Speedometer: 270° sweep, gap at bottom. Start = 135°, End = 405° (i.e. 45°)
  const START_ANGLE = 135;
  const SWEEP = 270;
  const pct = Math.min(value / max, 1);

  // Build the arc path (full track)
  const polar = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  };
  const trackStart = polar(START_ANGLE, RADIUS);
  const trackEnd = polar(START_ANGLE + SWEEP, RADIUS);
  const trackPath = `M ${trackStart.x} ${trackStart.y} A ${RADIUS} ${RADIUS} 0 1 1 ${trackEnd.x} ${trackEnd.y}`;

  useEffect(() => {
    const arcLen = arcRef.current?.getTotalLength() || 0;
    if (arcRef.current) {
      arcRef.current.style.strokeDasharray = `${arcLen}`;
      arcRef.current.style.strokeDashoffset = `${arcLen}`;
    }

    const obj = { v: 0 };
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current!, start: "top 75%" },
    });
    tl.to(obj, {
      v: 1,
      duration: 2.4,
      ease: "expo.out",
      onUpdate: () => {
        if (arcRef.current) {
          arcRef.current.style.strokeDashoffset = `${arcLen - arcLen * pct * obj.v}`;
        }
        if (needleRef.current) {
          const angle = START_ANGLE + SWEEP * pct * obj.v;
          needleRef.current.setAttribute("transform", `rotate(${angle} ${CX} ${CY})`);
        }
        if (numRef.current) {
          numRef.current.textContent = Math.round(value * obj.v).toString();
        }
      },
    });

    // PERF: Mouse tilt using quickTo for smoother, cheaper per-frame updates
    const el = ref.current!;
    const qRotY = gsap.quickTo(el, "rotateY", { duration: 0.6, ease: "power3.out" });
    const qRotX = gsap.quickTo(el, "rotateX", { duration: 0.6, ease: "power3.out" });
    gsap.set(el, { transformPerspective: 900 });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      qRotY(x * 14);
      qRotX(-y * 14);
    };
    const onLeave = () => {
      qRotY(0);
      qRotX(0);
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [pct, value]);

  // Build tick marks for speedometer (only across the 270° arc)
  const TICK_COUNT = 41;
  const ticks = Array.from({ length: TICK_COUNT }).map((_, i) => {
    const t = i / (TICK_COUNT - 1);
    const angle = START_ANGLE + SWEEP * t;
    const isMajor = i % 5 === 0;
    const inner = isMajor ? 68 : 74;
    const outer = 80;
    const p1 = polar(angle, inner);
    const p2 = polar(angle, outer);
    const active = t <= pct;
    return (
      <line
        key={i}
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke={active ? "hsl(var(--accent))" : "hsl(var(--line))"}
        strokeWidth={isMajor ? 1.6 : 0.7}
      />
    );
  });

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center"
      data-cursor="hover"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative h-60 w-60">
        {/* Glow ring — PERF: reduced blur from 3xl (48px) to 2xl (40px) */}
        <div className="absolute inset-0 rounded-full bg-gradient-ice opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-30" />
        <svg viewBox="0 0 200 220" className="relative h-full w-full">
          {ticks}
          {/* Track */}
          <path
            d={trackPath}
            fill="none"
            stroke="hsl(var(--line))"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Progress arc */}
          <path
            ref={arcRef}
            d={trackPath}
            fill="none"
            stroke="url(#radialGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 14px hsl(var(--accent) / 0.7))" }}
          />
          {/* Needle */}
          <g ref={needleRef} transform={`rotate(${START_ANGLE} ${CX} ${CY})`}>
            <line
              x1={CX}
              y1={CY}
              x2={CX}
              y2={CY - RADIUS + 8}
              stroke="hsl(var(--accent))"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 6px hsl(var(--accent)))" }}
            />
            <circle cx={CX} cy={CY - RADIUS + 8} r="3" fill="hsl(var(--accent))" />
          </g>
          {/* Hub */}
          <circle cx={CX} cy={CY} r="9" fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth="1.5" />
          <circle cx={CX} cy={CY} r="3" fill="hsl(var(--accent))" />
          <defs>
            <linearGradient id="radialGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="pointer-events-none absolute inset-x-0 top-[22%] flex flex-col items-center">
          <span ref={numRef} className="font-display text-5xl text-foreground">0</span>
          <span className="mt-1 font-condensed text-xs uppercase tracking-[0.3em] text-accent">{suffix}</span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <div className="font-condensed text-[10px] uppercase tracking-[0.4em] text-muted-foreground">{format}</div>
        <div className="mt-1 font-display text-xl uppercase tracking-[0.2em] text-foreground">{label}</div>
        <div className="mt-2 max-w-[220px] text-xs leading-relaxed text-muted-foreground opacity-60 transition-opacity duration-500 group-hover:opacity-100">
          {detail}
        </div>
      </div>
    </div>
  );
};

interface BarProps { label: string; value: number; suffix: string; max?: number; }
const Bar = ({ label, value, suffix, max = 10 }: BarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: 1,
      duration: 2,
      ease: "expo.out",
      scrollTrigger: { trigger: ref.current!, start: "top 80%" },
      onUpdate: () => {
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${(value / max) * obj.v})`;
        if (numRef.current) numRef.current.textContent = Math.round(value * obj.v).toString();
      },
    });
  }, [value, max]);
  return (
    <div ref={ref} className="group border-t border-line py-6 transition-colors hover:border-accent/40">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-condensed text-sm uppercase tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-foreground">{label}</span>
        <span className="font-display text-3xl text-foreground md:text-4xl">
          <span ref={numRef}>0</span>
          <span className="ml-1 text-base text-accent">{suffix}</span>
        </span>
      </div>
      <div className="mt-4 h-[2px] overflow-hidden bg-line">
        <div ref={fillRef} className="h-full origin-left bg-gradient-ice shadow-[0_0_12px_hsl(var(--accent)/0.6)]" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
};

const Stats = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scoreboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-stats-head]", {
        y: 60, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current!, start: "top 70%" },
      });

      // Multi-layer parallax for ambient orbs
      gsap.to("[data-stats-bg-deep]", {
        yPercent: -55,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to("[data-stats-bg-mid]", {
        yPercent: -28,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to("[data-stats-bg-shallow]", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top bottom", end: "bottom top", scrub: true },
      });

      // Counter-parallax giant watermark
      gsap.fromTo("[data-stats-watermark]",
        { yPercent: 30 },
        {
          yPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current!, start: "top bottom", end: "bottom top", scrub: true },
        }
      );

      // PERF: Mouse parallax — use quickTo for the most-animated elements
      const deepEls = gsap.utils.toArray<HTMLElement>("[data-stats-bg-deep]");
      const midEls = gsap.utils.toArray<HTMLElement>("[data-stats-bg-mid]");
      const wmEls = gsap.utils.toArray<HTMLElement>("[data-stats-watermark]");

      const onMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(deepEls, { x: x * 60, y: y * 40, duration: 1.2, ease: "power3.out", overwrite: "auto" });
        gsap.to(midEls, { x: x * 30, y: y * 20, duration: 1, ease: "power3.out", overwrite: "auto" });
        gsap.to(wmEls, { x: x * -25, duration: 1.4, ease: "power3.out", overwrite: "auto" });
      };
      sectionRef.current!.addEventListener("mousemove", onMove, { passive: true });

      // Scoreboard flip + tilt — PERF: use quickTo for tile tilt
      const tiles = scoreboardRef.current!.querySelectorAll<HTMLElement>("[data-tile]");
      tiles.forEach((tile) => {
        const target = parseInt(tile.dataset.flip || "0", 10);
        const digit = tile.querySelector<HTMLElement>("[data-flip-digit]");
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2.8,
          ease: "power3.out",
          scrollTrigger: { trigger: scoreboardRef.current!, start: "top 75%" },
          onUpdate: () => { if (digit) digit.textContent = Math.round(obj.v).toLocaleString(); },
        });

        gsap.set(tile, { transformPerspective: 900 });
        const qTileRotY = gsap.quickTo(tile, "rotateY", { duration: 0.5, ease: "power3.out" });
        const qTileRotX = gsap.quickTo(tile, "rotateX", { duration: 0.5, ease: "power3.out" });
        const inner = tile.querySelector<HTMLElement>("[data-tile-inner]");
        const qInnerX = inner ? gsap.quickTo(inner, "x", { duration: 0.5, ease: "power3.out" }) : null;
        const qInnerY = inner ? gsap.quickTo(inner, "y", { duration: 0.5, ease: "power3.out" }) : null;

        const onTileMove = (e: MouseEvent) => {
          const r = tile.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          qTileRotY(x * 10);
          qTileRotX(-y * 10);
          qInnerX?.(x * 18);
          qInnerY?.(y * 14);
        };
        const onTileLeave = () => {
          qTileRotY(0);
          qTileRotX(0);
          qInnerX?.(0);
          qInnerY?.(0);
        };
        tile.addEventListener("mousemove", onTileMove, { passive: true });
        tile.addEventListener("mouseleave", onTileLeave);
      });

      // Reveal scoreboard tiles
      gsap.from("[data-tile]", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: scoreboardRef.current!, start: "top 80%" },
      });

      return () => {
        sectionRef.current?.removeEventListener("mousemove", onMove);
      };
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="stats" ref={sectionRef} className="section-bleed-top section-bleed-bottom relative overflow-hidden bg-surface py-32 md:py-48">
      {/* DEEP layer — PERF: reduced blur from 160px to 80px */}
      <div data-stats-bg-deep className="pointer-events-none absolute -left-32 top-1/4 h-[640px] w-[640px] rounded-full bg-primary/15 blur-[80px]" />
      <div data-stats-bg-deep className="pointer-events-none absolute -right-32 bottom-1/5 h-[640px] w-[640px] rounded-full bg-accent/12 blur-[80px]" />

      {/* MID layer — PERF: reduced blur from 110-120px to 60-70px */}
      <div data-stats-bg-mid className="pointer-events-none absolute left-[42%] top-[8%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[60px]" />
      <div data-stats-bg-mid className="pointer-events-none absolute left-[12%] bottom-[10%] h-[360px] w-[360px] rounded-full bg-accent/10 blur-[70px]" />

      {/* SHALLOW vertical accent rules */}
      <div data-stats-bg-shallow className="pointer-events-none absolute left-[8%] top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
      <div data-stats-bg-shallow className="pointer-events-none absolute right-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

      {/* Giant counter-parallax watermark */}
      <div
        data-stats-watermark
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[18%] flex justify-center font-display text-[42vw] leading-none text-foreground/[0.025] md:text-[28vw]"
      >
        287
      </div>

      <div className="container relative">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:mb-24 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div data-stats-head className="eyebrow mb-8 flex items-center gap-3">
              <span className="block h-6 w-6"><LottieIcon data={wicketAnim} /></span>
              Chapter 02 — The Numbers
            </div>
            <h2 data-stats-head className="display-2 font-display text-foreground">
              Career <br /><span className="text-accent">Bowling Stats.</span>
            </h2>
            <div data-stats-head className="mt-6 flex flex-wrap items-center gap-4 font-condensed text-xs uppercase tracking-[0.4em] text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="block h-3 w-3"><LottieIcon data={pulseAnim} /></span>
                Live Career Snapshot
              </span>
              <span className="h-px w-8 bg-line" />
              <span>Left-Arm Medium · Indian Cricketer</span>
            </div>
          </div>
          <div data-stats-head className="max-w-sm">
            <p className="font-sans text-base text-muted-foreground">
              Numbers don't tell stories — until they move. Every wicket. Every over. Earned.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="block h-8 w-8"><LottieIcon data={ballAnim} /></span>
              <span className="font-condensed text-[10px] uppercase tracking-[0.4em] text-accent">17 years · 3 formats</span>
            </div>
          </div>
        </div>

        {/* Scoreboard hero tiles */}
        <div
          ref={scoreboardRef}
          className="mb-24 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-4"
        >
          {[
            { label: "First-Class Wickets", value: 287, suffix: "", caption: "78 matches" },
            { label: "Matches Played", value: 186, suffix: "", caption: "Across formats" },
            { label: "FC Economy", value: 2, suffix: ".72", caption: "Runs / over" },
            { label: "T20 Average", value: 25, suffix: ".5", caption: "Lowest of all formats" },
          ].map((s) => (
            <div
              key={s.label}
              data-tile
              data-flip={s.value}
              data-cursor="hover"
              className="group relative overflow-hidden bg-background p-8 md:p-10"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-accent/0 opacity-0 transition-opacity duration-700 group-hover:from-primary/10 group-hover:to-accent/10 group-hover:opacity-100" />
              {/* Corner ticks */}
              <span className="absolute left-3 top-3 h-2 w-2 border-l border-t border-accent/40" />
              <span className="absolute right-3 top-3 h-2 w-2 border-r border-t border-accent/40" />
              <span className="absolute bottom-3 left-3 h-2 w-2 border-b border-l border-accent/40" />
              <span className="absolute bottom-3 right-3 h-2 w-2 border-b border-r border-accent/40" />

              <div data-tile-inner className="relative">
                <div className="flex items-center justify-between font-condensed text-[10px] uppercase tracking-[0.4em] text-accent">
                  <span>{s.label}</span>
                  <span className="block h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
                </div>
                <div className="mt-6 font-display text-5xl text-foreground md:text-7xl">
                  <span data-flip-digit>0</span>
                  {s.suffix && <span className="text-accent">{s.suffix}</span>}
                </div>
                <div className="mt-3 font-condensed text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {s.caption}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Radials */}
        <div className="grid gap-12 md:grid-cols-3" style={{ perspective: "1200px" }}>
          <Radial format="First Class" label="Wickets Taken" value={287} max={300} suffix="WKTS" detail="78 matches between 2007–19. A workhorse with the new ball — 287 scalps and counting." />
          <Radial format="List A" label="Wickets Taken" value={75} max={100} suffix="WKTS" detail="50 List A matches across 2008–21. Economical 4.89 with a 28.3 average — the pressure builder." />
          <Radial format="Twenty20" label="Wickets Taken" value={62} max={100} suffix="WKTS" detail="58 T20 matches. 25.5 average — the lowest of any format. Death-overs specialist." />
        </div>

        {/* Bars */}
        <div className="mt-24 grid gap-x-16 md:grid-cols-2">
          <div>
            <div className="mb-4 font-condensed text-[10px] uppercase tracking-[0.5em] text-accent">Bowling Average</div>
            <Bar label="1st Class" value={28} suffix=".5" max={40} />
            <Bar label="List A" value={28} suffix=".3" max={40} />
            <Bar label="T20" value={25} suffix=".5" max={40} />
          </div>
          <div>
            <div className="mb-4 font-condensed text-[10px] uppercase tracking-[0.5em] text-accent">Economy Rate</div>
            <Bar label="1st Class" value={2} suffix=".72" max={10} />
            <Bar label="List A" value={4} suffix=".89" max={10} />
            <Bar label="T20" value={7} suffix=".37" max={10} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
