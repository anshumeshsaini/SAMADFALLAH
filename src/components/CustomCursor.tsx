import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/** Custom animated cursor — dot + lagging ring.
 *  PERF: Uses MutationObserver to handle dynamically added elements.
 *  Hides on touch devices via CSS media query check. */
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3.out" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3.out" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    const handleEnter = () => {
      gsap.to(ring, { scale: 2.4, borderColor: "hsl(199 95% 74%)", duration: 0.3 });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };
    const handleLeave = () => {
      gsap.to(ring, { scale: 1, borderColor: "hsl(200 30% 95% / 0.5)", duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", move, { passive: true });

    // Track which elements we've attached listeners to, to avoid duplicates
    const tracked = new WeakSet<Element>();
    const SELECTOR = "a, button, [data-cursor='hover'], input, textarea";

    const attachTo = (el: Element) => {
      if (tracked.has(el)) return;
      tracked.add(el);
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    };

    // Initial scan
    document.querySelectorAll(SELECTOR).forEach(attachTo);

    // MutationObserver for dynamically added interactive elements (e.g. after preloader)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.matches(SELECTOR)) attachTo(node);
            node.querySelectorAll(SELECTOR).forEach(attachTo);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/50 mix-blend-difference transition-[border-color] md:block"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent md:block"
        style={{ boxShadow: "0 0 8px hsl(199 95% 74% / 0.6)" }}
      />
    </>
  );
};

export default CustomCursor;
