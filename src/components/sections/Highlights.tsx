import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LottieIcon from "../LottieIcon";
import pulseAnim from "@/assets/lottie/pulse-dot.json";
import wicketAnim from "@/assets/lottie/wicket-stumps.json";
import stadium from "@/assets/samad-mca.jpg";
import celebration from "@/assets/samad-celebration.jpg";
import titans from "@/assets/samad-titans.jpg";
import wicket from "@/assets/samad-wicket.jpg";
import bw from "@/assets/samad-bw.jpg";
import llc from "@/assets/samad-llc.jpg";

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  { title: "5-Wicket Haul", meta: "Ranji Trophy · 1st Class", duration: "08:24", img: celebration, tag: "FIFER" },
  { title: "287 Wickets Strong", meta: "First Class Career · 78 Matches", duration: "04:11", img: wicket, tag: "RECORD" },
  { title: "MCA Pune Spell", meta: "Maharashtra · vs Saurashtra", duration: "12:02", img: stadium, tag: "FIRST CLASS" },
  { title: "LLC Masters Debut", meta: "Eagle Nashik Titans · 2024", duration: "00:58", img: titans, tag: "LEGENDS" },
  { title: "Sharing The Crease", meta: "with Afridi & Akhtar", duration: "01:32", img: llc, tag: "LEGENDS" },
  { title: "The Maharashtra Era", meta: "Documentary · 2007–2021", duration: "21:00", img: bw, tag: "FILM" },
];

const Highlights = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hl-head]", {
        y: 60, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current!, start: "top 70%" },
      });

      gsap.from("[data-hl-card]", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-hl-grid]", start: "top 75%" },
      });

      // Per-card scroll parallax on inner image
      gsap.utils.toArray<HTMLElement>("[data-hl-img]").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -12, scale: 1.18 },
          {
            yPercent: 12,
            scale: 1.18,
            ease: "none",
            scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      // Background parallax for ambient orbs
      gsap.to("[data-hl-bg-deep]", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hl-bg-mid]", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top bottom", end: "bottom top", scrub: true },
      });

      // Mouse-move tilt on cards
      const cards = gsap.utils.toArray<HTMLElement>("[data-hl-card]");
      cards.forEach((card) => {
        const inner = card.querySelector<HTMLElement>("[data-hl-img]");
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, transformPerspective: 800, duration: 0.6, ease: "power3.out" });
          gsap.to(inner, { x: x * 30, y: y * 24, duration: 0.6, ease: "power3.out" });
        };
        const onLeave = () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power3.out" });
          gsap.to(inner, { x: 0, y: 0, duration: 0.8, ease: "power3.out" });
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="highlights" ref={sectionRef} className="relative overflow-hidden bg-background py-32 md:py-48">
      {/* Multi-layer parallax background */}
      <div data-hl-bg-deep className="pointer-events-none absolute -left-32 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[140px]" />
      <div data-hl-bg-mid className="pointer-events-none absolute right-[-10%] top-[40%] h-[480px] w-[480px] rounded-full bg-accent/10 blur-[120px]" />
      <div data-hl-bg-deep className="pointer-events-none absolute left-[40%] bottom-[5%] h-[380px] w-[380px] rounded-full bg-primary/8 blur-[100px]" />

      <div className="container relative">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:mb-20 md:flex-row md:items-end">
          <div>
            <div data-hl-head className="eyebrow mb-8">Chapter 04 — The Reel</div>
            <h2 data-hl-head className="display-2 font-display text-foreground">Match <span className="text-accent">Highlights.</span></h2>
          </div>
          <div data-hl-head className="flex items-center gap-3 font-condensed text-xs uppercase tracking-[0.4em] text-muted-foreground">
            <span className="block h-6 w-6"><LottieIcon data={pulseAnim} /></span>
            6 of 142 matches
          </div>
        </div>

        <div data-hl-grid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h, i) => (
            <a
              key={h.title}
              href="#"
              data-hl-card
              data-cursor="hover"
              className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-surface transition-shadow duration-500 hover:shadow-card md:aspect-[3/4]"
              style={{ gridRow: i === 0 ? "span 1" : undefined, transformStyle: "preserve-3d" }}
            >
              <div data-hl-img className="img-distort absolute inset-0 will-change-transform">
                <img
                  src={h.img}
                  alt={h.title}
                  loading="lazy"
                  width={1200}
                  height={1500}
                />
                <div className="scanlines" />
                <div className="glitch-slice" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent transition-opacity duration-500 group-hover:from-background/95" />

              {/* Top row */}
              <div className="absolute left-4 top-4 flex w-[calc(100%-2rem)] items-start justify-between gap-2">
                <span className="flex items-center gap-2 rounded-full border border-accent/50 bg-background/40 px-3 py-1 font-condensed text-[10px] uppercase tracking-[0.3em] text-accent backdrop-blur">
                  {h.tag === "FIFER" && <span className="block h-3 w-3"><LottieIcon data={wicketAnim} /></span>}
                  {h.tag}
                </span>
                <span className="font-condensed text-xs uppercase tracking-[0.3em] text-foreground/80">{h.duration}</span>
              </div>

              {/* Play indicator on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-accent bg-background/50 backdrop-blur">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full border border-accent" />
                  <span className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-accent" />
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute inset-x-4 bottom-4">
                <div className="font-condensed text-xs uppercase tracking-[0.3em] text-accent">{h.meta}</div>
                <h3 className="mt-1 font-display text-3xl uppercase leading-tight text-foreground md:text-4xl">{h.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
