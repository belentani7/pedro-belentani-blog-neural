# La mente que no se divide

Plataforma editorial de Pedro Belentani sobre tecnología, razón, sentimiento y vulnerabilidad. La portada convierte esos cuatro ámbitos en un organismo neural interactivo; el archivo publica seis ensayos y conecta proyectos y libros en desarrollo.

## Estado

- Aplicación local. Sin despliegue ni remoto Git configurado.
- Seis artículos completos en `content/`.
- Hero 3D diferido: R3F/Drei en escritorio compatible; alternativa visual completa en móvil, movimiento reducido o ausencia de WebGL.
- Movimiento con GSAP, ScrollTrigger, CustomEase y Lenis.
- Navegación por teclado, enlace de salto, controles táctiles de 48 px y contraste objetivo WCAG AA.
- Imagen social propia en `public/og.png`.

## Desarrollo

Requisitos: Node.js 22.13 o superior y Bun.

```powershell
bun install
bun run dev
```

Abrir `http://localhost:3000`.

Para que las tarjetas sociales usen el dominio final:

```powershell
$env:SITE_URL='https://dominio-ejemplo.com'
bun run build
```

## Verificación

```powershell
bun run lint
bunx tsc --noEmit --pretty false
bun run build
bun run test:browser
```

`test:browser` requiere Chrome instalado y un servidor de producción activo en `http://localhost:3000`. Puede cambiarse con `BLOG_BASE_URL`.

La prueba de navegador cubre escritorio, móvil, teclado, navegación editorial, movimiento reducido, ausencia de WebGL, desbordamiento horizontal y errores de consola.

## Arquitectura

- `app/components/NeuralHero.tsx`: narrativa, accesibilidad y carga condicional.
- `app/components/NeuralField.tsx`: organismo neural WebGL.
- `app/components/MotionProvider.tsx`: preferencia de movimiento y desplazamiento Lenis.
- `app/articulos/[slug]/page.tsx`: rutas editoriales y metadatos.
- `app/lib/articles.ts`: lectura y validación del corpus Markdown.
- `content/`: fuente canónica de artículos.
- `EDITORIAL-ROADMAP.md`: proyectos, libros y secuencia editorial.
- `tests/`: pruebas SSR, privacidad y navegador real.

## Privacidad y publicación

El contenido público excluye credenciales, datos personales de terceros, conversaciones privadas y material JUDAS sellado. Los textos distinguen hechos verificables, memoria, hipótesis e interpretación. Cualquier despliegue, dominio o publicación requiere una decisión explícita posterior.
