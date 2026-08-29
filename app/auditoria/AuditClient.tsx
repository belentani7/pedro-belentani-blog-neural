"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Link from "next/link";
import {
  auditDocument,
  auditHtmlSource,
  formatReport,
  PILLAR_META,
  type AuditFinding,
  type AuditPillar,
  type AuditResult,
  type FindingStatus,
} from "./auditEngine";
import styles from "./auditoria.module.css";

gsap.registerPlugin(CustomEase);

type PillarFilter = "all" | AuditPillar;

const STATUS_COPY: Record<
  FindingStatus,
  { readonly label: string; readonly marker: string }
> = {
  pass: { label: "Correcto", marker: "OK" },
  warn: { label: "Revisar", marker: "RV" },
  fail: { label: "Crítico", marker: "CR" },
  info: { label: "Manual", marker: "MN" },
};

const MAX_FILE_BYTES = 2 * 1024 * 1024;

function statusForScore(score: number): string {
  if (score >= 85) return "Base sólida";
  if (score >= 65) return "Revisión dirigida";
  return "Intervención prioritaria";
}

function fallbackCopy(text: string): boolean {
  const field = document.createElement("textarea");
  const previousFocus = document.activeElement;
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  try {
    document.body.appendChild(field);
    field.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }
}

function FindingRow({ finding }: { readonly finding: AuditFinding }) {
  const status = STATUS_COPY[finding.status];

  return (
    <li className={styles.finding} data-status={finding.status}>
      <div className={styles.findingStatus} aria-label={`Estado: ${status.label}`}>
        <span aria-hidden="true">{status.marker}</span>
        <strong>{status.label}</strong>
      </div>
      <div className={styles.findingBody}>
        <div className={styles.findingHeading}>
          <h3>{finding.title}</h3>
          {finding.criterion ? <span>{finding.criterion}</span> : null}
        </div>
        <p>{finding.evidence}</p>
        <p className={styles.findingAction}>
          <span>Acción</span>
          {finding.action}
        </p>
      </div>
    </li>
  );
}

function Results({
  result,
  activePillar,
  onFilter,
  onCopy,
  onDownload,
}: {
  readonly result: AuditResult;
  readonly activePillar: PillarFilter;
  readonly onFilter: (pillar: PillarFilter) => void;
  readonly onCopy: () => void;
  readonly onDownload: () => void;
}) {
  const filteredFindings = useMemo(
    () =>
      activePillar === "all"
        ? result.findings
        : result.findings.filter((finding) => finding.pillar === activePillar),
    [activePillar, result.findings],
  );
  const generated = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(result.generatedAt));

  return (
    <section className={styles.results} aria-labelledby="results-title">
      <div className={styles.reportTopline}>
        <div>
          <p className={styles.kicker}>Informe / {result.mode === "live" ? "DOM renderizado" : "fuente estática"}</p>
          <h2 id="results-title">Evidencia antes que impresión.</h2>
        </div>
        <div className={styles.reportActions}>
          <button type="button" className={styles.secondaryButton} onClick={onCopy}>
            Copiar informe
          </button>
          <button type="button" className={styles.primaryButton} onClick={onDownload}>
            Descargar .txt
          </button>
        </div>
      </div>

      <div className={styles.scoreRail}>
        <div className={styles.overallScore}>
          <span>Índice heurístico</span>
          <strong>{result.score}</strong>
          <small>/ 100 · {statusForScore(result.score)}</small>
        </div>
        <dl className={styles.contextMetrics}>
          <div>
            <dt>Nodos</dt>
            <dd>{result.metrics.domNodes.toLocaleString("es-ES")}</dd>
          </div>
          <div>
            <dt>Encabezados</dt>
            <dd>{result.metrics.headings}</dd>
          </div>
          <div>
            <dt>Controles</dt>
            <dd>{result.metrics.interactiveElements}</dd>
          </div>
          <div>
            <dt>HTML</dt>
            <dd>{result.metrics.serializedKilobytes} KB</dd>
          </div>
        </dl>
      </div>

      <p className={styles.reportSource}>
        <span>Fuente</span>
        {result.sourceLabel} · {generated}
      </p>

      <div className={styles.pillarGrid}>
        {result.pillars.map((pillar, index) => (
          <article className={styles.pillar} key={pillar.id}>
            <div className={styles.pillarHeading}>
              <span>0{index + 1}</span>
              <h3>{pillar.label}</h3>
              <strong>{pillar.score}</strong>
            </div>
            <progress
              aria-label={`Índice heurístico de ${pillar.label}: ${pillar.score} de 100`}
              max="100"
              value={pillar.score}
            />
            <p>
              {pillar.pass} correctos · {pillar.warn} a revisar · {pillar.fail} críticos
              {pillar.info ? ` · ${pillar.info} manuales` : ""}
            </p>
          </article>
        ))}
      </div>

      <div className={styles.findingsHeader}>
        <div>
          <p className={styles.kicker}>Hallazgos / {filteredFindings.length}</p>
          <h2>Qué conservar. Qué corregir.</h2>
        </div>
        <div className={styles.filters} role="group" aria-label="Filtrar hallazgos">
          <button
            type="button"
            aria-pressed={activePillar === "all"}
            onClick={() => onFilter("all")}
          >
            Todo
          </button>
          {PILLAR_META.map((pillar) => (
            <button
              type="button"
              aria-pressed={activePillar === pillar.id}
              key={pillar.id}
              onClick={() => onFilter(pillar.id)}
            >
              {pillar.label}
            </button>
          ))}
        </div>
      </div>

      <ol className={styles.findingsList}>
        {filteredFindings.map((finding) => (
          <FindingRow finding={finding} key={finding.id} />
        ))}
      </ol>

      <details className={styles.methodology}>
        <summary>Alcance y límites del informe</summary>
        <div>
          <p>
            El índice resume comprobaciones deterministas del DOM y del CSS que el navegador puede
            leer. Sirve para priorizar trabajo; no es una certificación ni un resultado Lighthouse.
          </p>
          <p>
            El HTML importado no se ejecuta. Por eso contraste computado, tamaño táctil, foco real,
            red, lector de pantalla y rendimiento en dispositivo permanecen como validación manual.
          </p>
        </div>
      </details>
    </section>
  );
}

export function AuditClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [htmlSource, setHtmlSource] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [activePillar, setActivePillar] = useState<PillarFilter>("all");
  const [message, setMessage] = useState("Preparando autoauditoría local.");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let context: gsap.Context | undefined;

    if (!reduceMotion) {
      CustomEase.create("proof-entry", "0.76,0,0.24,1");
      context = gsap.context(() => {
        const targets = gsap.utils.toArray<HTMLElement>(`.${styles.introItem}`);
        gsap.set(targets, { autoAlpha: 0, y: 28, willChange: "transform,opacity" });
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "proof-entry",
          onComplete: () => gsap.set(targets, { clearProps: "willChange" }),
        });
      }, root);
    }

    const frame = window.requestAnimationFrame(() => {
      const selfResult = auditDocument(
        document,
        "Esta interfaz · /auditoria",
        "live",
      );
      setResult(selfResult);
      setMessage("Autoauditoría local completada.");
    });

    return () => {
      window.cancelAnimationFrame(frame);
      context?.revert();
    };
  }, []);

  function applyResult(nextResult: AuditResult, completionMessage: string) {
    startTransition(() => {
      setResult(nextResult);
      setActivePillar("all");
      setError(null);
      setMessage(completionMessage);
    });
  }

  function auditThisPage() {
    applyResult(
      auditDocument(document, "Esta interfaz · /auditoria", "live"),
      "Autoauditoría del DOM renderizado completada.",
    );
  }

  function auditPastedHtml() {
    const source = htmlSource.trim();
    if (!source) {
      setError("Pega un documento o fragmento HTML antes de analizar.");
      return;
    }
    if (!/<[a-z][\s\S]*>/i.test(source)) {
      setError("No se detectó una estructura HTML analizable.");
      return;
    }
    if (new TextEncoder().encode(source).byteLength > MAX_FILE_BYTES) {
      setError("La fuente pegada supera el límite local de 2 MB.");
      return;
    }
    applyResult(
      auditHtmlSource(source, "HTML pegado en esta sesión"),
      "Fuente pegada analizada sin ejecutar scripts.",
    );
  }

  async function auditFile(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError("El archivo supera el límite local de 2 MB.");
      return;
    }
    if (file.type !== "text/html" && !file.name.toLowerCase().endsWith(".html")) {
      setError("Selecciona un archivo HTML.");
      return;
    }

    try {
      const source = await file.text();
      if (!/<[a-z][\s\S]*>/i.test(source)) {
        setError("El archivo no contiene una estructura HTML analizable.");
        return;
      }
      setHtmlSource(source);
      applyResult(
        auditHtmlSource(source, file.name),
        `${file.name} analizado localmente sin ejecutar scripts.`,
      );
    } catch {
      setError("El navegador no pudo leer el archivo seleccionado.");
    }
  }

  async function copyReport() {
    if (!result) return;
    const report = formatReport(result);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(report);
      setMessage("Informe copiado al portapapeles.");
    } catch {
      const copied = fallbackCopy(report);
      setMessage(copied ? "Informe copiado al portapapeles." : "El navegador bloqueó la copia automática.");
    }
  }

  function downloadReport() {
    if (!result) return;
    const blob = new Blob([formatReport(result)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const safeSource = result.sourceLabel
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()
      .slice(0, 48);
    anchor.href = url;
    anchor.download = `frontend-proof-${safeSource || "informe"}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setMessage("Informe descargado como archivo de texto.");
  }

  return (
    <div className={styles.page} ref={rootRef}>
      <a className={styles.skipLink} href="#audit-workspace">
        Saltar al espacio de auditoría
      </a>

      <header className={styles.hero}>
        <nav className={`${styles.nav} ${styles.introItem}`} aria-label="Navegación de la auditoría">
          <Link href="/" prefetch={false} aria-label="Volver al blog">
            PB<span>/</span>FRONTEND PROOF
          </Link>
          <span className={styles.routeMark}>/auditoria</span>
          <span className={styles.localMark}>Solo cliente</span>
        </nav>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={`${styles.kicker} ${styles.introItem}`}>Autoauditoría local / 4 dimensiones</p>
            <h1 className={styles.introItem}>
              Una interfaz puede
              <span>defender su calidad.</span>
            </h1>
            <p className={`${styles.heroLead} ${styles.introItem}`}>
              Jerarquía, movimiento, accesibilidad y rendimiento convertidos en evidencia legible,
              copiable y descargable.
            </p>
          </div>

          <aside className={`${styles.privacyNote} ${styles.introItem}`} aria-labelledby="privacy-title">
            <span aria-hidden="true">LOCAL / 01</span>
            <h2 id="privacy-title">Tu código no sale del navegador.</h2>
            <p>
              El archivo o HTML pegado vive en memoria durante esta sesión. No se envía, almacena
              ni ejecuta.
            </p>
          </aside>
        </div>

        <div className={`${styles.dimensionRail} ${styles.introItem}`} aria-label="Dimensiones evaluadas">
          {PILLAR_META.map((pillar) => (
            <div key={pillar.id}>
              <strong>{pillar.shortLabel}</strong>
              <span>{pillar.description}</span>
            </div>
          ))}
        </div>
      </header>

      <main id="audit-workspace" className={styles.main}>
        <section className={styles.workspace} aria-labelledby="workspace-title">
          <div className={styles.workspaceHeading}>
            <div>
              <p className={styles.kicker}>Entrada / privada</p>
              <h2 id="workspace-title">Elige la evidencia.</h2>
            </div>
            <p>
              La autoauditoría observa esta ruta renderizada. La importación revisa estructura
              estática sin abrir conexiones ni ejecutar el código recibido.
            </p>
          </div>

          <div className={styles.sourceGrid}>
            <button type="button" className={styles.selfAudit} onClick={auditThisPage}>
              <span>01</span>
              <strong>Auditar esta interfaz</strong>
              <small>DOM y estilos computables</small>
            </button>

            <label className={styles.fileAudit}>
              <span>02</span>
              <strong>Seleccionar archivo .html</strong>
              <small>Máximo local: 2 MB</small>
              <input
                className={styles.fileInput}
                type="file"
                accept=".html,text/html"
                onChange={(event) => void auditFile(event.currentTarget.files?.[0])}
              />
            </label>

            <div className={styles.pasteAudit}>
              <div className={styles.pasteHeading}>
                <label htmlFor="audit-source">03 / Pegar fuente HTML</label>
                <span>{htmlSource.length.toLocaleString("es-ES")} caracteres</span>
              </div>
              <textarea
                id="audit-source"
                value={htmlSource}
                onChange={(event) => {
                  setHtmlSource(event.currentTarget.value);
                  setError(null);
                }}
                rows={9}
                spellCheck={false}
                autoCapitalize="none"
                autoComplete="off"
                aria-describedby="source-help"
              />
              <div className={styles.pasteFooter}>
                <p id="source-help">DOMParser analiza la fuente como texto. Sus scripts permanecen inactivos.</p>
                <button
                  type="button"
                  className={styles.primaryButton}
                  disabled={!htmlSource.trim() || isPending}
                  onClick={auditPastedHtml}
                >
                  {isPending ? "Analizando" : "Analizar HTML pegado"}
                </button>
              </div>
            </div>
          </div>

          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <p className={styles.liveStatus} role="status" aria-live="polite">
            {message}
          </p>
        </section>

        {result ? (
          <Results
            result={result}
            activePillar={activePillar}
            onFilter={setActivePillar}
            onCopy={() => void copyReport()}
            onDownload={downloadReport}
          />
        ) : (
          <section className={styles.loading} aria-label="Auditoría en curso">
            <span aria-hidden="true" />
            <p>Preparando lectura local.</p>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <span>FRONTEND PROOF</span>
        <span>Heurística local · límites explícitos</span>
        <Link href="/" prefetch={false}>Volver al blog</Link>
      </footer>
    </div>
  );
}
