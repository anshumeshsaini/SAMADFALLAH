import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "sonner";
import MagneticButton from "../MagneticButton";
import portrait from "@/assets/samad-titans.jpg";

gsap.registerPlugin(ScrollTrigger);

const QUOTE = "I don't play for the crowd. I play so the crowd has something to remember.";

const FanInteraction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Typing animation on quote
      const el = quoteRef.current!;
      const text = QUOTE;
      const obj = { i: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        once: true,
        onEnter: () =>
          gsap.to(obj, {
            i: text.length,
            duration: 3,
            ease: "none",
            onUpdate: () => {
              el.textContent = text.slice(0, Math.round(obj.i)) + (obj.i < text.length ? "▋" : "");
            },
          }),
      });

      gsap.from("[data-fan-anim]", {
        y: 60, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current!, start: "top 70%" },
      });

      // Multi-layer ScrollTrigger parallax on backdrops
      gsap.to("[data-fan-bg-deep]", {
        yPercent: -50, ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to("[data-fan-bg-mid]", {
        yPercent: -22, ease: "none",
        scrollTrigger: { trigger: sectionRef.current!, start: "top bottom", end: "bottom top", scrub: true },
      });

      // Portrait card mouse tilt + inner image parallax
      const card = sectionRef.current!.querySelector<HTMLElement>("[data-fan-card]");
      const img = sectionRef.current!.querySelector<HTMLElement>("[data-fan-img]");
      if (card && img) {
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, transformPerspective: 1000, duration: 0.6, ease: "power3.out" });
          gsap.to(img, { x: x * 30, y: y * 22, scale: 1.05, duration: 0.7, ease: "power3.out" });
        };
        const onLeave = () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power3.out" });
          gsap.to(img, { x: 0, y: 0, scale: 1, duration: 0.8, ease: "power3.out" });
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      }

      // Scroll-driven portrait reveal
      gsap.fromTo("[data-fan-img]",
        { scale: 1.25, yPercent: 8 },
        {
          scale: 1, yPercent: -8, ease: "none",
          scrollTrigger: { trigger: card!, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !msg) return;
    toast.success("Message sent to the dressing room.", {
      description: `Thanks, ${name}. SAMADFALLAH reads every one.`,
    });
    setName("");
    setMsg("");
  };

  const socials = [
    { label: "Instagram", handle: "@samadfallah" },
    { label: "X / Twitter", handle: "@samadfallah" },
    { label: "YouTube", handle: "/samadfallah" },
    { label: "TikTok", handle: "@samadfallah" },
  ];

  return (
    <section id="fans" ref={sectionRef} className="relative overflow-hidden bg-surface py-32 md:py-48">
      {/* Multi-layer parallax background */}
      <div data-fan-bg-deep className="pointer-events-none absolute -left-32 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[140px]" />
      <div data-fan-bg-deep className="pointer-events-none absolute -right-32 bottom-1/4 h-[600px] w-[600px] rounded-full bg-accent/15 blur-[140px]" />
      <div data-fan-bg-mid className="pointer-events-none absolute left-[40%] top-[8%] h-[300px] w-[300px] rounded-full bg-accent/10 blur-[100px]" />
      <div data-fan-bg-mid className="pointer-events-none absolute left-[8%] top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

      <div className="container relative">
        {/* Quote block */}
        <div className="mb-24 grid gap-12 md:mb-32 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <div
              data-fan-anim
              data-fan-card
              className="img-distort relative aspect-[4/5] overflow-hidden rounded-sm"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div data-fan-img className="absolute -inset-4 will-change-transform">
                <img src={portrait} alt="Portrait of SAMADFALLAH" loading="lazy" className="h-full w-full object-cover" width={1280} height={1600} />
              </div>
              <div className="scanlines" />
              <div className="glitch-slice" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="font-condensed text-xs uppercase tracking-[0.4em] text-accent">In his own words</div>
              </div>
              {/* Corner ticks */}
              <span className="absolute left-3 top-3 z-10 h-3 w-3 border-l border-t border-accent/60" />
              <span className="absolute right-3 top-3 z-10 h-3 w-3 border-r border-t border-accent/60" />
              <span className="absolute bottom-3 left-3 z-10 h-3 w-3 border-b border-l border-accent/60" />
              <span className="absolute bottom-3 right-3 z-10 h-3 w-3 border-b border-r border-accent/60" />
            </div>
          </div>

          <div className="md:col-span-7">
            <span data-fan-anim className="font-display text-9xl text-accent/30">"</span>
            <p
              ref={quoteRef}
              className="-mt-12 font-display text-3xl uppercase leading-[1.1] text-foreground md:text-5xl lg:text-6xl"
            >
              {/* filled by GSAP */}
            </p>
            <div data-fan-anim className="mt-8 flex items-center gap-4">
              <span className="h-px w-12 bg-accent" />
              <span className="font-condensed text-sm uppercase tracking-[0.3em] text-muted-foreground">SAMADFALLAH · 2024</span>
            </div>
          </div>
        </div>

        {/* Form + socials */}
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <div data-fan-anim className="eyebrow mb-6">Send a message</div>
            <h3 data-fan-anim className="display-2 font-display text-foreground">
              Write to the <span className="text-accent">No. 287.</span>
            </h3>

            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
              <div data-fan-anim className="border-b border-line pb-2">
                <label htmlFor="name" className="block font-condensed text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Your name
                </label>
                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full bg-transparent font-display text-2xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                  placeholder="—"
                />
              </div>
              <div data-fan-anim className="border-b border-line pb-2">
                <label htmlFor="msg" className="block font-condensed text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Your message
                </label>
                <textarea
                  id="msg"
                  required
                  rows={3}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="mt-2 w-full resize-none bg-transparent font-sans text-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                  placeholder="Tell him what the cover drive meant to you…"
                />
              </div>
              <div data-fan-anim>
                <MagneticButton type="submit">Send to Dressing Room</MagneticButton>
              </div>
            </form>
          </div>

          <div className="md:col-span-5">
            <div data-fan-anim className="eyebrow mb-6">Follow the journey</div>
            <ul className="border-t border-line">
              {socials.map((s) => (
                <li key={s.label} data-fan-anim className="border-b border-line">
                  <a
                    href="#"
                    data-cursor="hover"
                    className="group flex items-center justify-between py-6 transition-colors"
                  >
                    <span className="font-display text-3xl uppercase text-foreground transition-colors group-hover:text-accent md:text-4xl">
                      {s.label}
                    </span>
                    <span className="flex items-center gap-3 font-condensed text-xs uppercase tracking-[0.3em] text-muted-foreground transition-all group-hover:translate-x-2 group-hover:text-accent">
                      {s.handle}
                      <span className="inline-block">↗</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FanInteraction;
