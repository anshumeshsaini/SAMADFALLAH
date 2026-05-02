import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.09,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    // PERF: Re-enable lag smoothing — lagSmoothing(0) was disabling
    // GSAP's frame-skip detection, causing stutter on slower devices.
    // Default threshold (500ms, 33ms) lets GSAP skip frames gracefully.

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}
