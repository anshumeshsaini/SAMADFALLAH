import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "../MagneticButton";
import LottieIcon from "../LottieIcon";
import heroImg from "@/assets/hero-batter.jpg";
import scrollAnim from "@/assets/lottie/scroll-arrow.json";
import ballAnim from "@/assets/lottie/cricket-ball.json";
import pulseAnim from "@/assets/lottie/pulse-dot.json";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split-text reveal on title
      const title = titleRef.current!;
      const chars = title.querySelectorAll<HTMLElement>("[data-char]");
      gsap.set(chars, { yPercent: 110, opacity: 0 });
      gsap.to(chars, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.04,
        delay: 0.3,
      });

      // Subtitle words
      gsap.from("[data-hero-fade]", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.12,
        delay: 1,
      });

      // Glitch flash
      gsap.fromTo(
        title,
        { filter: "blur(20px) hue-rotate(90deg)" },
        { filter: "blur(0px) hue-rotate(0deg)", duration: 1.4, ease: "expo.out", delay: 0.2 }
      );

      // Mouse parallax — multi-layer with varying depth coefficients
      const onMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(imgRef.current, { x: x * 50, y: y * 35, duration: 1.1, ease: "power3.out" });
        gsap.to("[data-parallax-deep]", { x: x * 110, y: y * 70, duration: 1.3, ease: "power3.out" });
        gsap.to("[data-parallax-mid]", { x: x * 60, y: y * 40, duration: 1.1, ease: "power3.out" });
        gsap.to("[data-parallax-shallow]", { x: x * 25, y: y * 16, duration: 0.9, ease: "power3.out" });
        gsap.to("[data-parallax-fg]", { x: x * -40, y: y * -25, duration: 1, ease: "power3.out" });
        gsap.to(title, { x: x * -10, y: y * -6, duration: 1.4, ease: "power3.out" });
      };
      window.addEventListener("mousemove", onMove);

      // Scroll-triggered multi-layer depth
      ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap
          .timeline()
          .to(imgRef.current, { scale: 1.35, opacity: 0.3, yPercent: 12 }, 0)
          .to("[data-parallax-deep]", { yPercent: -45 }, 0)
          .to("[data-parallax-mid]", { yPercent: -25 }, 0)
          .to("[data-parallax-shallow]", { yPercent: -12 }, 0)
          .to("[data-parallax-fg]", { yPercent: 30, opacity: 0 }, 0)
          .to(layersRef.current, { yPercent: -35 }, 0)
          .to(title, { yPercent: -55, opacity: 0.35 }, 0),
      });

      return () => window.removeEventListener("mousemove", onMove);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const name = "SAMADFALLAH";

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[700px] w-full overflow-hidden bg-background"
    >
      {/* Background image with parallax */}
      <div ref={imgRef} className="absolute inset-0 -z-10 will-change-transform">
        <img
          src={heroImg}
          alt="SAMADFALLAH celebrating under the floodlights of a packed night stadium"
          className="h-full w-full scale-105 object-cover object-[70%_center] md:object-[75%_center]"
          width={1920}
          height={1080}
        />
        {/* Left-side darken so the massive title stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10 md:from-background/95 md:via-background/50 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
        {/* Cyan atmospheric glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,hsl(var(--primary)/0.35),transparent_55%)] mix-blend-screen" />
      </div>

      {/* DEEP layer — slow drifting orbs (farthest back) */}
      <div data-parallax-deep className="pointer-events-none absolute inset-0 -z-[6]">
        <div className="absolute left-[10%] top-[20%] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute right-[15%] bottom-[10%] h-[520px] w-[520px] rounded-full bg-accent/12 blur-[140px]" />
      </div>

      {/* MID layer — sweeping vertical accent lines */}
      <div data-parallax-mid className="pointer-events-none absolute left-[8%] top-0 -z-[4] h-full w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent" />
      <div data-parallax-mid className="pointer-events-none absolute right-[12%] top-0 -z-[4] h-full w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
      <div data-parallax-shallow className="pointer-events-none absolute left-[22%] top-0 -z-[4] h-full w-px bg-gradient-to-b from-transparent via-foreground/15 to-transparent" />

      {/* Stadium light beams */}
      <div data-parallax-deep className="absolute inset-0 -z-[5] opacity-40 mix-blend-screen">
        <div className="absolute -left-1/4 top-0 h-[140%] w-[60%] rotate-12 bg-gradient-to-b from-accent/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute -right-1/4 top-0 h-[140%] w-[60%] -rotate-12 bg-gradient-to-b from-primary/20 via-transparent to-transparent blur-3xl" />
      </div>

      {/* FOREGROUND parallax — Lottie cricket ball drifts opposite to mouse */}
      <div data-parallax-fg className="pointer-events-none absolute right-[6%] top-[28%] z-[5] hidden h-24 w-24 opacity-80 md:block">
        <LottieIcon data={ballAnim} />
      </div>
      <div data-parallax-fg className="pointer-events-none absolute left-[5%] bottom-[22%] z-[5] hidden h-20 w-20 opacity-70 md:block">
        <LottieIcon data={pulseAnim} />
      </div>

      <div ref={layersRef} className="container relative z-10 flex h-full flex-col justify-end pb-16 pt-32">
        {/* Top meta row */}
        <div data-hero-fade className="absolute left-6 top-32 hidden flex-col gap-2 md:left-12 md:flex">
          <span className="eyebrow">Innings 001 / Live</span>
          <span className="font-condensed text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Wankhede · 22:14 IST
          </span>
        </div>
        <div data-hero-fade className="absolute right-6 top-32 hidden flex-col items-end gap-2 md:right-12 md:flex">
          <span className="font-display text-sm tracking-[0.3em] text-accent">Left-Arm Medium · Indian Cricketer</span>
          <span className="font-condensed text-xs uppercase tracking-[0.4em] text-muted-foreground">
            287 First-Class Wickets
          </span>
        </div>

        {/* Massive title */}
        <h1
          ref={titleRef}
          aria-label={name}
          className="display-1 font-display leading-[0.82] text-foreground"
        >
          <span className="mask-reveal block overflow-hidden">
            {name.split("").map((c, i) => (
              <span key={i} data-char className="inline-block">
                {c}
              </span>
            ))}
          </span>
        </h1>

        {/* Tagline */}
        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p data-hero-fade className="max-w-md font-condensed text-base uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-accent">/</span> A story written in runs. <br />
            Cinematic, calm, and clinical.
          </p>

          <div data-hero-fade className="flex flex-wrap items-center gap-4">
            <MagneticButton onClick={() => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" })}>
              Enter the Innings
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              onClick={() => document.getElementById("highlights")?.scrollIntoView({ behavior: "smooth" })}
            >
              Watch Highlights
            </MagneticButton>
          </div>
        </div>

        {/* Scroll cue with Lottie */}
        <div data-hero-fade className="mt-12 flex items-center gap-3 font-condensed text-xs uppercase tracking-[0.4em] text-muted-foreground">
          <span className="block h-8 w-8">
            <LottieIcon data={scrollAnim} />
          </span>
          Scroll to play
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-fade" />
    </section>
  );
};

export default Hero;
