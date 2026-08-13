import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-page__content" aria-labelledby="not-found-title">
        <p className="not-found-page__code">404</p>
        <h1 id="not-found-title">Esta conexión no existe</h1>
        <p>
          El artículo que buscas no forma parte del mapa o ha cambiado de lugar.
        </p>
        <Link className="not-found-page__link" href="/#ensayos">
          Volver a los artículos
        </Link>
      </section>
    </main>
  );
}
