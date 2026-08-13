import "@fontsource-variable/instrument-sans";
import "@fontsource/bodoni-moda/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

const description =
  "Ensayos sobre tecnología, razón, sentimiento y vulnerabilidad. Un pensamiento integrado convertido en experiencia digital.";
const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "La mente que no se divide — Pedro Belentani",
    template: "%s — La mente que no se divide",
  },
  description,
  openGraph: {
    type: "website",
    title: "La mente que no se divide",
    description,
    images: [
      {
        url: "/og.png",
        width: 1672,
        height: 941,
        alt: "Un cerebro de partículas une tecnología, razón, sentimiento y vulnerabilidad.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La mente que no se divide",
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
