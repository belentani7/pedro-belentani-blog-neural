"use client";

import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type {
  NeuralMotionRef,
  NeuralPointerRef,
  NeuralThemeId,
} from "./NeuralField";
import { useMotion } from "./MotionProvider";

const LazyNeuralScene = lazy(async () => {
  const { NeuralScene } = await import("./NeuralField");
  return { default: NeuralScene };
});

export interface NeuralHeroProps {
  className?: string;
}

interface ThemeLink {
  id: NeuralThemeId;
  label: string;
  verb: string;
  href: string;
}

const THEMES: readonly ThemeLink[] = [
  {
    id: "technology",
    label: "Percepción",
    verb: "Hacer legible",
    href: "/articulos/complejidad-legible",
  },
  {
    id: "reason",
    label: "Estructura",
    verb: "Hacer robusto",
    href: "/articulos/arte-web-robusto",
  },
  {
    id: "feeling",
    label: "Movimiento",
    verb: "Dar espacio",
    href: "/articulos/arte-web-robusto",
  },
  {
    id: "vulnerability",
    label: "Síntesis",
    verb: "Conectar modos",
    href: "/articulos/creatividad-como-sistema",
  },
] as const;

const THEME_COLORS = ["#36d9ff", "#f2c66d", "#ff6b5f", "#d8a7ff"] as const;

function NeuralFallback() {
  return (
    <div className="neuralHero__fallback" aria-hidden="true">
      <div className="neuralHero__fallbackBrain">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

class NeuralErrorBoundary extends Component<
  Readonly<{ children: ReactNode }>,
  Readonly<{ failed: boolean }>
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <NeuralFallback /> : this.props.children;
  }
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

const heroStyles = String.raw`
  .neuralHero {
    --neural-bg: #05070a;
    --neural-ink: #f1ede4;
    --neural-muted: #aeb5c0;
    position: relative;
    isolation: isolate;
    min-height: 100svh;
    overflow: clip;
    background:
      radial-gradient(circle at 50% 48%, rgba(25, 38, 54, 0.34), transparent 38%),
      var(--neural-bg);
    color: var(--neural-ink);
  }

  .neuralHero__canvas,
  .neuralHero__fallback,
  .neuralHero__veil {
    position: absolute;
    inset: 0;
  }

  .neuralHero__canvas {
    z-index: 1;
  }

  .neuralHero__canvas canvas {
    pointer-events: none;
  }

  .neuralHero__veil {
    z-index: 2;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(5, 7, 10, 0.44), transparent 28%, transparent 70%, rgba(5, 7, 10, 0.82)),
      radial-gradient(circle at 50% 48%, transparent 26%, rgba(5, 7, 10, 0.54) 78%);
  }

  .neuralHero__content {
    position: relative;
    z-index: 3;
    display: grid;
    min-height: 100svh;
    grid-template-rows: auto 1fr auto;
    padding: clamp(6.2rem, 9vw, 8.5rem) clamp(22px, 3vw, 48px) clamp(22px, 3vw, 48px);
  }

  .neuralHero__eyebrow,
  .neuralHero__theme,
  .neuralHero__cta {
    font-family: "IBM Plex Mono", monospace;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .neuralHero__eyebrow {
    margin: 0;
    color: var(--neural-muted);
    font-size: 0.68rem;
  }

  .neuralHero__heading {
    align-self: center;
    width: min(12ch, 78vw);
    margin: 0;
    font-family: "Instrument Sans Variable", sans-serif;
    font-size: clamp(4.2rem, 10.6vw, 10.5rem);
    font-weight: 780;
    line-height: 0.82;
    letter-spacing: 0;
    text-wrap: balance;
  }

  .neuralHero__heading span {
    display: block;
    overflow: hidden;
  }

  .neuralHero__heading i {
    display: block;
    font-style: normal;
  }

  .neuralHero__footer {
    display: grid;
    grid-template-columns: minmax(12rem, 0.7fr) minmax(26rem, 1.4fr) auto;
    align-items: end;
    gap: clamp(24px, 4vw, 72px);
  }

  .neuralHero__intro {
    max-width: 34rem;
    margin: 0;
    color: var(--neural-muted);
    font-size: clamp(1rem, 1.35vw, 1.28rem);
    line-height: 1.35;
  }

  .neuralHero__disclaimer {
    grid-column: 2 / 4;
    justify-self: end;
    max-width: 34rem;
    margin: 0;
    color: var(--neural-muted);
    font-family: "IBM Plex Mono", monospace;
    font-size: 0.58rem;
    line-height: 1.5;
    text-align: right;
    text-transform: uppercase;
  }

  .neuralHero__themes {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border-top: 1px solid rgba(241, 237, 228, 0.28);
  }

  .neuralHero__theme {
    position: relative;
    display: grid;
    min-height: 4.5rem;
    align-content: end;
    gap: 0.3rem;
    padding: 0.8rem 0.55rem;
    border-right: 1px solid rgba(241, 237, 228, 0.14);
    color: var(--neural-muted);
    font-size: 0.62rem;
    text-decoration: none;
    transition: color 220ms linear, background-color 220ms linear;
  }

  .neuralHero__theme::before {
    content: "";
    position: absolute;
    inset: -1px auto auto 0;
    width: 0;
    height: 2px;
    background: var(--theme-color);
    transition: width 420ms cubic-bezier(0.76, 0, 0.24, 1);
  }

  .neuralHero__theme strong {
    color: var(--neural-ink);
    font-family: "Instrument Sans Variable", sans-serif;
    font-size: clamp(0.78rem, 0.92vw, 0.96rem);
    font-weight: 620;
    letter-spacing: 0;
    text-transform: none;
  }

  .neuralHero__theme:hover,
  .neuralHero__theme:focus-visible {
    color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 8%, transparent);
    outline: 3px solid var(--theme-color);
    outline-offset: 3px;
  }

  .neuralHero__theme:hover::before,
  .neuralHero__theme:focus-visible::before {
    width: 100%;
  }

  .neuralHero__cta {
    display: inline-flex;
    min-height: 48px;
    align-items: center;
    justify-content: center;
    padding: 0.9rem 1.1rem;
    border: 1px solid rgba(241, 237, 228, 0.5);
    color: var(--neural-ink);
    font-size: 0.64rem;
    text-decoration: none;
  }

  .neuralHero__cta:hover,
  .neuralHero__cta:focus-visible {
    border-color: var(--neural-ink);
    outline: 3px solid #36d9ff;
    outline-offset: 3px;
  }

  .neuralHero__fallback {
    z-index: 1;
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .neuralHero__fallbackBrain {
    position: relative;
    width: min(72vw, 25rem);
    aspect-ratio: 1.16;
    opacity: 0.74;
    filter: drop-shadow(0 0 42px rgba(54, 217, 255, 0.16));
  }

  .neuralHero__fallbackBrain span {
    position: absolute;
    width: 53%;
    height: 76%;
    border: 1px solid currentColor;
    border-radius: 56% 44% 48% 52% / 46% 54% 42% 58%;
    background: radial-gradient(circle at 44% 38%, currentColor 0 1px, transparent 2px 100%);
    background-size: 17px 17px;
    opacity: 0.58;
  }

  .neuralHero__fallbackBrain span:nth-child(1) { left: 4%; top: 8%; color: #36d9ff; transform: rotate(-7deg); }
  .neuralHero__fallbackBrain span:nth-child(2) { right: 4%; top: 8%; color: #f2c66d; transform: rotate(7deg); }
  .neuralHero__fallbackBrain span:nth-child(3) { left: 12%; bottom: 3%; color: #ff6b5f; transform: scale(0.78) rotate(8deg); }
  .neuralHero__fallbackBrain span:nth-child(4) { right: 12%; bottom: 3%; color: #d8a7ff; transform: scale(0.78) rotate(-8deg); }

  @media (max-width: 980px) {
    .neuralHero__footer {
      grid-template-columns: 1fr;
      gap: 1.35rem;
    }

    .neuralHero__cta {
      justify-self: start;
    }

    .neuralHero__disclaimer {
      grid-column: 1;
      justify-self: start;
      text-align: left;
    }
  }

  @media (max-width: 760px) {
    .neuralHero__content {
      padding: 1.25rem;
    }

    .neuralHero__heading {
      width: 9ch;
      font-size: clamp(3.7rem, 18vw, 6.8rem);
      line-height: 0.86;
    }

    .neuralHero__intro {
      max-width: 28rem;
      font-size: 0.98rem;
    }

    .neuralHero__themes {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .neuralHero__theme {
      min-height: 48px;
    }

    .neuralHero__fallback {
      opacity: 0.62;
      transform: translateY(-5vh);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .neuralHero,
    .neuralHero * {
      scroll-behavior: auto !important;
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
`;

export function NeuralHero({ className = "" }: NeuralHeroProps) {
  const { motionEnabled } = useMotion();
  const root = useRef<HTMLElement>(null);
  const integrationRef = useRef(0.08) as NeuralMotionRef;
  const pointerRef = useRef({ x: 0, y: 0 }) as NeuralPointerRef;
  const [activeTheme, setActiveTheme] = useState<NeuralThemeId | null>(null);
  const [media, setMedia] = useState({
    ready: false,
    mobile: true,
    compact: true,
    reduced: true,
    webgl: false,
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const compactQuery = window.matchMedia("(max-width: 980px)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const webgl = supportsWebGL();
    const update = () => {
      setMedia({
        ready: true,
        mobile: mobileQuery.matches,
        compact: compactQuery.matches,
        reduced: reducedQuery.matches,
        webgl,
      });
    };

    update();
    mobileQuery.addEventListener("change", update);
    compactQuery.addEventListener("change", update);
    reducedQuery.addEventListener("change", update);
    return () => {
      mobileQuery.removeEventListener("change", update);
      compactQuery.removeEventListener("change", update);
      reducedQuery.removeEventListener("change", update);
    };
  }, []);

  const renderCanvas =
    media.ready && motionEnabled && !media.mobile && !media.reduced && media.webgl;

  useEffect(() => {
    if (!root.current || !renderCanvas) return;
    let trigger: ReturnType<typeof ScrollTrigger.create> | undefined;
    const context = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger, CustomEase);
      CustomEase.create("neural-signal", "0.76,0,0.24,1");
      gsap.fromTo(
        ".neuralHero__heading i",
        { yPercent: 112, rotate: 1.5 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.2,
          stagger: 0.09,
          ease: "neural-signal",
          clearProps: "willChange",
        },
      );
      gsap.fromTo(
        ".neuralHero__eyebrow, .neuralHero__intro, .neuralHero__themes, .neuralHero__cta",
        { autoAlpha: 0, y: 18, willChange: "transform,opacity" },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.82,
          stagger: 0.08,
          delay: 0.24,
          ease: "neural-signal",
          clearProps: "willChange",
        },
      );
      trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=160%",
        pin: true,
        pinSpacing: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          integrationRef.current = 0.08 + progress * 0.92;
        },
      });
    }, root);

    return () => {
      trigger?.kill();
      context.revert();
      integrationRef.current = 0.08;
    };
  }, [renderCanvas]);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!root.current || !renderCanvas) return;
    const bounds = root.current.getBoundingClientRect();
    pointerRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointerRef.current.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  };

  const resetPointer = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
  };

  return (
    <section
      ref={root}
      className={["neuralHero", className].filter(Boolean).join(" ")}
      aria-labelledby="neural-hero-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <style>{heroStyles}</style>

      {renderCanvas ? (
        <div className="neuralHero__canvas" aria-hidden="true">
          <NeuralErrorBoundary>
            <Suspense fallback={<NeuralFallback />}>
              <LazyNeuralScene
                activeTheme={activeTheme}
                compact={media.compact}
                integrationRef={integrationRef}
                pointerRef={pointerRef}
              />
            </Suspense>
          </NeuralErrorBoundary>
        </div>
      ) : (
        <NeuralFallback />
      )}

      <div className="neuralHero__veil" aria-hidden="true" />
      <div className="neuralHero__content">
        <p className="neuralHero__eyebrow">Lógica / arte / interfaz / 2026</p>

        <h1 id="neural-hero-title" className="neuralHero__heading">
          <span><i>Pedro</i></span>
          <span><i>Belentani</i></span>
        </h1>

        <div className="neuralHero__footer">
          <p className="neuralHero__intro">
            Ingeniería frontend, IA aplicada y dirección visual. Una práctica para convertir
            complejidad en sistemas legibles sin perder fuerza expresiva.
          </p>

          <nav className="neuralHero__themes" aria-label="Ámbitos del blog">
            {THEMES.map((theme, index) => (
              <a
                key={theme.id}
                className="neuralHero__theme"
                href={theme.href}
                style={{ "--theme-color": THEME_COLORS[index] } as React.CSSProperties}
                onPointerEnter={() => setActiveTheme(theme.id)}
                onPointerLeave={() => setActiveTheme(null)}
                onFocus={() => setActiveTheme(theme.id)}
                onBlur={() => setActiveTheme(null)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setActiveTheme(null);
                    event.currentTarget.blur();
                  }
                }}
              >
                <span>{theme.label}</span>
                <strong>{theme.verb}</strong>
              </a>
            ))}
          </nav>

          <a className="neuralHero__cta" href="#ensayos">
            Leer los tres ensayos
          </a>
          <p className="neuralHero__disclaimer">
            Metáfora visual de un sistema creativo. No representa datos neurobiológicos personales.
          </p>
        </div>
      </div>
    </section>
  );
}
