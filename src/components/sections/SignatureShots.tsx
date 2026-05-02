import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import coverImg from "@/assets/samad-celebration.jpg";
import pullImg from "@/assets/samad-wicket.jpg";
import heliImg from "@/assets/samad-bw.jpg";
import straightImg from "@/assets/samad-mca.jpg";

gsap.registerPlugin(ScrollTrigger);

const shots = [
  { name: "The Inswinger", angle: "L-ARM", note: "Late movement into the right-hander. Stumps on a mission.", image: coverImg },
  { name: "Yorker On Demand", angle: "BLOCK-HOLE", note: "Toes, base of stumps, end of over. Surgical.", image: pullImg },
  { name: "The Slower One", angle: "OFF-PACE", note: "Released from the back of the hand. Reads the batter's intent.", image: heliImg },
  { name: "New Ball Spell", angle: "OVER 1–6", note: "Movement off the seam. The opening burst that sets the tone.", image: straightImg },
];

const SignatureShots = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll inside vertical
      const track = trackRef.current!;
      const total = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -total(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top top",
          end: () => `+=${total() + 200}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set("#shots-progress", { scaleX: self.progress });
          },
        },
      });

      gsap.from("[data-shots-head]", {
        y: 60, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current!, start: "top 70%" },
      });

      // PERF: Per-card mouse tilt + inner image parallax — use quickTo
      const cards = gsap.utils.toArray<HTMLElement>("[data-shot-card]");
      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>("[data-shot-img]");
        const meta = card.querySelector<HTMLElement>("[data-shot-meta]");

        gsap.set(card, { transformPerspective: 1000 });
        const qRotY = gsap.quickTo(card, "rotateY", { duration: 0.6, ease: "power3.out" });
        const qRotX = gsap.quickTo(card, "rotateX", { duration: 0.6, ease: "power3.out" });
        const qImgX = img ? gsap.quickTo(img, "x", { duration: 0.7, ease: "power3.out" }) : null;
        const qImgY = img ? gsap.quickTo(img, "y", { duration: 0.7, ease: "power3.out" }) : null;
        const qMetaX = meta ? gsap.quickTo(meta, "x", { duration: 0.7, ease: "power3.out" }) : null;
        const qMetaY = meta ? gsap.quickTo(meta, "y", { duration: 0.7, ease: "power3.out" }) : null;

        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          qRotY(x * 8);
          qRotX(-y * 8);
          qImgX?.(x * 36);
          qImgY?.(y * 28);
          qMetaX?.(x * -14);
          qMetaY?.(y * -10);
        };
        const onLeave = () => {
          qRotY(0);
          qRotX(0);
          qImgX?.(0);
          qImgY?.(0);
          qMetaX?.(0);
          qMetaY?.(0);
        };
        card.addEventListener("mousemove", onMove, { passive: true });
        card.addEventListener("mouseleave", onLeave);
      });

      // Per-panel horizontal parallax driven by the pin tween
      gsap.utils.toArray<HTMLElement>("[data-shot-panel]").forEach((panel) => {
        const deep = panel.querySelector<HTMLElement>("[data-shot-deep]");
        if (deep) {
          gsap.fromTo(deep,
            { xPercent: 20, scale: 1.15 },
            {
              xPercent: -20, scale: 1.15, ease: "none",
              scrollTrigger: {
                trigger: panel, containerAnimation: tween,
                start: "left right", end: "right left", scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="shots"
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-background"
    >
      <div ref={trackRef} className="flex h-full will-change-transform">
        {/* Intro panel */}
        <div className="flex h-full w-screen flex-shrink-0 flex-col justify-center px-8 md:px-24">
          <div data-shots-head className="eyebrow mb-8">Chapter 03 — The Arsenal</div>
          <h2 data-shots-head className="display-2 font-display text-foreground">
            Signature <br />
            <span className="text-accent">Deliveries.</span>
          </h2>
          <p data-shots-head className="mt-8 max-w-md font-sans text-base text-muted-foreground md:text-lg">
            Left-arm medium. Four weapons in the bag. Scroll across — every ball has a job.
          </p>
          <div data-shots-head className="mt-10 flex items-center gap-3 font-condensed text-xs uppercase tracking-[0.4em] text-accent">
            <span className="h-px w-12 bg-accent" />
            Scroll →
          </div>
        </div>

        {/* Shot cards */}
        {shots.map((s, i) => (
          <div
            key={s.name}
            data-shot-panel
            className="relative flex h-full w-[85vw] flex-shrink-0 items-center px-6 md:w-[55vw] md:px-12"
          >
            {/* Panel deep parallax glow — PERF: reduced blur from 120-140px to 70-80px */}
            <div data-shot-deep className="pointer-events-none absolute inset-0 will-change-transform">
              <div className="absolute left-[10%] top-[15%] h-[300px] w-[300px] rounded-full bg-accent/15 blur-[70px]" />
              <div className="absolute right-[8%] bottom-[10%] h-[360px] w-[360px] rounded-full bg-primary/15 blur-[80px]" />
            </div>
            <button
              onClick={() => setOpen(i)}
              data-cursor="hover"
              data-shot-card
              className="group relative h-[70vh] w-full overflow-hidden rounded-sm bg-surface text-left"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div data-shot-img className="img-distort absolute -inset-4 will-change-transform">
                <img
                  src={s.image}
                  alt={s.name}
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={1500}
                />
                <div className="scanlines" />
                <div className="glitch-slice" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

              {/* Distortion stripes overlay on hover */}
              <div className="absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0,transparent_3px,hsl(var(--accent)/0.15)_3px,hsl(var(--accent)/0.15)_4px)]" />
              </div>

              <div data-shot-meta className="absolute inset-0 will-change-transform">
                <div className="absolute left-6 top-6 flex items-center gap-2 font-condensed text-xs uppercase tracking-[0.4em] text-accent">
                  <span>0{i + 1}</span>
                  <span className="h-px w-6 bg-accent" />
                  <span>{s.angle}</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-display text-4xl uppercase text-foreground md:text-6xl">{s.name}</h3>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">{s.note}</p>
                  </div>
                  <span className="hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent transition-all group-hover:border-accent group-hover:bg-accent group-hover:text-background md:flex">
                    →
                  </span>
                </div>
              </div>
            </button>
          </div>
        ))}

        {/* End spacer */}
        <div className="flex h-full w-[20vw] flex-shrink-0 items-center justify-center">
          <span className="font-condensed text-xs uppercase tracking-[0.4em] text-muted-foreground">/ end of reel</span>
        </div>
      </div>

      {/* Horizontal Progress Bar for this section */}
      <div className="absolute inset-x-8 bottom-12 z-30 flex items-center gap-4 md:inset-x-24">
        <span className="font-condensed text-[10px] uppercase tracking-[0.4em] text-accent">Arsenal</span>
        <div className="relative h-px flex-1 bg-white/10">
          <div id="shots-progress" className="absolute inset-0 origin-left scale-x-0 bg-accent shadow-[0_0_10px_hsl(var(--accent)/0.5)]" />
        </div>
        <span className="font-condensed text-[10px] uppercase tracking-[0.4em] text-muted-foreground">04</span>
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          className="fixed inset-0 z-[180] flex items-center justify-center bg-background/95 p-6 backdrop-blur-xl animate-fade-in"
          onClick={() => setOpen(null)}
        >
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-sm">
            <img src={shots[open].image} alt={shots[open].name} className="h-full w-full object-cover animate-scale-in" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-8">
              <div className="font-condensed text-xs uppercase tracking-[0.4em] text-accent">Slow-motion replay</div>
              <h4 className="mt-2 font-display text-5xl text-foreground">{shots[open].name}</h4>
              <p className="mt-2 max-w-md text-muted-foreground">{shots[open].note}</p>
            </div>
            <button
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/30 text-foreground hover:border-accent hover:text-accent"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SignatureShots;
