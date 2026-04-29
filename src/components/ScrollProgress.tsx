import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-px bg-line/40" aria-hidden>
      <div
        className="h-full bg-gradient-ice transition-[width] duration-150 ease-out"
        style={{ width: `${p}%`, boxShadow: "0 0 12px hsl(var(--accent))" }}
      />
    </div>
  );
};

export default ScrollProgress;
