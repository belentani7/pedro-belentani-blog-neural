export type AuditPillar =
  | "hierarchy"
  | "motion"
  | "accessibility"
  | "performance";

export type FindingStatus = "pass" | "warn" | "fail" | "info";

export interface AuditFinding {
  readonly id: string;
  readonly pillar: AuditPillar;
  readonly status: FindingStatus;
  readonly title: string;
  readonly evidence: string;
  readonly action: string;
  readonly criterion?: string;
}

export interface PillarSummary {
  readonly id: AuditPillar;
  readonly label: string;
  readonly score: number;
  readonly pass: number;
  readonly warn: number;
  readonly fail: number;
  readonly info: number;
}

export interface AuditMetrics {
  readonly domNodes: number;
  readonly headings: number;
  readonly interactiveElements: number;
  readonly images: number;
  readonly scripts: number;
  readonly serializedKilobytes: number;
}

export interface AuditResult {
  readonly sourceLabel: string;
  readonly mode: "live" | "source";
  readonly generatedAt: string;
  readonly score: number;
  readonly findings: readonly AuditFinding[];
  readonly pillars: readonly PillarSummary[];
  readonly metrics: AuditMetrics;
}

export const PILLAR_META: ReadonlyArray<{
  readonly id: AuditPillar;
  readonly label: string;
  readonly shortLabel: string;
  readonly description: string;
}> = [
  {
    id: "hierarchy",
    label: "Jerarquía",
    shortLabel: "01 / Jerarquía",
    description: "Estructura semántica, título, landmarks y secuencia de lectura.",
  },
  {
    id: "motion",
    label: "Movimiento",
    shortLabel: "02 / Movimiento",
    description: "Preferencias reducidas, reproducción automática y control de efectos.",
  },
  {
    id: "accessibility",
    label: "Accesibilidad",
    shortLabel: "03 / Accesibilidad",
    description: "Nombres, etiquetas, idioma, foco, contraste y objetivos táctiles.",
  },
  {
    id: "performance",
    label: "Rendimiento",
    shortLabel: "04 / Rendimiento",
    description: "Complejidad DOM, medios, scripts bloqueantes y peso estructural.",
  },
] as const;

const STATUS_SCORE: Record<FindingStatus, number | null> = {
  pass: 100,
  warn: 55,
  fail: 10,
  info: null,
};

function finding(
  pillar: AuditPillar,
  id: string,
  status: FindingStatus,
  title: string,
  evidence: string,
  action: string,
  criterion?: string,
): AuditFinding {
  return { pillar, id, status, title, evidence, action, criterion };
}

function visibleText(element: Element): string {
  const ariaLabel = element.getAttribute("aria-label")?.trim();
  const ariaLabelledBy = element.getAttribute("aria-labelledby")?.trim();
  if (ariaLabel) return ariaLabel;
  if (ariaLabelledBy) {
    const text = ariaLabelledBy
      .split(/\s+/)
      .map((id) => element.ownerDocument.getElementById(id)?.textContent?.trim() ?? "")
      .filter(Boolean)
      .join(" ");
    if (text) return text;
  }
  const imageAlt = element.querySelector("img[alt]")?.getAttribute("alt")?.trim();
  return element.textContent?.trim() || imageAlt || "";
}

function hasControlLabel(control: Element, documentNode: Document): boolean {
  if (control.getAttribute("aria-label")?.trim()) return true;
  if (control.getAttribute("aria-labelledby")?.trim()) return true;
  if (control.closest("label")) return true;
  const id = control.getAttribute("id");
  if (!id) return false;
  return Array.from(documentNode.querySelectorAll("label[for]")).some(
    (label) => label.getAttribute("for") === id,
  );
}

function collectCssText(documentNode: Document): string {
  const embedded = Array.from(documentNode.querySelectorAll("style"))
    .map((style) => style.textContent ?? "")
    .join("\n");

  if (typeof document === "undefined" || documentNode !== document) return embedded;

  const rules: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) rules.push(rule.cssText);
    } catch {
      // A cross-origin stylesheet cannot expose CSS rules to the browser.
    }
  }
  return `${embedded}\n${rules.join("\n")}`;
}

function hierarchyFindings(documentNode: Document): AuditFinding[] {
  const headings = Array.from(documentNode.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  const h1Count = documentNode.querySelectorAll("h1").length;
  const jumps = headings.reduce<number[]>((found, heading, index) => {
    if (index === 0) return found;
    const previous = Number(headings[index - 1].tagName.slice(1));
    const current = Number(heading.tagName.slice(1));
    if (current - previous > 1) found.push(index + 1);
    return found;
  }, []);
  const mainCount = documentNode.querySelectorAll("main").length;
  const title = documentNode.querySelector("title")?.textContent?.trim() ?? "";
  const regionsWithoutName = Array.from(
    documentNode.querySelectorAll("nav, aside, section[role='region']"),
  ).filter(
    (element) =>
      !element.getAttribute("aria-label")?.trim() &&
      !element.getAttribute("aria-labelledby")?.trim(),
  );

  return [
    finding(
      "hierarchy",
      "single-h1",
      h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warn",
      "Un propósito principal",
      h1Count === 1 ? "Se encontró un único H1." : `Se encontraron ${h1Count} elementos H1.`,
      h1Count === 1 ? "Conservar el H1 como declaración principal." : "Definir un único H1 que describa el propósito de la página.",
      "WCAG 1.3.1",
    ),
    finding(
      "hierarchy",
      "heading-order",
      jumps.length === 0 && headings.length > 0 ? "pass" : headings.length === 0 ? "fail" : "warn",
      "Secuencia de encabezados",
      headings.length === 0
        ? "No se encontraron encabezados."
        : jumps.length === 0
          ? `${headings.length} encabezados mantienen una progresión sin saltos.`
          : `${jumps.length} saltos de nivel aparecen en las posiciones ${jumps.join(", ")}.`,
      jumps.length === 0 && headings.length > 0
        ? "Mantener la secuencia como índice de lectura."
        : "Ordenar niveles sin saltar, por ejemplo de H2 a H3.",
      "WCAG 1.3.1",
    ),
    finding(
      "hierarchy",
      "main-landmark",
      mainCount === 1 ? "pass" : mainCount === 0 ? "fail" : "warn",
      "Landmark principal",
      mainCount === 1 ? "Existe un único elemento main." : `Se encontraron ${mainCount} elementos main.`,
      mainCount === 1 ? "Conservar el contenido central dentro de main." : "Usar un único elemento main por documento.",
      "WCAG 1.3.1",
    ),
    finding(
      "hierarchy",
      "document-title",
      title.length >= 12 ? "pass" : title ? "warn" : "fail",
      "Título de documento",
      title ? `Título detectado: “${title.slice(0, 90)}”.` : "El documento no declara title.",
      title.length >= 12 ? "Mantener un título específico por ruta." : "Escribir un título breve que identifique página y contexto.",
      "WCAG 2.4.2",
    ),
    finding(
      "hierarchy",
      "named-regions",
      regionsWithoutName.length === 0 ? "pass" : "warn",
      "Regiones reconocibles",
      regionsWithoutName.length === 0
        ? "Las regiones detectadas tienen nombre accesible o no lo requieren."
        : `${regionsWithoutName.length} regiones pueden necesitar un nombre accesible.`,
      regionsWithoutName.length === 0
        ? "Conservar nombres breves y distintos."
        : "Añadir aria-label o aria-labelledby solo a regiones que necesiten distinguirse.",
      "WCAG 1.3.1",
    ),
  ];
}

function motionFindings(documentNode: Document, cssText: string): AuditFinding[] {
  const motionRules = (cssText.match(/(?:animation(?:-name)?|transition)\s*:/gi) ?? []).length;
  const reducedMotion = /prefers-reduced-motion\s*:\s*reduce/i.test(cssText);
  const autoplayMedia = Array.from(documentNode.querySelectorAll("video[autoplay], audio[autoplay]"));
  const loopingMedia = autoplayMedia.filter((media) => media.hasAttribute("loop"));
  const marqueeLike = documentNode.querySelectorAll("marquee, blink").length;
  const motionControls = Array.from(documentNode.querySelectorAll("button, input[type='checkbox']")).filter(
    (element) => /movimiento|motion|animaci|paus/i.test(visibleText(element)),
  );

  return [
    finding(
      "motion",
      "reduced-motion",
      motionRules === 0 ? "info" : reducedMotion ? "pass" : "fail",
      "Preferencia de movimiento reducido",
      motionRules === 0
        ? "No se detectaron reglas CSS de animación o transición."
        : reducedMotion
          ? "El CSS incluye una respuesta a prefers-reduced-motion: reduce."
          : `${motionRules} reglas de movimiento sin respuesta reducida detectable.`,
      motionRules === 0
        ? "Revisar de nuevo si se añade movimiento."
        : reducedMotion
          ? "Probar el recorrido completo con la preferencia del sistema activada."
          : "Añadir una variante estable para prefers-reduced-motion: reduce.",
      "WCAG 2.3.3 · AAA",
    ),
    finding(
      "motion",
      "autoplay",
      autoplayMedia.length === 0 ? "pass" : loopingMedia.length > 0 ? "fail" : "warn",
      "Reproducción automática",
      autoplayMedia.length === 0
        ? "No se encontraron medios con autoplay."
        : `${autoplayMedia.length} medios usan autoplay; ${loopingMedia.length} también repiten.`,
      autoplayMedia.length === 0
        ? "Mantener la reproducción bajo decisión de la persona."
        : "Ofrecer pausa visible y evitar reproducción automática con sonido.",
      "WCAG 1.4.2 / 2.2.2",
    ),
    finding(
      "motion",
      "obsolete-motion",
      marqueeLike === 0 ? "pass" : "fail",
      "Movimiento continuo legado",
      marqueeLike === 0
        ? "No se encontraron elementos marquee o blink."
        : `Se encontraron ${marqueeLike} elementos de movimiento continuo legado.`,
      marqueeLike === 0 ? "Conservar esta base." : "Sustituirlos por contenido estático o controlable.",
      "WCAG 2.2.2",
    ),
    finding(
      "motion",
      "motion-control",
      autoplayMedia.length === 0 || motionControls.length > 0 ? "pass" : "warn",
      "Control explícito",
      motionControls.length > 0
        ? `${motionControls.length} controles relacionados con movimiento son detectables.`
        : autoplayMedia.length === 0
          ? "No hay reproducción automática que exija un control específico."
          : "No se detectó un control nombrado para pausar el movimiento.",
      autoplayMedia.length === 0 || motionControls.length > 0
        ? "Verificar que el control conserve estado y foco."
        : "Añadir un control persistente con nombre y estado accesibles.",
      "WCAG 2.2.2 / 4.1.2",
    ),
  ];
}

interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

function parseRgb(value: string): Rgb | null {
  const match = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i);
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function composite(foreground: Rgb, background: Rgb): Rgb {
  const alpha = foreground.a + background.a * (1 - foreground.a);
  if (alpha === 0) return { r: 255, g: 255, b: 255, a: 1 };
  return {
    r: (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) / alpha,
    g: (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) / alpha,
    b: (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) / alpha,
    a: alpha,
  };
}

function luminance(color: Rgb): number {
  const channels = [color.r, color.g, color.b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(first: Rgb, second: Rgb): number {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

function solidBackground(element: Element, view: Window): Rgb | null {
  let current: Element | null = element;
  let resolved: Rgb = { r: 255, g: 255, b: 255, a: 1 };
  const layers: Rgb[] = [];

  while (current) {
    const style = view.getComputedStyle(current);
    if (style.backgroundImage !== "none") return null;
    const color = parseRgb(style.backgroundColor);
    if (color && color.a > 0) {
      layers.push(color);
      if (color.a >= 0.999) break;
    }
    current = current.parentElement;
  }

  for (let index = layers.length - 1; index >= 0; index -= 1) {
    resolved = composite(layers[index], resolved);
  }
  return resolved;
}

function contrastSample(documentNode: Document): { checked: number; failed: number; lowest: number | null } {
  if (typeof window === "undefined" || documentNode !== document) {
    return { checked: 0, failed: 0, lowest: null };
  }

  const candidates = Array.from(
    documentNode.querySelectorAll("h1, h2, h3, p, a, button, label, input, textarea, summary, small"),
  ).slice(0, 180);
  let checked = 0;
  let failed = 0;
  let lowest: number | null = null;

  for (const element of candidates) {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    if (!visibleText(element) || rect.width === 0 || rect.height === 0 || style.visibility === "hidden") continue;
    const foreground = parseRgb(style.color);
    const background = solidBackground(element, window);
    if (!foreground || !background) continue;

    const resolvedForeground = composite(foreground, background);
    const ratio = contrastRatio(resolvedForeground, background);
    const fontSize = Number.parseFloat(style.fontSize);
    const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
    const required = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700) ? 3 : 4.5;
    checked += 1;
    if (ratio < required) failed += 1;
    lowest = lowest === null ? ratio : Math.min(lowest, ratio);
  }
  return { checked, failed, lowest };
}

function accessibilityFindings(documentNode: Document, cssText: string): AuditFinding[] {
  const lang = documentNode.documentElement.getAttribute("lang")?.trim() ?? "";
  const images = Array.from(documentNode.querySelectorAll("img"));
  const imagesWithoutAlt = images.filter((image) => !image.hasAttribute("alt"));
  const controls = Array.from(documentNode.querySelectorAll("button, a[href]"));
  const unnamedControls = controls.filter((control) => !visibleText(control));
  const fields = Array.from(
    documentNode.querySelectorAll("input:not([type='hidden']), select, textarea"),
  );
  const unlabeledFields = fields.filter((field) => !hasControlLabel(field, documentNode));
  const duplicateIds = Array.from(documentNode.querySelectorAll("[id]"))
    .map((element) => element.id)
    .filter((id, index, ids) => id && ids.indexOf(id) !== index);
  const uniqueDuplicateIds = new Set(duplicateIds);
  const focusRule = /:focus(?:-visible)?\b/i.test(cssText);
  const contrast = contrastSample(documentNode);

  let undersized = 0;
  let measuredTargets = 0;
  if (typeof window !== "undefined" && documentNode === document) {
    for (const control of controls.concat(fields)) {
      const rect = control.getBoundingClientRect();
      const style = window.getComputedStyle(control);
      if (rect.width === 0 || rect.height === 0 || style.visibility === "hidden" || style.display === "none") continue;
      measuredTargets += 1;
      if (rect.width < 44 || rect.height < 44) undersized += 1;
    }
  }

  return [
    finding(
      "accessibility",
      "document-language",
      lang ? "pass" : "fail",
      "Idioma del documento",
      lang ? `Idioma declarado: ${lang}.` : "El elemento html no declara lang.",
      lang ? "Confirmar que el código coincide con el idioma principal." : "Añadir lang al elemento html.",
      "WCAG 3.1.1",
    ),
    finding(
      "accessibility",
      "image-alternatives",
      imagesWithoutAlt.length === 0 ? "pass" : "fail",
      "Alternativas de imagen",
      images.length === 0
        ? "No hay imágenes en el documento."
        : imagesWithoutAlt.length === 0
          ? `${images.length} imágenes declaran alt, incluido alt vacío cuando son decorativas.`
          : `${imagesWithoutAlt.length} de ${images.length} imágenes no declaran alt.`,
      imagesWithoutAlt.length === 0
        ? "Revisar que cada texto alternativo describa la función real."
        : "Añadir alt descriptivo o alt vacío a imágenes decorativas.",
      "WCAG 1.1.1",
    ),
    finding(
      "accessibility",
      "accessible-names",
      unnamedControls.length === 0 ? "pass" : "fail",
      "Nombre de controles",
      unnamedControls.length === 0
        ? `${controls.length} enlaces y botones tienen nombre detectable.`
        : `${unnamedControls.length} de ${controls.length} enlaces o botones carecen de nombre detectable.`,
      unnamedControls.length === 0
        ? "Confirmar el anuncio con NVDA o VoiceOver."
        : "Dar texto visible o un nombre accesible equivalente.",
      "WCAG 4.1.2",
    ),
    finding(
      "accessibility",
      "field-labels",
      unlabeledFields.length === 0 ? "pass" : "fail",
      "Etiquetas de campos",
      fields.length === 0
        ? "No hay campos de formulario."
        : unlabeledFields.length === 0
          ? `${fields.length} campos tienen etiqueta detectable.`
          : `${unlabeledFields.length} de ${fields.length} campos no tienen etiqueta detectable.`,
      unlabeledFields.length === 0 ? "Mantener etiquetas persistentes." : "Asociar cada campo con label, aria-label o aria-labelledby.",
      "WCAG 3.3.2 / 4.1.2",
    ),
    finding(
      "accessibility",
      "duplicate-ids",
      uniqueDuplicateIds.size === 0 ? "pass" : "fail",
      "Identificadores únicos",
      uniqueDuplicateIds.size === 0
        ? "No se detectaron identificadores duplicados."
        : `${uniqueDuplicateIds.size} identificadores se repiten.`,
      uniqueDuplicateIds.size === 0 ? "Conservar identificadores únicos." : "Asignar un id único antes de asociar etiquetas o regiones.",
      "WCAG 4.1.2",
    ),
    finding(
      "accessibility",
      "focus-visible",
      focusRule ? "pass" : "warn",
      "Indicador de foco",
      focusRule ? "El CSS contiene reglas :focus o :focus-visible." : "No se detectaron reglas explícitas de foco en el CSS disponible.",
      focusRule ? "Recorrer toda la interfaz usando solo Tab y Shift+Tab." : "Añadir un indicador de foco con contraste visible.",
      "WCAG 2.4.7",
    ),
    finding(
      "accessibility",
      "touch-targets",
      measuredTargets === 0 ? "info" : undersized === 0 ? "pass" : "warn",
      "Objetivos táctiles",
      measuredTargets === 0
        ? "El tamaño necesita una página renderizada; el código importado no se ejecuta."
        : undersized === 0
          ? `${measuredTargets} objetivos medidos alcanzan 44 × 44 px.`
          : `${undersized} de ${measuredTargets} objetivos medidos quedan por debajo de 44 × 44 px.`,
      measuredTargets === 0
        ? "Validar esta comprobación en navegador."
        : undersized === 0
          ? "Conservar área activa y separación."
          : "Ampliar el área activa o la separación alrededor del control.",
      "WCAG 2.5.5 · AAA",
    ),
    finding(
      "accessibility",
      "text-contrast",
      contrast.checked === 0 ? "info" : contrast.failed === 0 ? "pass" : "fail",
      "Contraste de texto",
      contrast.checked === 0
        ? "El contraste computado requiere la página renderizada y fondos sólidos."
        : contrast.failed === 0
          ? `${contrast.checked} muestras computables superan su umbral; mínimo ${contrast.lowest?.toFixed(2)}:1.`
          : `${contrast.failed} de ${contrast.checked} muestras computables quedan bajo su umbral; mínimo ${contrast.lowest?.toFixed(2)}:1.`,
      contrast.checked === 0
        ? "Medir estados y fondos complejos con una herramienta de contraste."
        : contrast.failed === 0
          ? "Comprobar también hover, foco y fondos con imagen."
          : "Ajustar color, fondo, tamaño o peso en las muestras fallidas.",
      "WCAG 1.4.3",
    ),
  ];
}

function performanceFindings(documentNode: Document, sourceText: string): AuditFinding[] {
  const nodeCount = documentNode.querySelectorAll("*").length;
  const images = Array.from(documentNode.querySelectorAll("img"));
  const imagesWithoutDimensions = images.filter(
    (image) => !image.hasAttribute("width") || !image.hasAttribute("height"),
  );
  const scripts = Array.from(documentNode.querySelectorAll("script"));
  const blockingScripts = scripts.filter(
    (script) =>
      Boolean(script.getAttribute("src")) &&
      !script.hasAttribute("async") &&
      !script.hasAttribute("defer") &&
      script.getAttribute("type") !== "module",
  );
  const embeddedFrames = documentNode.querySelectorAll("iframe, embed, object").length;
  const largeDataUris = Array.from(documentNode.querySelectorAll("[src], [href]"))
    .map((element) => element.getAttribute("src") ?? element.getAttribute("href") ?? "")
    .filter((value) => value.startsWith("data:") && value.length > 100_000).length;
  const kilobytes = new TextEncoder().encode(sourceText).byteLength / 1024;

  return [
    finding(
      "performance",
      "dom-size",
      nodeCount <= 1_500 ? "pass" : nodeCount <= 3_000 ? "warn" : "fail",
      "Complejidad DOM",
      `${nodeCount.toLocaleString("es-ES")} nodos; el umbral operativo local es 1.500.`,
      nodeCount <= 1_500 ? "Conservar la estructura contenida." : "Eliminar envoltorios sin función y renderizar bajo demanda las colecciones grandes.",
    ),
    finding(
      "performance",
      "image-dimensions",
      imagesWithoutDimensions.length === 0 ? "pass" : "warn",
      "Reserva de espacio para imágenes",
      images.length === 0
        ? "No hay imágenes que medir."
        : imagesWithoutDimensions.length === 0
          ? `${images.length} imágenes declaran width y height.`
          : `${imagesWithoutDimensions.length} de ${images.length} imágenes no declaran ambas dimensiones.`,
      imagesWithoutDimensions.length === 0 ? "Mantener dimensiones o aspect-ratio estables." : "Declarar width y height o un aspect-ratio equivalente.",
    ),
    finding(
      "performance",
      "blocking-scripts",
      blockingScripts.length === 0 ? "pass" : "warn",
      "Scripts bloqueantes",
      blockingScripts.length === 0
        ? `${scripts.length} scripts sin bloqueo clásico detectable.`
        : `${blockingScripts.length} de ${scripts.length} scripts externos no declaran async, defer o type=module.`,
      blockingScripts.length === 0 ? "Conservar la carga no bloqueante." : "Diferir scripts que no sean críticos para el primer render.",
    ),
    finding(
      "performance",
      "embedded-contexts",
      embeddedFrames <= 2 ? "pass" : "warn",
      "Contextos embebidos",
      embeddedFrames === 0 ? "No hay iframes, object o embed." : `Se detectaron ${embeddedFrames} contextos embebidos.`,
      embeddedFrames <= 2 ? "Cargar cada integración solo cuando aporte valor visible." : "Sustituir o diferir integraciones no esenciales.",
    ),
    finding(
      "performance",
      "serialized-size",
      kilobytes <= 500 ? "pass" : kilobytes <= 1_000 ? "warn" : "fail",
      "Peso del HTML serializado",
      `${kilobytes.toLocaleString("es-ES", { maximumFractionDigits: 1 })} KB en la lectura local; no equivale al peso transferido por red.`,
      kilobytes <= 500 ? "Conservar el documento concentrado." : "Mover datos extensos fuera del HTML inicial o cargarlos cuando se necesiten.",
    ),
    finding(
      "performance",
      "large-data-uris",
      largeDataUris === 0 ? "pass" : "warn",
      "Recursos incrustados extensos",
      largeDataUris === 0 ? "No se detectaron data URI superiores a 100 KB." : `Se detectaron ${largeDataUris} data URI superiores a 100 KB.`,
      largeDataUris === 0 ? "Conservar los binarios fuera del documento." : "Servir recursos grandes como archivos optimizados y cacheables.",
    ),
  ];
}

function summarize(findings: readonly AuditFinding[]): PillarSummary[] {
  return PILLAR_META.map(({ id, label }) => {
    const scoped = findings.filter((item) => item.pillar === id);
    const scored = scoped
      .map((item) => STATUS_SCORE[item.status])
      .filter((value): value is number => value !== null);
    const rawScore = scored.length
      ? Math.round(scored.reduce((sum, value) => sum + value, 0) / scored.length)
      : 100;
    const info = scoped.filter((item) => item.status === "info").length;
    const score = info > 0 ? Math.min(rawScore, 95) : rawScore;
    return {
      id,
      label,
      score,
      pass: scoped.filter((item) => item.status === "pass").length,
      warn: scoped.filter((item) => item.status === "warn").length,
      fail: scoped.filter((item) => item.status === "fail").length,
      info,
    };
  });
}

export function auditDocument(
  documentNode: Document,
  sourceLabel: string,
  mode: AuditResult["mode"],
  suppliedSource?: string,
): AuditResult {
  const sourceText = suppliedSource ?? documentNode.documentElement.outerHTML;
  const cssText = collectCssText(documentNode);
  const findings = [
    ...hierarchyFindings(documentNode),
    ...motionFindings(documentNode, cssText),
    ...accessibilityFindings(documentNode, cssText),
    ...performanceFindings(documentNode, sourceText),
  ];
  const pillars = summarize(findings);
  const score = Math.round(
    pillars.reduce((sum, pillar) => sum + pillar.score, 0) / pillars.length,
  );

  return {
    sourceLabel,
    mode,
    generatedAt: new Date().toISOString(),
    score,
    findings,
    pillars,
    metrics: {
      domNodes: documentNode.querySelectorAll("*").length,
      headings: documentNode.querySelectorAll("h1, h2, h3, h4, h5, h6").length,
      interactiveElements: documentNode.querySelectorAll(
        "button, a[href], input:not([type='hidden']), select, textarea, summary, [tabindex]",
      ).length,
      images: documentNode.querySelectorAll("img").length,
      scripts: documentNode.querySelectorAll("script").length,
      serializedKilobytes: Math.round(new TextEncoder().encode(sourceText).byteLength / 1024),
    },
  };
}

export function auditHtmlSource(source: string, sourceLabel: string): AuditResult {
  const parsed = new DOMParser().parseFromString(source, "text/html");
  return auditDocument(parsed, sourceLabel, "source", source);
}

const STATUS_LABEL: Record<FindingStatus, string> = {
  pass: "CORRECTO",
  warn: "REVISAR",
  fail: "CRÍTICO",
  info: "MANUAL",
};

export function formatReport(result: AuditResult): string {
  const generated = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(result.generatedAt));
  const lines = [
    "FRONTEND PROOF — INFORME LOCAL",
    `Fuente: ${result.sourceLabel}`,
    `Generado: ${generated}`,
    `Índice heurístico: ${result.score}/100`,
    "Método: comprobaciones deterministas del DOM y CSS disponibles en el navegador.",
    "Límite: no sustituye Lighthouse, lector de pantalla, pruebas de red ni revisión humana.",
    "",
    ...result.pillars.flatMap((pillar) => [
      `${pillar.label.toUpperCase()} — ${pillar.score}/100`,
      `Correcto ${pillar.pass} · Revisar ${pillar.warn} · Crítico ${pillar.fail} · Manual ${pillar.info}`,
      ...result.findings
        .filter((item) => item.pillar === pillar.id)
        .flatMap((item) => [
          `[${STATUS_LABEL[item.status]}] ${item.title}${item.criterion ? ` · ${item.criterion}` : ""}`,
          `Evidencia: ${item.evidence}`,
          `Acción: ${item.action}`,
          "",
        ]),
    ]),
    "MÉTRICAS DE CONTEXTO",
    `Nodos DOM: ${result.metrics.domNodes}`,
    `Encabezados: ${result.metrics.headings}`,
    `Elementos interactivos: ${result.metrics.interactiveElements}`,
    `Imágenes: ${result.metrics.images}`,
    `Scripts: ${result.metrics.scripts}`,
    `HTML serializado: ${result.metrics.serializedKilobytes} KB`,
  ];
  return lines.join("\n");
}
