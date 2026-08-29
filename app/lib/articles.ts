import complexityRaw from "../../content/01-complejidad-legible.md?raw";
import robustWebRaw from "../../content/02-arte-web-robusto.md?raw";
import creativityRaw from "../../content/03-creatividad-como-sistema.md?raw";

export type ArticleSource = Readonly<{
  label: string;
  citation: string;
  url: string;
  note: string;
}>;

export type ArticleMetadata = Readonly<{
  order: number;
  file: string;
  title: string;
  bajada: string;
  slug: string;
  category: string;
  excerpt: string;
  readTime: string;
  wordCount: number;
  sources: readonly ArticleSource[];
}>;

export type Article = ArticleMetadata &
  Readonly<{
    body: string;
  }>;

type ArticleDefinition = ArticleMetadata &
  Readonly<{
    raw: string;
  }>;

const articleDefinitions = [
  {
    order: 1,
    file: "01-complejidad-legible.md",
    title: "Complejidad legible",
    bajada:
      "Una interfaz puede contener muchas capas sin obligar a descifrarlas todas a la vez. Diseñar es decidir qué aparece primero, qué permanece disponible y qué puede esperar.",
    slug: "complejidad-legible",
    category: "Percepción y diseño",
    excerpt:
      "Tres estudios sobre detalles irrelevantes, primeras impresiones y memoria visual convertidos en decisiones concretas de interfaz.",
    readTime: "8 min",
    wordCount: 1320,
    sources: [
      {
        label: "Harp y Mayer (1998)",
        citation: "How Seductive Details Do Their Damage: A Theory of Cognitive Interest in Science Learning",
        url: "https://eric.ed.gov/?id=EJ576496",
        note: "Cuatro experimentos con 357 estudiantes sobre recuerdo, transferencia y detalles interesantes pero irrelevantes.",
      },
      {
        label: "Tuch et al. (2012)",
        citation: "The role of visual complexity and prototypicality regarding first impression of websites",
        url: "https://research.google/pubs/the-role-of-visual-complexity-and-prototypicality-regarding-first-impression-of-websites-working-towards-understanding-aesthetic-judgments/",
        note: "Dos estudios sobre complejidad visual, prototipicidad y juicios estéticos en exposiciones muy breves.",
      },
      {
        label: "Borkin et al. (2013)",
        citation: "What makes a visualization memorable?",
        url: "https://pubmed.ncbi.nlm.nih.gov/24051797/",
        note: "Estudio experimental sobre atributos asociados al reconocimiento y recuerdo de visualizaciones.",
      },
    ],
    raw: complexityRaw,
  },
  {
    order: 2,
    file: "02-arte-web-robusto.md",
    title: "Arte web robusto",
    bajada:
      "Una experiencia inmersiva no está terminada cuando el efecto funciona. Está terminada cuando el significado sobrevive sin GPU, sin movimiento y con teclado.",
    slug: "arte-web-robusto",
    category: "Frontend inmersivo",
    excerpt:
      "WebGL, movimiento accesible y ciclos de vida de animación como partes de una misma dirección artística.",
    readTime: "9 min",
    wordCount: 1450,
    sources: [
      {
        label: "Khronos Group (2014)",
        citation: "WebGL Specification 1.0.3",
        url: "https://registry.khronos.org/webgl/specs/1.0.3/",
        note: "Especificación del contexto WebGL para canvas, incluida la posibilidad de fallo durante su creación.",
      },
      {
        label: "W3C WAI (WCAG 2.2)",
        citation: "Understanding SC 2.3.3: Animation from Interactions",
        url: "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions",
        note: "Criterio y técnicas para desactivar movimiento no esencial provocado por interacción.",
      },
      {
        label: "GreenSock", citation: "ScrollTrigger documentation",
        url: "https://gsap.com/docs/v3/Plugins/ScrollTrigger/",
        note: "Documentación oficial sobre disparadores de scroll, actualización de medidas y ciclo de vida.",
      },
      {
        label: "GreenSock", citation: "gsap.context() documentation",
        url: "https://gsap.com/docs/v3/GSAP/gsap.context%28%29/",
        note: "Documentación oficial sobre alcance de selectores y reversión conjunta de animaciones y ScrollTriggers.",
      },
    ],
    raw: robustWebRaw,
  },
  {
    order: 3,
    file: "03-creatividad-como-sistema.md",
    title: "Creatividad como sistema",
    bajada:
      "Generar, relacionar, evaluar y comprobar no son enemigos. La creatividad gana precisión cuando cada modo de trabajo tiene espacio y una regla de relevo.",
    slug: "creatividad-como-sistema",
    category: "Creatividad e ingeniería",
    excerpt:
      "Lo que tres estudios de cognición creativa permiten inferir para organizar un proceso de diseño, y lo que no autorizan a decir sobre una persona.",
    readTime: "9 min",
    wordCount: 1410,
    sources: [
      {
        label: "Beaty et al. (2015)",
        citation: "Default and Executive Network Coupling Supports Creative Idea Production",
        url: "https://www.nature.com/articles/srep10964",
        note: "fMRI y análisis de conectividad durante una tarea de pensamiento divergente.",
      },
      {
        label: "Beaty et al. (2018)",
        citation: "Robust prediction of individual creative ability from brain functional connectivity",
        url: "https://pubmed.ncbi.nlm.nih.gov/29339474/",
        note: "Modelo predictivo basado en conectividad funcional, con validaciones dentro y fuera de la muestra inicial.",
      },
      {
        label: "Jung-Beeman et al. (2004)",
        citation: "Neural Activity When People Solve Verbal Problems with Insight",
        url: "https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.0020097",
        note: "Experimentos con fMRI y EEG sobre soluciones verbales informadas como insight o no insight.",
      },
    ],
    raw: creativityRaw,
  },
] satisfies readonly ArticleDefinition[];

function stripDocumentEnvelope(raw: string): string {
  const normalized = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const withoutFrontmatter = normalized
    .replace(/^---[\t ]*\n[\s\S]*?\n---[\t ]*(?:\n|$)/, "")
    .trimStart();

  return withoutFrontmatter.replace(/^#[\t ]+[^\n]+(?:\n|$)/, "").trim();
}

export const articles: readonly Article[] = Object.freeze(
  articleDefinitions.map(({ raw, ...metadata }) =>
    Object.freeze({
      ...metadata,
      body: stripDocumentEnvelope(raw),
    }),
  ),
);

const articlesBySlug = new Map(
  articles.map((article) => [article.slug, article] as const),
);

export function getArticleBySlug(slug: string): Article | undefined {
  return articlesBySlug.get(slug);
}

export function getArticleNavigation(slug: string): Readonly<{
  previous: Article | null;
  next: Article | null;
}> {
  const index = articles.findIndex((article) => article.slug === slug);

  if (index < 0) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? articles[index - 1] : null,
    next: index < articles.length - 1 ? articles[index + 1] : null,
  };
}
