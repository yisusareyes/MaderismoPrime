# José Madero — Querido Fan Experience V4.1

Versión mejorada con imágenes reales seleccionadas desde fuentes públicas y assets locales de respaldo.

## Estrategia visual

- Las portadas de discografía utilizan los JPG locales proporcionados.
- Las fotografías editoriales y de concierto reemplazan los placeholders genéricos.
- Cada `<img>` importante conserva un `onerror` que carga un SVG local desde `assets/images/`.
- Hero y fondos inmersivos mantienen también un respaldo local.
- Spotify, Apple Music, YouTube, WhatsApp, Google Fonts y Font Awesome permanecen como servicios externos.

## Estructura

- `index.html`
- `styles.css`
- `script.js`
- `README.md`
- `assets/images/`

Esta versión está lista para GitHub Pages.

## Actualización de portadas

Las nueve portadas proporcionadas están incluidas como JPG locales. Se agregaron Nueva Inglaterra (sencillo) y Canciones míseras (recopilatorio), con enlaces de búsqueda en Spotify. Se corrigieron los identificadores de las tarjetas y sus fondos reactivos.

La imagen del CD de Querido se muestra centrada debajo del banner. La línea del tiempo incluye Nueva Inglaterra (febrero de 2023) y Canciones míseras (enero de 2026). El botón permite escuchar Querido en Spotify.

## Mejoras de experiencia
Textos de lanzamiento actualizados; portadas WebP con dimensiones explícitas; tipos de lanzamiento en la línea del tiempo; ajustes móviles; acceso por teclado a la galería; movimiento reducido y pausa de carruseles cuando la pestaña está oculta. El enlace de Querido conserva la búsqueda de Spotify porque no se pudo verificar una URL directa del álbum.

## Corrección de visualización
Las nueve portadas y la imagen del CD están integradas en el HTML como JPEG. Se conservan archivos JPG para los fondos. Las portadas no dependen de carga diferida ni de la carpeta de imágenes para mostrarse.

## Video emergente
Arrópame abre el video oficial r6_kN_Q585M en un diálogo adaptable. Se cierra con Escape, el botón o un clic fuera, detiene el video y devuelve el foco. Se incluye enlace directo a YouTube como alternativa. Las tarjetas sin un video verificado conservan sus búsquedas.

La ventana de videos usa una capa compatible sin depender de dialog.showModal. La reproducción de YouTube desde un archivo local puede fallar por falta de identificación de origen; el enlace externo permanece disponible.

## Archivo secreto de Yisus
Activa la firma del pie de página tres veces seguidas (también funciona con Enter o Espacio) para mostrar foto y biografía. Se cierra con el botón, Escape o un clic fuera. La foto está integrada en el HTML.

## Arte de Querido
La segunda galería incluye las diez imágenes proporcionadas, en el orden de envío, integradas como JPEG. Se muestran completas y a color; conservan carrusel y ampliación.

La galería El arte de Querido contiene 14 imágenes: las diez iniciales y las cuatro adicionales, todas integradas y ampliables.

## Interpretación personal oculta
Tres toques o doble clic en El arte de Querido abren la imagen de Yisus como interpretación personal de fan. La imagen está integrada. Se cierra con Escape, el botón o un clic fuera.
