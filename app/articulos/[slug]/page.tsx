import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/app/components/ArticleBody";
import {
  articles,
  getArticleBySlug,
  getArticleNavigation,
} from "@/app/lib/articles";

type ArticlePageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export function generateStaticParams(): Array<{ slug: string }> {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artículo no encontrado",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { previous, next } = getArticleNavigation(article.slug);
  const articleNumber = String(article.order).padStart(2, "0");
  const articleCount = String(articles.length).padStart(2, "0");

  return (
    <main className="article-page">
      <article className="article-page__shell">
        <header className="article-header">
          <Link className="article-header__back" href="/#ensayos">
            Todos los artículos
          </Link>

          <div className="article-header__meta" aria-label="Datos del artículo">
            <span>{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>
              Ensayo {articleNumber}/{articleCount}
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime} de lectura</span>
          </div>

          <h1>{article.title}</h1>
          <p className="article-header__lead">{article.bajada}</p>
        </header>

        <ArticleBody content={article.body} />

        <section className="article-sources" aria-labelledby="article-sources-title">
          <p className="eyebrow">Referencias verificables</p>
          <h2 id="article-sources-title">Fuentes primarias y documentación oficial</h2>
          <ol>
            {article.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} rel="noreferrer" target="_blank">
                  <strong>{source.label}</strong>
                  <span>{source.citation}</span>
                </a>
                <p>{source.note}</p>
              </li>
            ))}
          </ol>
          <p className="article-sources__scope">
            Estos trabajos sustentan afirmaciones sobre tareas y muestras concretas. No son una
            evaluación neurobiológica del autor ni una explicación total de la creatividad.
          </p>
        </section>

        <nav className="article-navigation" aria-label="Navegación entre artículos">
          {previous ? (
            <a
              className="article-navigation__link article-navigation__link--previous"
              href={`/articulos/${previous.slug}`}
              rel="prev"
            >
              <span className="article-navigation__direction">Anterior</span>
              <span className="article-navigation__title">{previous.title}</span>
            </a>
          ) : (
            <span aria-hidden="true" />
          )}

          {next ? (
            <a
              className="article-navigation__link article-navigation__link--next"
              href={`/articulos/${next.slug}`}
              rel="next"
            >
              <span className="article-navigation__direction">Siguiente</span>
              <span className="article-navigation__title">{next.title}</span>
            </a>
          ) : (
            <Link
              className="article-navigation__link article-navigation__link--next"
              href="/#ensayos"
            >
              <span className="article-navigation__direction">Continuar</span>
              <span className="article-navigation__title">Volver al mapa</span>
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
