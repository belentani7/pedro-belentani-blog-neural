"use client";

import { MotionProvider, useMotion } from "./MotionProvider";
import { NeuralHero } from "./NeuralHero";

export interface HomeArticle {
  readonly order: number;
  readonly slug: string;
  readonly title: string;
  readonly bajada: string;
  readonly category: string;
  readonly excerpt: string;
  readonly readTime: string;
}

const METHOD = [
  {
    question: "Observar antes de decorar",
    answer:
      "Separar señal, jerarquía y contexto. La forma empieza cuando el problema puede explicarse sin depender del efecto.",
  },
  {
    question: "Modelar la relación",
    answer:
      "Convertir una intuición en reglas visuales, estados y límites. El sistema debe conservar la idea al cambiar de pantalla.",
  },
  {
    question: "Construir por capacidades",
    answer:
      "Cargar WebGL y movimiento cuando el dispositivo y la preferencia lo permiten. Mantener identidad y lectura cuando no.",
  },
  {
    question: "Verificar el resultado",
    answer:
      "Probar contenido, teclado, rutas, móvil, movimiento reducido, fallback y píxeles reales. Una intención pública necesita evidencia pública.",
  },
] as const;

const FIELDS = [
  {
    index: "01",
    title: "Frontend inmersivo",
    state: "Espacio",
    description:
      "React, shaders, tipografía y movimiento coordinados como un lenguaje, con accesibilidad y rendimiento dentro de la dirección.",
  },
  {
    index: "02",
    title: "IA aplicada",
    state: "Criterio",
    description:
      "Modelos usados para investigar, comparar y producir con trazabilidad. La salida se trata como material a verificar, no como autoridad.",
  },
  {
    index: "03",
    title: "Sistemas de información",
    state: "Orden",
    description:
      "Arquitecturas que permiten recorrer complejidad sin perder procedencia, jerarquía ni posibilidad de comprobación.",
  },
] as const;

const STATES = [
  {
    title: "Escena viva",
    form: "WebGL disponible",
    thesis:
      "Partículas, conexiones y scroll expresan cómo varias corrientes convergen sin fundirse en una masa uniforme.",
  },
  {
    title: "Movimiento reducido",
    form: "Preferencia del sistema",
    thesis:
      "La composición conserva forma, color y jerarquía; elimina desplazamiento, fijación y respuesta espacial no esencial.",
  },
  {
    title: "Fallback gráfico",
    form: "Sin WebGL / móvil",
    thesis:
      "Un cerebro construido con CSS mantiene la identidad. Títulos, enlaces y artículos siguen siendo HTML navegable.",
  },
] as const;

function Header() {
  const { motionEnabled, setMotionEnabled } = useMotion();

  return (
    <header className="site-header">
      <a className="skip-link" href="#ensayos">
        Saltar a los ensayos
      </a>
      <a className="wordmark" href="#inicio" aria-label="Ir al inicio">
        PB<span>/</span>NEURAL
      </a>
      <nav className="site-nav" aria-label="Navegación principal">
        <a href="#ensayos">Ensayos</a>
        <a href="#metodo">Método</a>
        <a href="#campos">Campos</a>
      </nav>
      <button
        className="motion-toggle"
        type="button"
        aria-pressed={motionEnabled}
        onClick={() => setMotionEnabled(!motionEnabled)}
      >
        Movimiento {motionEnabled ? "on" : "off"}
      </button>
    </header>
  );
}

function Experience({ articles }: { readonly articles: readonly HomeArticle[] }) {
  return (
    <div className="site-shell" id="inicio">
      <Header />
      <main>
        <NeuralHero />

        <section className="essay-index" id="ensayos" aria-labelledby="essay-title">
          <div className="section-intro">
            <p className="eyebrow">Tres ensayos / diez fuentes</p>
            <h2 id="essay-title">Pensar la interfaz desde la evidencia.</h2>
            <p>
              Estudios primarios y documentación oficial traducidos a decisiones de percepción,
              arquitectura frontend y proceso creativo. Cada inferencia declara su alcance.
            </p>
          </div>

          <div className="essay-list">
            {articles.map((article, index) => (
              <a
                className="essay-row"
                data-domain={(index % 4) + 1}
                href={`/articulos/${article.slug}`}
                key={article.slug}
              >
                <span className="essay-number">{String(article.order).padStart(2, "0")}</span>
                <span className="essay-copy">
                  <span className="essay-category">{article.category}</span>
                  <strong>{article.title}</strong>
                  <span>{article.excerpt}</span>
                </span>
                <span className="essay-time">{article.readTime}</span>
                <span className="essay-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="questions-section" id="metodo" aria-labelledby="questions-title">
          <div className="questions-heading">
            <p className="eyebrow">Método de trabajo</p>
            <h2 id="questions-title">Del hallazgo a la interfaz.</h2>
            <p className="intimate-line">
              La investigación orienta. El prototipo concreta. La prueba decide qué puede afirmarse.
            </p>
          </div>
          <div className="question-list">
            {METHOD.map((item, index) => (
              <article className="question-item" key={item.question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="projects-section" id="campos" aria-labelledby="projects-title">
          <div className="section-intro">
            <p className="eyebrow">Práctica conectada</p>
            <h2 id="projects-title">Tres campos. Un mismo criterio.</h2>
            <p>
              La forma visual, el sistema técnico y la organización de la evidencia se diseñan juntos.
            </p>
          </div>
          <div className="project-list">
            {FIELDS.map((project) => (
              <article className="project-row" key={project.index}>
                <span className="project-index">{project.index}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <span className="project-state">{project.state}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="books-section" id="estados" aria-labelledby="books-title">
          <div className="section-intro">
            <p className="eyebrow">Mejora progresiva</p>
            <h2 id="books-title">Tres estados. El mismo significado.</h2>
            <p>La identidad no depende de una sola API ni de una preferencia de movimiento.</p>
          </div>
          <div className="book-list">
            {STATES.map((book, index) => (
              <article className="book-entry" key={book.title}>
                <span>0{index + 1}</span>
                <p>{book.form}</p>
                <h3>{book.title}</h3>
                <p>{book.thesis}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="closing-statement" aria-label="Declaración final">
          <p>Lógica y arte no compiten.</p>
          <h2>La estructura permite que una idea llegue entera.</h2>
          <a href="#inicio">Volver al organismo</a>
        </section>
      </main>

      <footer className="site-footer">
        <span>Pedro Belentani</span>
        <span>Frontend · IA · sistemas visuales</span>
        <span>Fuentes consultadas · edición 2026</span>
      </footer>
    </div>
  );
}

export function HomePage({ articles }: { readonly articles: readonly HomeArticle[] }) {
  return (
    <MotionProvider>
      <Experience articles={articles} />
    </MotionProvider>
  );
}
