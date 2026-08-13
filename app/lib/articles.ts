import archiveRaw from "../../content/05-archivar-es-cuidar.md?raw";
import archiveNoPerseguirRaw from "../../content/07-archivar-no-es-perseguir.md?raw";
import immersiveRaw from "../../content/06-crear-mundos-no-vitrinas.md?raw";
import intelligenceRaw from "../../content/04-ia-espejo-no-oraculo.md?raw";
import reasonRaw from "../../content/02-razon-emocion-misma-mesa.md?raw";
import secondChanceRaw from "../../content/08-la-segunda-oportunidad-es-un-regreso.md?raw";
import technologyRaw from "../../content/01-tecnologia-que-sabe-tocar.md?raw";
import vulnerabilityRaw from "../../content/03-vulnerabilidad-necesita-estructura.md?raw";

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
    file: "01-tecnologia-que-sabe-tocar.md",
    title: "La tecnología que sabe tocar sin invadir",
    bajada:
      "No quiero máquinas que simulen sensibilidad. Quiero sistemas construidos con suficiente atención para respetar la sensibilidad de quien los usa.",
    slug: "tecnologia-que-sabe-tocar-sin-invadir",
    category: "Tecnología y sensibilidad",
    excerpt:
      "Una defensa de la tecnología como materia sensible: precisa, accesible, contenida y consciente de la persona que tiene delante.",
    readTime: "6 min",
    wordCount: 1060,
    raw: technologyRaw,
  },
  {
    order: 2,
    file: "02-razon-emocion-misma-mesa.md",
    title: "La razón y la emoción deben sentarse en la misma mesa",
    bajada:
      "Sentir no demuestra un hecho; medir no agota una experiencia. Mi trabajo empieza cuando dejo de pedirle a una de las dos que elimine a la otra.",
    slug: "razon-emocion-misma-mesa",
    category: "Razón y emoción",
    excerpt:
      "Un método personal para pensar con rigor sin empobrecer lo que sentimos, y para sentir con libertad sin convertir cada emoción en una certeza.",
    readTime: "6 min",
    wordCount: 1044,
    raw: reasonRaw,
  },
  {
    order: 3,
    file: "03-vulnerabilidad-necesita-estructura.md",
    title: "La vulnerabilidad necesita estructura",
    bajada:
      "Abrirme no significa entregarlo todo. La estructura es lo que permite que una verdad delicada exista sin convertirse en deuda, espectáculo o confusión.",
    slug: "vulnerabilidad-necesita-estructura",
    category: "Vulnerabilidad y límites",
    excerpt:
      "Sobre contratos, límites y formas concretas de sostener la apertura emocional y creativa sin endurecerla ni explotarla.",
    readTime: "6 min",
    wordCount: 1052,
    raw: vulnerabilityRaw,
  },
  {
    order: 4,
    file: "04-ia-espejo-no-oraculo.md",
    title: "La inteligencia artificial es un espejo, no un oráculo",
    bajada:
      "Una respuesta convincente puede ordenar mi pensamiento, pero no adquiere acceso a una verdad oculta solo porque está bien escrita.",
    slug: "ia-espejo-no-oraculo",
    category: "Inteligencia artificial",
    excerpt:
      "Cómo usar la IA para pensar, crear y ordenar sin cederle autoridad sobre los hechos, la conciencia ajena o las decisiones que me corresponden.",
    readTime: "6 min",
    wordCount: 1059,
    raw: intelligenceRaw,
  },
  {
    order: 5,
    file: "05-archivar-es-cuidar.md",
    title: "Archivar es cuidar, no acumular",
    bajada:
      "Guardar una vida no consiste en conservarlo todo al mismo nivel. Consiste en preservar el origen, declarar los límites y decidir con responsabilidad qué puede circular.",
    slug: "archivar-es-cuidar-no-acumular",
    category: "Archivo y memoria",
    excerpt:
      "Una ética práctica del archivo personal y creativo: originales, versiones, procedencia, privacidad y una memoria capaz de durar sin exponer.",
    readTime: "6 min",
    wordCount: 1055,
    raw: archiveRaw,
  },
  {
    order: 6,
    file: "06-crear-mundos-no-vitrinas.md",
    title: "Crear mundos, no vitrinas",
    bajada:
      "Una web no tiene que limitarse a mostrar una obra. Puede convertirse en el primer lugar donde esa obra sucede.",
    slug: "crear-mundos-no-vitrinas",
    category: "Diseño inmersivo",
    excerpt:
      "Principios para construir experiencias digitales espaciales, vivas y accesibles, donde la tecnología sostiene una transformación en lugar de exhibir efectos.",
    readTime: "7 min",
    wordCount: 1210,
    raw: immersiveRaw,
  },
  {
    order: 7,
    file: "07-archivar-no-es-perseguir.md",
    title: "Archivar no es perseguir",
    bajada:
      "Guardar una conversación no me convierte en enemigo. Me convierte en alguien que se niega a perder la forma real de lo vivido.",
    slug: "archivar-no-es-perseguir",
    category: "Archivo y memoria",
    excerpt:
      "Una defensa de la memoria exacta, el registro y la prudencia como herramientas para no confundir intensidad con verdad.",
    readTime: "7 min",
    wordCount: 1218,
    raw: archiveNoPerseguirRaw,
  },
  {
    order: 8,
    file: "08-la-segunda-oportunidad-es-un-regreso.md",
    title: "La segunda oportunidad es un regreso",
    bajada:
      "La deuda puede encoger la vida hasta dejarla en cifras. Recuperarse no consiste en negar el daño, sino en construir una salida que vuelva habitable el futuro.",
    slug: "la-segunda-oportunidad-es-un-regreso",
    category: "Deuda y dignidad",
    excerpt:
      "Una reflexión personal sobre insolvencia, vergüenza, trabajo, vivienda y dignidad cuando la vida financiera se rompe.",
    readTime: "8 min",
    wordCount: 1254,
    raw: secondChanceRaw,
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
