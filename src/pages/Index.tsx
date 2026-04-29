import { useEffect, useState } from "react";
import { useLenis } from "@/lib/useLenis";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Journey from "@/components/sections/Journey";
import Stats from "@/components/sections/Stats";
import SignatureShots from "@/components/sections/SignatureShots";
import Highlights from "@/components/sections/Highlights";
import StoryReel from "@/components/sections/StoryReel";
import FanInteraction from "@/components/sections/FanInteraction";
import Footer from "@/components/sections/Footer";
import { toast } from "sonner";

// Cinematic crowd ambience — small base64 silence fallback ensures no 404 if asset missing.
// We synth a low-volume noise via WebAudio when toggled on.
function useCrowdAmbience(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const AudioCtx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.25;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    const gain = ctx.createGain();
    gain.gain.value = 0.06;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
    return () => {
      try { src.stop(); ctx.close(); } catch { /* noop */ }
    };
  }, [active]);
}

const Index = () => {
  useLenis();
  const [loaded, setLoaded] = useState(false);
  const [sound, setSound] = useState(false);
  useCrowdAmbience(sound);

  // Easter egg: press "S" for a glitch flash
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "s" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        document.body.classList.add("animate-glitch");
        toast("⚡ Six over long-on.", { description: "You found the easter egg." });
        setTimeout(() => document.body.classList.remove("animate-glitch"), 500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="grain relative min-h-screen bg-background text-foreground">
      <Preloader onDone={() => setLoaded(true)} />
      <CustomCursor />
      <ScrollProgress />
      <Navbar onSoundToggle={() => setSound((s) => !s)} soundOn={sound} />

      {loaded && (
        <main>
          <Hero />
          <Journey />
          <Stats />
          <SignatureShots />
          <Highlights />
          <StoryReel />
          <FanInteraction />
          <Footer />
        </main>
      )}
    </div>
  );
};

export default Index;
