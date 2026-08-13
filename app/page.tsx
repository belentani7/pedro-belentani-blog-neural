import { HomePage, type HomeArticle } from "./components/HomePage";
import { articles } from "./lib/articles";

export const metadata = {
  description:
    "Ensayos sobre tecnología, razón, sentimiento y vulnerabilidad en una experiencia neural viva.",
};

export default function Home() {
  const summaries: HomeArticle[] = articles.map((article) => ({
    order: article.order,
    slug: article.slug,
    title: article.title,
    bajada: article.bajada,
    category: article.category,
    excerpt: article.excerpt,
    readTime: article.readTime,
  }));
  return <HomePage articles={summaries} />;
}
