import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/** Custom animated cursor — dot + lagging ring. Hides on touch devices via CSS. */
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3.out" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3.out" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      xToDot(target.x);
      yToDot(target.y);
      xToRing(target.x);
      yToRing(target.y);
    };

    const handleEnter = () => {
      gsap.to(ring, { scale: 2.4, borderColor: "hsl(199 95% 74%)", duration: 0.3 });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };
    const handleLeave = () => {
      gsap.to(ring, { scale: 1, borderColor: "hsl(200 30% 95% / 0.5)", duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", move);
    const interactive = document.querySelectorAll("a, button, [data-cursor='hover'], input, textarea");
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/50 mix-blend-difference md:block"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent md:block"
      />
    </>
  );
};

export default CustomCursor;
