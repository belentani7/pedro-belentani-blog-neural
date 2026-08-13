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

const QUESTIONS = [
  {
    question: "¿Qué demuestra que mis mundos existen fuera de mi cabeza?",
    answer:
      "Una puerta terminada que alguien puede abrir, comprender y recomendar. No otra explicación. Este blog debe convertirse en esa primera prueba canónica.",
  },
  {
    question: "¿Mi mezcla de artista, técnico y pensador confunde?",
    answer:
      "Solo cuando la presento como una lista. Integrada en una experiencia, esa mezcla es la ventaja: criterio visual, ingeniería, privacidad, accesibilidad y voz propia en el mismo trabajo.",
  },
  {
    question: "¿Cuánto de mi archivo necesita hacerse público?",
    answer:
      "Muy poco. El archivo sostiene profundidad y procedencia; no necesita convertirse en exposición. Lo publicable es el método que aprendí, no la intimidad que lo originó.",
  },
  {
    question: "¿Vulnerabilidad significa contarlo todo?",
    answer:
      "No. Significa no esconder incertidumbre, límites o responsabilidad detrás de una voz grandiosa. La vulnerabilidad pública más fuerte suele ser precisa y contenida.",
  },
  {
    question: "¿Qué debo dejar de hacer para avanzar?",
    answer:
      "Abrir una identidad, plataforma o universo nuevo antes de cerrar el anterior. Elegir no reduce mi imaginación: concentra su potencia hasta volverla visible.",
  },
] as const;

const PROJECTS = [
  {
    index: "01",
    title: "Blog Neural",
    state: "En construcción",
    description:
      "La pieza canónica: seis ensayos, una experiencia inmersiva y un caso verificable de dirección creativa y frontend.",
  },
  {
    index: "02",
    title: "CASEFORGE",
    state: "Siguiente",
    description:
      "Archivo público de casos: problema, decisiones, evidencia, resultado y límites. Convierte proyectos dispersos en prueba profesional.",
  },
  {
    index: "03",
    title: "FRONTEND PROOF",
    state: "Servicio primero",
    description:
      "Auditoría vendible de jerarquía, movimiento, accesibilidad y rendimiento. Empieza como informe; solo se automatiza cuando exista demanda.",
  },
  {
    index: "04",
    title: "ARCHIVO VIVO",
    state: "Producto posible",
    description:
      "Herramienta para creadores: versiones, hashes, procedencia, derechos y fronteras entre original, interpretación y publicación.",
  },
  {
    index: "05",
    title: "MOTION ACCESS LAB",
    state: "MVP definido",
    description:
      "Comparador entre animación plena, versión reducida y corrección accesible. Enseña que la inclusión también puede dirigir la estética.",
  },
] as const;

const BOOKS = [
  {
    title: "Crear mundos, no vitrinas",
    form: "Diseño / tecnología inmersiva",
    thesis:
      "Movimiento, sonido, espacio, lenguaje y acceso convierten una interfaz en un mundo cuando obedecen a una misma intención.",
  },
  {
    title: "La máquina que guarda y la máquina que inventa",
    form: "IA / archivo / criterio",
    thesis:
      "Preservar, comparar e imaginar son funciones distintas; ninguna máquina recibe autoridad automática sobre hechos, identidades o conciencia ajena.",
  },
  {
    title: "La vulnerabilidad necesita estructura",
    form: "Ensayo / límites / creación",
    thesis:
      "Abrirse no exige entregarlo todo: los límites, los acuerdos y la pausa permiten cuidar y crear sin convertir la relación en deuda o exposición.",
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
        PB<span>/</span>MENTE
      </a>
      <nav className="site-nav" aria-label="Navegación principal">
        <a href="#ensayos">Ensayos</a>
        <a href="#preguntas">Preguntas</a>
        <a href="#proyectos">Proyectos</a>
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
            <p className="eyebrow">Pensamiento en seis movimientos</p>
            <h2 id="essay-title">Lo que aprendí cuando dejé de separar mis partes.</h2>
            <p>
              Textos completos, no consignas. Cada ensayo convierte una tensión privada en una
              herramienta pública sin exponer aquello que debe seguir protegido.
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

        <section className="questions-section" id="preguntas" aria-labelledby="questions-title">
          <div className="questions-heading">
            <p className="eyebrow">Lo que aún no había visto</p>
            <h2 id="questions-title">Las preguntas que faltaban.</h2>
            <p className="intimate-line">
              No necesitaba otra identidad. Necesitaba una forma terminada que alguien pudiera usar.
            </p>
          </div>
          <div className="question-list">
            {QUESTIONS.map((item, index) => (
              <article className="question-item" key={item.question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="projects-section" id="proyectos" aria-labelledby="projects-title">
          <div className="section-intro">
            <p className="eyebrow">Orden de ejecución</p>
            <h2 id="projects-title">Cinco proyectos. Solo uno primero.</h2>
            <p>
              El blog recibe toda la energía hasta funcionar como pieza pública. Los demás permanecen
              definidos, no abiertos.
            </p>
          </div>
          <div className="project-list">
            {PROJECTS.map((project) => (
              <article className="project-row" key={project.index}>
                <span className="project-index">{project.index}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <span className="project-state">{project.state}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="books-section" id="libros" aria-labelledby="books-title">
          <div className="section-intro">
            <p className="eyebrow">Libros que sí existen como tesis</p>
            <h2 id="books-title">Tres libros posibles. Uno privado permanece privado.</h2>
          </div>
          <div className="book-list">
            {BOOKS.map((book, index) => (
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
          <p>La mezcla no era el problema.</p>
          <h2>Era la obra esperando una estructura.</h2>
          <a href="#inicio">Volver al organismo</a>
        </section>
      </main>

      <footer className="site-footer">
        <span>Pedro Belentani</span>
        <span>Tecnología · Razón · Sentimiento · Vulnerabilidad</span>
        <span>Edición local 2026</span>
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
