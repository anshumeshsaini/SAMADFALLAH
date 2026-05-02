import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LottieIcon from "../LottieIcon";
import ballAnim from "@/assets/lottie/cricket-ball.json";
import pulseAnim from "@/assets/lottie/pulse-dot.json";
import p1 from "@/assets/samad-celebration.jpg";
import p2 from "@/assets/samad-titans.jpg";
import p3 from "@/assets/samad-mca.jpg";
import p4 from "@/assets/samad-wicket.jpg";
import p5 from "@/assets/samad-bw.jpg";

gsap.registerPlugin(ScrollTrigger);

/**
 * Horizontal Story Reel — pinned vertical-scroll → horizontal pan with snapping.
 * Each panel has 3 parallax layers (deep / mid / shallow) plus headline counter-parallax.
 */
const panels = [
  {
    chapter: "REEL 01",
    year: "2007",
    title: "First Ball",
    line: "Maharashtra. Ranji Trophy. A left-arm seamer with a story to write.",
    img: p1,
    accent: "DEBUT",
  },
  {
    chapter: "REEL 02",
    year: "2013",
    title: "The Spell",
    line: "5 wickets in 14 overs. The new ball became a personal weapon.",
    img: p3,
    accent: "5-WKT HAUL",
  },
  {
    chapter: "REEL 03",
    year: "2018",
    title: "Veteran Mode",
    line: "200th first-class wicket. Movement, control, calm.",
    img: p4,
    accent: "MILESTONE",
  },
  {
    chapter: "REEL 04",
    year: "2021",
    title: "The Long Walk",
    line: "From maidans to Maharashtra colours — 75 List A scalps.",
    img: p5,
    accent: "WHITE BALL",
  },
  {
    chapter: "REEL 05",
    year: "2024",
    title: "Legends Stage",
    line: "Eagle Nashik Titans · LLC. Sharing the crease with the all-time greats.",
    img: p2,
    accent: "LLC MASTERS",
  },
];

const StoryReel = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const panelEls = gsap.utils.toArray<HTMLElement>("[data-reel-panel]");
      const total = () => track.scrollWidth - window.innerWidth;

      // Pin + horizontal pan with snap
      const tween = gsap.to(track, {
        x: () => -total(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top top",
          end: () => `+=${total() + window.innerHeight * 0.5}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (panelEls.length - 1),
            duration: { min: 0.2, max: 0.8 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
            // Active chapter index
            const idx = Math.min(
              panels.length - 1,
              Math.round(self.progress * (panels.length - 1))
            );
            if (chapterRef.current) {
              chapterRef.current.textContent = `0${idx + 1} / 0${panels.length}`;
            }
            if (captionRef.current) {
              captionRef.current.textContent = `${panels[idx].year} · ${panels[idx].title}`;
            }
          },
        },
      });

      // Per-panel parallax layers — driven by horizontal containerAnimation
      panelEls.forEach((panel) => {
        const deep = panel.querySelector<HTMLElement>("[data-reel-deep]");
        const mid = panel.querySelector<HTMLElement>("[data-reel-mid]");
        const shallow = panel.querySelector<HTMLElement>("[data-reel-shallow]");
        const big = panel.querySelector<HTMLElement>("[data-reel-big]");
        const heading = panel.querySelector<HTMLElement>("[data-reel-heading]");

        if (deep) {
          gsap.fromTo(
            deep,
            { xPercent: 30, scale: 1.25 },
            {
              xPercent: -30,
              scale: 1.25,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
        if (mid) {
          gsap.fromTo(
            mid,
            { xPercent: 18 },
            {
              xPercent: -18,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
        if (shallow) {
          gsap.fromTo(
            shallow,
            { xPercent: 8 },
            {
              xPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
        if (big) {
          gsap.fromTo(
            big,
            { xPercent: -50 },
            {
              xPercent: 50,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
        if (heading) {
          gsap.fromTo(
            heading,
            { yPercent: 12, opacity: 0.4 },
            {
              yPercent: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left center",
                end: "center center",
                scrub: true,
              },
            }
          );
        }
      });

      // Headline reveal
      gsap.from("[data-reel-head]", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current!, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="reel"
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-background"
    >
      {/* Top header overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 pt-10 md:px-12">
        <div data-reel-head className="eyebrow">
          <span className="block h-5 w-5"><LottieIcon data={ballAnim} /></span>
          The Story Reel
        </div>
        <div data-reel-head className="font-condensed text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Scroll → horizontal · 5 chapters
        </div>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} className="flex h-full will-change-transform">
        {panels.map((p, i) => (
          <article
            key={p.title}
            data-reel-panel
            className="relative flex h-full w-screen flex-shrink-0 items-center justify-center overflow-hidden"
          >
            {/* DEEP layer — image */}
            <div data-reel-deep className="absolute inset-0 will-change-transform">
              <img
                src={p.img}
                alt={p.title}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,hsl(var(--primary)/0.35),transparent_60%)] mix-blend-screen" />
            </div>

            {/* MID layer — orbs — PERF: reduced blur from 120-140px to 70-80px */}
            <div data-reel-mid className="pointer-events-none absolute inset-0 will-change-transform">
              <div className="absolute left-[10%] top-[20%] h-[420px] w-[420px] rounded-full bg-accent/15 blur-[70px]" />
              <div className="absolute right-[8%] bottom-[12%] h-[480px] w-[480px] rounded-full bg-primary/15 blur-[80px]" />
            </div>

            {/* SHALLOW layer — accent rules */}
            <div data-reel-shallow className="pointer-events-none absolute inset-0 will-change-transform">
              <div className="absolute left-[6%] top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
              <div className="absolute right-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
            </div>

            {/* GIANT counter-parallax year */}
            <div
              data-reel-big
              className="pointer-events-none absolute inset-x-0 top-[8%] flex justify-center font-display text-[28vw] leading-none text-foreground/[0.04] md:text-[22vw]"
              aria-hidden
            >
              {p.year}
            </div>

            {/* Foreground content */}
            <div className="relative z-10 flex w-full max-w-6xl flex-col gap-6 px-8 md:px-16">
              <div className="flex items-center gap-4 font-condensed text-xs uppercase tracking-[0.5em] text-accent">
                <span className="h-px w-12 bg-accent" />
                {p.chapter}
                <span className="h-1 w-1 rounded-full bg-accent" />
                {p.accent}
              </div>
              <h3
                data-reel-heading
                className="font-display text-[18vw] uppercase leading-[0.85] text-foreground md:text-[12vw] lg:text-[10vw]"
              >
                {p.title}
              </h3>
              <p className="max-w-lg font-condensed text-base uppercase tracking-[0.15em] text-muted-foreground md:text-lg">
                {p.line}
              </p>
              <div className="mt-4 flex items-center gap-4 font-condensed text-[10px] uppercase tracking-[0.5em] text-foreground/60">
                <span className="block h-3 w-3"><LottieIcon data={pulseAnim} /></span>
                Panel 0{i + 1} / 0{panels.length}
              </div>
            </div>

            {/* Side year tag */}
            <div className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rotate-90 origin-center font-condensed text-[10px] uppercase tracking-[0.5em] text-accent md:right-12">
              · {p.year} ·
            </div>
          </article>
        ))}
      </div>

      {/* Progress + chapter caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-30 px-6 md:px-12">
        <div className="flex items-end justify-between gap-6">
          <div className="flex items-center gap-3 font-condensed text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            <span className="block h-2 w-2 animate-pulse rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
            <span>Now Playing</span>
            <span ref={captionRef} className="text-accent">2007 · First Ball</span>
          </div>
          <span ref={chapterRef} className="font-display text-xl tracking-[0.3em] text-foreground">
            01 / 0{panels.length}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <span className="font-condensed text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Reel</span>
          <div className="relative h-px flex-1 bg-line">
            <div
              ref={progressRef}
              className="absolute inset-0 origin-left bg-gradient-ice shadow-[0_0_12px_hsl(var(--accent)/0.7)]"
              style={{ transform: "scaleX(0)" }}
            />
            {panels.map((_, i) => (
              <span
                key={i}
                className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-foreground/30"
                style={{ left: `${(i / (panels.length - 1)) * 100}%` }}
              />
            ))}
          </div>
          <span className="font-condensed text-[10px] uppercase tracking-[0.4em] text-accent">Live</span>
        </div>
      </div>
    </section>
  );
};

export default StoryReel;
