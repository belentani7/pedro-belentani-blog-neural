"use client";

import Lenis from "lenis";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("neural-signal", "0.76,0,0.24,1");

interface MotionContextValue {
  motionEnabled: boolean;
  setMotionEnabled: (enabled: boolean) => void;
}

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: PropsWithChildren) {
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setMotionEnabled(!media.matches);
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? "on" : "off";
    if (!motionEnabled) return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    const update = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [motionEnabled]);

  const value = useMemo(
    () => ({ motionEnabled, setMotionEnabled }),
    [motionEnabled],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("useMotion must be used within MotionProvider");
  return context;
}
