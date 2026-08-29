import "@fontsource-variable/instrument-sans";
import "@fontsource/bodoni-moda/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

const description =
  "Ensayos de Pedro Belentani sobre percepción, frontend inmersivo y creatividad como sistema, con fuentes primarias y documentación oficial.";
const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pedro Belentani — Lógica, arte e interfaz",
    template: "%s — Pedro Belentani",
  },
  description,
  openGraph: {
    type: "website",
    title: "Pedro Belentani — Lógica, arte e interfaz",
    description,
    images: [
      {
        url: "/og.png",
        width: 1672,
        height: 941,
        alt: "Un cerebro de partículas conecta percepción, estructura, movimiento y síntesis.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pedro Belentani — Lógica, arte e interfaz",
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
