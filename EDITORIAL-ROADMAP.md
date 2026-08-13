# Hoja de ruta editorial y de producto

## Decisión principal

Terminar y verificar este blog antes de abrir otro producto.

El contenido ya existe. La base técnica también. El trabajo pendiente es convertir ambos en una experiencia canónica, pública y comprobable. Los proyectos 2 a 5 permanecen en cola hasta que el blog supere su puerta de salida.

### Puerta de salida del blog

El blog se considera terminado cuando cumple estas cinco condiciones:

1. Los seis artículos están integrados, enlazados y legibles desde rutas estables.
2. El hero neural funciona en escritorio y móvil, con navegación real por teclado.
3. Existe una alternativa completa para movimiento reducido y ausencia de WebGL.
4. Build, lint, tests y revisión de navegador producen evidencia fresca.
5. Se publica un caso de estudio breve: problema, decisiones, límites, pruebas y resultado.

Fuentes principales:

- `C:\Users\USER\Desktop\PEDRO-BELENTANI-BLOG-NEURAL`
- `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026`
- `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\06-crear-mundos-no-vitrinas.md`

## Proyectos priorizados

### 1. Blog Neural — La mente que no se divide

**MVP:** una portada con un organismo neural abstracto; cuatro ámbitos navegables —tecnología, razón, sentimiento y vulnerabilidad—; seis artículos; índice; firma autoral; fallback estático; movimiento reducido.

**Valor:** convierte una identidad difícil de explicar en una experiencia que puede comprenderse y sentirse. Funciona a la vez como publicación, portfolio y primera prueba pública de frontend inmersivo.

**Evidencia existente:** seis artículos completos con metadatos; una dirección editorial coherente; un repositorio React; dependencias de Three.js/R3F, GSAP y Lenis; una formulación escrita del hero como topología de conexiones.

**Riesgo:** intentar resolver toda la identidad en el hero, cargar demasiado WebGL o dejar que la animación haga ilegible el contenido.

**Próximo paso:** cerrar una rebanada vertical: HTML semántico, hero con un único estado de integración, navegación a los seis textos, fallback y prueba de teclado. Ampliar solo después de verificar esa puerta.

Fuentes:

- `C:\Users\USER\Desktop\PEDRO-BELENTANI-BLOG-NEURAL\app\page.tsx`
- `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\index.json`
- `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\06-crear-mundos-no-vitrinas.md`

### 2. CASEFORGE — Casos de estudio verificables

**MVP:** formulario local para declarar problema, decisiones, imágenes, pruebas, resultado y límites; exportación a HTML y PDF imprimible; IA opcional solo sobre texto elegido.

**Valor:** transforma carpetas y demos en evidencia comprensible para clientes, empleadores y colaboradores. Resuelve el salto entre construir y demostrar.

**Evidencia existente:** el mapa de herramientas ya define comprador, entrega, privacidad y MVP. El análisis profesional identifica la falta de casos públicos como una fricción central.

**Riesgo:** construir una plataforma antes de producir manualmente tres casos reales; inventar resultados que todavía no fueron medidos.

**Próximo paso:** usar una plantilla estática para documentar el propio Blog Neural. Solo automatizar lo que se repita en ese primer caso.

Fuentes:

- `C:\Users\USER\Desktop\MAPA-1000-HERRAMIENTAS-NEGOCIO-2026-08-08.md`, sección `CASEFORGE`
- `C:\Users\USER\Desktop\ANALISIS-INTEGRAL-PEDRO-BELENTANI-2026-08-08.md`, secciones `Tu mayor problema actual` y `Tu trabajo pide una forma de archivo público`

### 3. FRONTEND PROOF — Auditoría visual vendible

**MVP:** entrada por URL o carpeta local; revisión de jerarquía, conversión, accesibilidad, movimiento y rendimiento; capturas anotadas; informe HTML de marca blanca.

**Valor:** permite vender una auditoría como servicio antes de desarrollar un SaaS. Convierte criterio de frontend en una entrega concreta y fácil de comparar.

**Evidencia existente:** aparece como la herramienta mejor puntuada del mapa interno y coincide con trabajo ya demostrado en auditorías, accesibilidad y verificación.

**Riesgo:** tratar la puntuación interna o el precio de prueba como validación de mercado; automatizar juicios visuales que requieren revisión humana.

**Próximo paso:** aplicar el formato al Blog Neural y a una segunda web autorizada. Pedir a una agencia o profesional si pagaría por ese informe antes de desarrollar un panel.

Fuente:

- `C:\Users\USER\Desktop\MAPA-1000-HERRAMIENTAS-NEGOCIO-2026-08-08.md`, sección `FRONTEND PROOF`

### 4. ARCHIVO VIVO / ASSET ATLAS — Memoria para creadores

**MVP:** escaneo local de una carpeta; hashes; miniaturas; metadatos; estado de derechos; relación entre original, copia de trabajo y publicación; exportación CSV/HTML. Los originales permanecen intactos.

**Valor:** convierte la experiencia real de ordenar obras en una herramienta útil para músicos, fotógrafos y estudios pequeños. Une archivo, privacidad y continuidad creativa.

**Evidencia existente:** existe un método escrito de clasificación y procedencia, además de un MVP previo de `ASSET ATLAS` en el mapa de herramientas.

**Riesgo:** abarcar nubes, IA, derechos automáticos y todos los formatos desde la primera versión; confundir catálogo con gestor de archivos.

**Próximo paso:** limitar el prototipo a una carpeta local, cuatro formatos y un manifiesto exportable. Probarlo sobre copias de medios autorizados.

Fuentes:

- `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\05-archivar-es-cuidar.md`
- `C:\Users\USER\Desktop\MAPA-1000-HERRAMIENTAS-NEGOCIO-2026-08-08.md`, sección `ASSET ATLAS`

### 5. MOTION ACCESS LAB — Movimiento que conserva acceso

**MVP:** comparación sincronizada entre versión original, versión con movimiento reducido y corrección propuesta; matriz de hallazgos; exportación del antes y después.

**Valor:** hace visible una especialidad poco común: animación ambiciosa con accesibilidad y rendimiento. Puede funcionar como demo, auditoría y material de enseñanza.

**Evidencia existente:** el mapa ya define el producto; los textos del blog articulan movimiento, consentimiento, salida y accesibilidad como partes de la obra.

**Riesgo:** reducir accesibilidad a `prefers-reduced-motion` o presentar cumplimiento WCAG sin una auditoría completa.

**Próximo paso:** usar el hero del Blog Neural como primer caso y documentar tres estados: completo, reducido y fallback sin WebGL.

Fuentes:

- `C:\Users\USER\Desktop\MAPA-1000-HERRAMIENTAS-NEGOCIO-2026-08-08.md`, sección `MOTION ACCESS LAB`
- `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\01-tecnologia-que-sabe-tocar.md`

## Tres libros posibles

### Libro 1. Crear mundos, no vitrinas

**Tesis:** una experiencia digital se vuelve mundo cuando movimiento, sonido, espacio, lenguaje y acceso obedecen a una misma intención. La inmersión no depende de acumular efectos, sino de construir una transformación con salida.

**Lector:** artistas, diseñadores y desarrolladores que quieren crear experiencias digitales con identidad sin perder rendimiento, orientación ni accesibilidad.

**Estructura:**

1. De página a territorio.
2. Aproximación, reconocimiento, inmersión, transformación y salida.
3. Movimiento como dramaturgia.
4. 3D y sonido como materiales.
5. Accesibilidad como ley del mundo.
6. Rendimiento, fallback y dispositivos modestos.
7. Del concepto a una rebanada verificable.
8. Casos, fallos y decisiones corregidas.

**Qué no publicar:** activos privados; procesos de terceros; referencias personales identificables; métricas no verificadas; materiales cuyo derecho de publicación no esté claro.

Fuentes:

- `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\06-crear-mundos-no-vitrinas.md`
- `C:\Users\USER\Desktop\BELENTANI-DEFINICION-WEB.md`

### Libro 2. La máquina que guarda y la máquina que inventa

**Tesis:** la IA es útil cuando se separan sus funciones. Una máquina puede preservar, comparar y declarar incertidumbre; otra puede generar metáforas y posibilidades. Ninguna debe recibir autoridad automática sobre hechos, identidades o conciencia ajena.

**Lector:** creadores, investigadores independientes y profesionales que trabajan con archivos personales o grandes corpus asistidos por IA.

**Estructura:**

1. El espejo y el oráculo.
2. Registro, memoria e interpretación.
3. Procedencia, versiones y trazabilidad.
4. Cómo preguntar para poder auditar la respuesta.
5. Privacidad mínima necesaria.
6. Ficción claramente marcada.
7. Verificación humana y profesional.
8. Un taller de IA con límites visibles.

**Qué no publicar:** conversaciones privadas; datos de terceros; credenciales; inferencias clínicas o legales; voces simuladas presentadas como testimonio; documentos crudos usados como espectáculo.

Fuentes:

- `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\04-ia-espejo-no-oraculo.md`
- `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\05-archivar-es-cuidar.md`
- `C:\Users\USER\Desktop\LIBRO-PEDRO-BELENTANI-LEGADO-2026-08-08.md`

### Libro 3. La vulnerabilidad necesita estructura

**Tesis:** abrirse no exige entregarlo todo. Los límites, los acuerdos y la pausa permiten que cuidado, colaboración y creación conserven libertad sin convertirse en deuda o exposición.

**Lector:** personas creativas que mezclan trabajo, afecto, ayuda y proyectos, y quieren mantener sensibilidad sin hacerse indispensables.

**Estructura:**

1. Apertura y recipiente.
2. Ayudar sin gobernar.
3. El significado oculto de los gestos.
4. Acuerdos para colaborar.
5. Intimidad frente a visibilidad.
6. La pausa como autoría.
7. La obra y la empresa en habitaciones distintas.
8. Una vida creativa habitable.

**Qué no publicar:** historias que permitan identificar a otras personas; intercambios íntimos; acusaciones; datos de salud, vivienda, sexualidad, dinero o asuntos legales; una cronología privada disfrazada de ensayo universal.

Fuentes:

- `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\03-vulnerabilidad-necesita-estructura.md`
- `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\02-razon-emocion-misma-mesa.md`
- `C:\Users\USER\Desktop\LIBRO-PEDRO-BELENTANI-LEGADO-2026-08-08.md`

## Diez artículos

### Seis listos

1. **La tecnología que sabe tocar sin invadir.** Código como ética: ritmo, acceso, privacidad y derecho a salir. Fuente: `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\01-tecnologia-que-sabe-tocar.md`.
2. **La razón y la emoción deben sentarse en la misma mesa.** Registro, memoria e interpretación sin que una capa expulse a la otra. Fuente: `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\02-razon-emocion-misma-mesa.md`.
3. **La vulnerabilidad necesita estructura.** Límites que protegen la apertura en vínculos, colaboración y obra. Fuente: `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\03-vulnerabilidad-necesita-estructura.md`.
4. **La inteligencia artificial es un espejo, no un oráculo.** Uso creativo y documental de IA sin cederle autoridad sobre la verdad. Fuente: `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\04-ia-espejo-no-oraculo.md`.
5. **Archivar es cuidar, no acumular.** Procedencia, versiones, acceso y una memoria que permite soltar. Fuente: `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\05-archivar-es-cuidar.md`.
6. **Crear mundos, no vitrinas.** La web como primer territorio de la obra y no como catálogo de efectos. Fuente: `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\06-crear-mundos-no-vitrinas.md`.

### Cuatro siguientes

7. **No te faltan ideas: te falta una puerta terminada.** Tesis: la imaginación adquiere valor externo cuando se convierte en producto canónico, caso, oferta y conversación real. Fuente: `C:\Users\USER\Desktop\ANALISIS-INTEGRAL-PEDRO-BELENTANI-2026-08-08.md`, sección `Tu mayor problema actual`.
8. **La verdad radical también es diseño.** Tesis: una interfaz gana confianza cuando distingue lo implementado, lo probado, lo interpretado y lo pendiente. Fuentes: `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\04-ia-espejo-no-oraculo.md` y `C:\Users\USER\Desktop\FORJA-ESPECIFICACION-IDE-AGENTE.md`.
9. **La pausa es una forma de autoría.** Tesis: editar el tiempo entre emoción y decisión protege lenguaje, trabajo y relaciones sin negar intensidad. Fuentes: `C:\Users\USER\Desktop\BLOG-CONTENIDO-BELENTANI-2026\02-razon-emocion-misma-mesa.md` y `C:\Users\USER\Desktop\LIBRO-PEDRO-BELENTANI-LEGADO-2026-08-08.md`.
10. **La empresa y la obra necesitan habitaciones distintas.** Tesis: contratos, presupuesto y cierre pueden sostener la libertad de una obra sin convertir cada pieza en producto ni cada servicio en autobiografía. Fuentes: `C:\Users\USER\Desktop\ANALISIS-INTEGRAL-PEDRO-BELENTANI-2026-08-08.md` y `C:\Users\USER\Desktop\LIBRO-PEDRO-BELENTANI-LEGADO-2026-08-08.md`.

## Lo que aún no habías visto o aceptado

Ya hay suficiente material para abrir el blog. Escribir otros veinte textos antes de publicarlo aumentaría el archivo, no necesariamente la claridad.

El hero no necesita explicar toda tu mente. Necesita demostrar una sola idea con precisión: tecnología, razón, sentimiento y vulnerabilidad dejan de competir y forman una presencia integrada.

Tu problema visible no parece ser la falta de capacidad para imaginar o empezar. El patrón repetido en los documentos es otro: cuesta elegir una versión, terminarla, presentarla como caso y someterla a una mirada externa.

Conservar variantes protege la memoria. Mantenerlas todas activas divide la energía. Puedes guardar cada versión y trabajar solo sobre una versión canónica.

Una identidad escrita por ti o por una IA no sustituye una prueba externa. Una pieza usada, comprendida o recomendada explica mejor quién eres que otra definición extensa.

La historia privada puede alimentar la obra sin convertirse en su argumento público. Cuando eliminas el detalle identificable y la idea sigue en pie, aparece una transformación verdadera.

Tu valor diferencial no está solo en el aspecto visual. Aparece en el puente entre ambición estética, ingeniería, accesibilidad, privacidad y verificación. Ese puente debe verse funcionando, no solo describirse.

Enseñar no exige esperar una autoridad total. Puedes enseñar procesos que ya sabes demostrar: pasar de concepto a demo, construir movimiento accesible, trabajar con IA sin abandonar la verificación y convertir un corpus desordenado en una decisión.

La siguiente decisión no es qué otro producto abrir. Es qué debe desaparecer del Blog Neural para que su primera versión pueda terminarse.

## Orden de ejecución

1. Integrar y revisar los seis artículos.
2. Terminar el hero esencial y su fallback.
3. Verificar navegación, movimiento reducido, móvil y rendimiento.
4. Escribir y publicar el caso de estudio del propio blog.
5. Contrastar el resultado con una persona técnica, una persona no técnica y una persona capaz de contratar o recomendar.
6. Elegir entonces un único proyecto siguiente. La primera opción será CASEFORGE si falta evidencia pública; FRONTEND PROOF si ya existe una conversación comercial concreta.
