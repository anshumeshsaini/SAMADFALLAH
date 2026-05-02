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
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top 70%",
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>("[data-shot-card]");
      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>("[data-shot-img]");
        const meta = card.querySelector<HTMLElement>("[data-shot-meta]");

        gsap.set(card, { transformPerspective: 1000 });

        const qRotY = gsap.quickTo(card, "rotateY", { duration: 0.6 });
        const qRotX = gsap.quickTo(card, "rotateX", { duration: 0.6 });
        const qImgX = img ? gsap.quickTo(img, "x", { duration: 0.7 }) : null;
        const qImgY = img ? gsap.quickTo(img, "y", { duration: 0.7 }) : null;
        const qMetaX = meta ? gsap.quickTo(meta, "x", { duration: 0.7 }) : null;
        const qMetaY = meta ? gsap.quickTo(meta, "y", { duration: 0.7 }) : null;

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

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });

      gsap.utils.toArray<HTMLElement>("[data-shot-panel]").forEach((panel) => {
        const deep = panel.querySelector<HTMLElement>("[data-shot-deep]");
        if (deep) {
          gsap.fromTo(
            deep,
            { xPercent: 20, scale: 1.15 },
            {
              xPercent: -20,
              scale: 1.15,
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
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-background">
      <div ref={trackRef} className="flex h-full">
        
        {/* Intro */}
       
        {/* Cards */}
        {shots.map((s, i) => (
          <div key={i} className="flex h-full w-[80vw] items-center px-6">
            <button
              onClick={() => setOpen(i)}
              className="relative h-[70vh] w-full overflow-hidden"
            >
              <img src={s.image} className="h-full w-full object-cover" />
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 LIGHTBOX FIXED */}
      {open !== null && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          onClick={() => setOpen(null)}
        >
          {/* Background blur image */}
          <img
            src={shots[open].image}
            className="absolute inset-0 h-full w-full object-cover blur-3xl scale-110 opacity-30"
          />

          {/* Main full image */}
          <img
            src={shots[open].image}
            className="relative max-h-[90vh] max-w-[95vw] object-contain rounded-lg shadow-2xl animate-scale-in"
          />

          {/* Close */}
          <button
            onClick={() => setOpen(null)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
};

export default SignatureShots;