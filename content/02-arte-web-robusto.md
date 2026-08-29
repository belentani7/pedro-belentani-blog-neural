# Arte web robusto

Una experiencia web inmersiva suele juzgarse por su estado ideal: pantalla amplia, GPU disponible, puntero preciso y movimiento activado. Ese estado sirve para dirigir la ambición, pero no puede definir por sí solo la obra. La web real incluye contextos que fallan, preferencias distintas, dispositivos estrechos y navegación sin ratón. La robustez no es una fase posterior a la estética. Es parte de su composición.

El principio central es la equivalencia de significado. Las versiones no tienen que verse iguales. Deben conservar la misma identidad, jerarquía y ruta. Un campo de partículas puede convertirse en una figura estática; una transición puede convertirse en un cambio inmediato; una navegación exploratoria puede convivir con enlaces explícitos. El efecto cambia. El argumento permanece.

## WebGL es una capacidad, no una certeza

La especificación WebGL 1.0.3 de Khronos define un contexto de renderizado para el elemento canvas, próximo a OpenGL ES 2.0. El proceso de creación contempla expresamente el fallo del drawing buffer: en ese caso se emite un error de creación y se devuelve null. La especificación también define pérdida y restauración del contexto. Tratar WebGL como garantía contradice el propio contrato técnico.

Por eso la detección debe comprobar capacidad real, no solo la existencia de una propiedad global. Crear un canvas temporal y solicitar un contexto permite decidir si conviene cargar la escena. Aun así, una importación dinámica puede fallar o el contexto puede perderse más tarde. Un límite de error alrededor de la escena protege el resto de la interfaz. El título, el texto y los enlaces deben existir fuera del canvas.

En este proyecto, la escena tridimensional es decorativa desde la perspectiva semántica y está marcada como oculta para tecnologías de asistencia. La forma del cerebro también existe en CSS para móvil, movimiento reducido, ausencia de WebGL o fallo del módulo. El fallback no intenta imitar cada partícula. Conserva la silueta, los cuatro campos de color y la relación espacial que sostiene la identidad.

## El movimiento requiere consentimiento operativo

El criterio 2.3.3 de WCAG 2.2, “Animation from Interactions”, establece en nivel AAA que el movimiento no esencial activado por interacción pueda deshabilitarse. La explicación de W3C señala que algunas animaciones pueden causar distracción, náusea o respuestas vestibulares, y propone respetar la preferencia del sistema o proporcionar un control.

Cumplir esa intención implica más que reducir una duración. Si una escena reacciona al puntero, fija contenido durante el scroll o interpola el desplazamiento, la versión reducida debe evitar ese cambio espacial. Opacidad o color pueden ofrecer una transición menos intensa cuando aportan estado, pero el contenido debe poder aparecer de forma inmediata. El control global de movimiento necesita un estado accesible, persistente durante la sesión y comprensible sin depender del color.

La experiencia completa tampoco debe cargarse primero para decidir después que no se usa. Consultar ancho, preferencia de movimiento y disponibilidad de WebGL antes de importar la escena evita descargar y ejecutar un coste innecesario. En móvil, una composición estática bien diseñada puede ser más fiel a la dirección que una versión lenta del efecto de escritorio.

## El scroll necesita ciclo de vida

ScrollTrigger documenta un modelo en el que el inicio y el final se calculan respecto al flujo del documento. Opciones como invalidateOnRefresh permiten invalidar valores almacenados cuando cambia el layout. Esto es importante en una interfaz responsiva: fuentes, contenido y viewport pueden alterar las medidas que originaron la animación.

En React, la limpieza es igual de importante. La documentación de gsap.context explica que un contexto reúne animaciones y ScrollTriggers creados dentro de su función, limita los selectores a un elemento y permite revertir el conjunto. Al desmontar un componente, context.revert elimina efectos y devuelve estilos. Sin ese cierre, una navegación puede dejar triggers activos o estilos inline sobre nodos que ya no deberían controlarse.

El patrón aplicado aquí tiene cuatro condiciones: la animación solo nace en cliente, sus selectores están acotados al hero, el trigger se elimina al desmontar y el valor compartido con el shader vuelve a su estado inicial. Las propiedades animadas son transformación y opacidad. will-change solo permanece mientras dura la entrada. Son decisiones pequeñas, pero juntas separan una demo de un componente mantenible.

## La dirección artística incluye los estados de fallo

Diseñar un fallback después de terminar la escena principal suele producir una copia empobrecida. Conviene definir desde el inicio qué elementos son esenciales.

1. Identidad: forma, contraste y relación cromática.
2. Información: título, tesis y rutas de lectura en HTML.
3. Interacción: enlaces y controles operables con teclado y tacto.
4. Movimiento: una capa opcional que revela transformación, nunca la única portadora de significado.

Con ese contrato, cada estado puede tener calidad propia. WebGL expresa integración mediante miles de puntos y líneas. El fallback usa contornos superpuestos. Reduced motion elimina la fijación durante el scroll. Todos presentan el mismo sistema: varios modos de pensamiento organizados por una estructura común.

## Verificar la obra completa

Una captura bonita no prueba robustez. La aceptación necesita comprobar el renderizado del servidor, las rutas, el estado 404, el foco inicial, el tamaño de objetivos táctiles, el desbordamiento horizontal y los errores de consola. Para la escena, no basta con encontrar un elemento canvas: hay que leer píxeles del drawing buffer o analizar una captura para confirmar que produjo imagen.

También hay que abrir la experiencia con WebGL desactivado y con prefers-reduced-motion activo. Esos estados no son casos marginales; son parte del contrato público. Si el contenido solo existe en condiciones ideales, no es una experiencia web robusta. Es una grabación pendiente.

El arte web gana fuerza cuando sus límites forman parte del lenguaje. La ingeniería no rebaja el gesto. Le da más lugares donde seguir siendo verdadero.
