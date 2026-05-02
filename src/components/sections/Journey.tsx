import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import debutImg from "@/assets/samad-wicket.jpg";
import centuryImg from "@/assets/samad-mca.jpg";
import trophyImg from "@/assets/samad-titans.jpg";
import awardImg from "@/assets/sd.jpeg"

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    year: "2007",
    title: "First-Class Beginnings",
    place: "Ranji Trophy · Debut",
    body: "A young left-arm medium pacer with a smooth run-up. The Maharashtra circuit got its first taste — and the wickets started to fall.",
    image: trophyImg,
  },
  {
    year: "2013",
    title: "The Breakthrough Spell",
    place: "MCA Stadium · Pune",
    body: "Five-wicket hauls became a habit. Movement off the seam, control with the new ball — the trademark of a craftsman.",
    image: centuryImg,
  },
  {
    year: "2024",
    title: "Legends League Cricket",
    place: "Eagle Nashik Titans",
    body: "From Ranji grounds to LLC stages — sharing the dressing room with legends. The journey from maidans to floodlights, written in 287 first-class wickets.",
    image: awardImg,
  },
];

const Journey = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Eyebrow + heading reveal
      gsap.from("[data-journey-head]", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current!, start: "top 70%" },
      });

      // Multi-layer background parallax
      gsap.to("[data-jn-bg-deep]", {
        yPercent: -40,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to("[data-jn-bg-mid]", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top bottom", end: "bottom top", scrub: true },
      });

      // Each phase
      const phaseEls = gsap.utils.toArray<HTMLElement>("[data-phase]");
      phaseEls.forEach((phase) => {
        const img = phase.querySelector<HTMLElement>("[data-phase-img]")!;
        const text = phase.querySelectorAll<HTMLElement>("[data-phase-text]");
        const year = phase.querySelector<HTMLElement>("[data-phase-year]");

        // Stronger scroll parallax on image
        gsap.fromTo(
          img,
          { scale: 1.3, yPercent: 18 },
          {
            scale: 1.05,
            yPercent: -18,
            ease: "none",
            scrollTrigger: { trigger: phase, start: "top bottom", end: "bottom top", scrub: true },
          }
        );

        // Counter-parallax on big year number
        if (year) {
          gsap.fromTo(
            year,
            { yPercent: 40 },
            {
              yPercent: -40,
              ease: "none",
              scrollTrigger: { trigger: phase, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }

        gsap.from(text, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: phase, start: "top 65%" },
        });

        // PERF: Mouse parallax inside each phase image card — use quickTo
        const card = phase.querySelector<HTMLElement>("[data-phase-card]");
        if (card && img) {
          const qX = gsap.quickTo(img, "x", { duration: 0.7, ease: "power3.out" });
          const qY = gsap.quickTo(img, "y", { duration: 0.7, ease: "power3.out" });
          const onMove = (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            qX(x * 30);
            qY(y * 20);
          };
          const onLeave = () => {
            qX(0);
            qY(0);
          };
          card.addEventListener("mousemove", onMove, { passive: true });
          card.addEventListener("mouseleave", onLeave);
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" ref={sectionRef} className="relative overflow-hidden bg-background py-32 md:py-48">
      {/* Multi-layer parallax bg orbs — PERF: reduced blur from 100-140px to 60-80px */}
      <div data-jn-bg-deep className="pointer-events-none absolute -left-40 top-[10%] h-[560px] w-[560px] rounded-full bg-primary/10 blur-[80px]" />
      <div data-jn-bg-mid className="pointer-events-none absolute right-[-15%] top-[55%] h-[480px] w-[480px] rounded-full bg-accent/10 blur-[70px]" />
      <div data-jn-bg-deep className="pointer-events-none absolute left-[35%] bottom-[5%] h-[360px] w-[360px] rounded-full bg-primary/8 blur-[60px]" />

      <div className="container relative">
        <div className="mb-20 max-w-3xl md:mb-32">
          <div data-journey-head className="eyebrow mb-8">Chapter 01 — Origin</div>
          <h2 data-journey-head className="display-2 font-display text-foreground">
            Journey of a <span className="text-stroke">Cricketer</span>
          </h2>
          <p data-journey-head className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
            Three moments. One arc. Scroll the timeline — each phase pins itself, breathes, and then lets you go.
          </p>
        </div>

        <div className="space-y-32 md:space-y-56">
          {phases.map((p, i) => (
            <div
              key={p.year}
              data-phase
              className={`grid gap-10 md:grid-cols-12 md:items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="relative md:col-span-7">
                <div data-phase-card className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface">
                  <div data-phase-img className="absolute -inset-6 will-change-transform">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      width={1400}
                      height={900}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute left-6 top-6 flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-accent shadow-glow-accent" />
                    <span className="font-condensed text-xs uppercase tracking-[0.4em] text-foreground/90">
                      {p.place}
                    </span>
                  </div>
                  <div className="absolute bottom-6 right-6 font-display text-7xl text-foreground/90 mix-blend-difference md:text-9xl">
                    0{i + 1}
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 md:px-4">
                <div data-phase-text data-phase-year className="font-display text-7xl text-accent md:text-8xl will-change-transform">{p.year}</div>
                <h3 data-phase-text className="mt-4 font-display text-4xl uppercase leading-tight text-foreground md:text-5xl">
                  {p.title}
                </h3>
                <div data-phase-text className="mt-6 h-px w-16 bg-accent" />
                <p data-phase-text className="mt-6 max-w-md font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journey;
