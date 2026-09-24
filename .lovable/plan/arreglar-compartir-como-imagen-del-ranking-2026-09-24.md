# Arreglar "Compartir como imagen" del ranking

## Qué encontré
- Tu error sí quedó registrado: "Error parsing CSS component value, multiple values found when expecting only one".
- Causa: al capturar, la app le pasa como color de fondo el valor del tema tal cual (ej. `40 30% 96%`), que no es un color válido. La librería de captura actual (html2canvas) no lo entiende y se cae antes de generar la imagen.
- Además, html2canvas es antigua (sin mejoras desde 2022) y falla con estilos modernos (desenfoques, algunos colores, emojis), así que aunque se corrija el fondo seguiría siendo frágil.
- Los textos del diálogo de compartir están fijos en español y no se traducen.

## Qué propongo
1. Reemplazar html2canvas por **html-to-image**: más ligera y fiel al diseño real (usa el propio navegador para dibujar), respeta modo claro/oscuro y emojis.
2. Calcular el color de fondo real del tema (convertirlo a un color válido) para que la imagen no salga transparente ni rompa.
3. Generar una imagen "tarjeta para redes": el ranking con un pequeño encabezado "ScrabBro", ronda y fecha, margen cómodo y buena resolución (x2) — se ve bien en WhatsApp, Instagram, etc.
4. Flujo de compartir en este orden:
   - Compartir nativo con imagen (móvil moderno).
   - Si no se puede: descargar la imagen y avisar.
   - Mensajes de error claros si algo falla.
5. Traducir los textos del diálogo de compartir a los 6 idiomas.
6. Dejar preparado para la app Android: en Capacitor el compartir web con archivos no funciona siempre; cuando hagamos la fase de Play Store usaremos el complemento nativo de compartir con la misma imagen.

## Verificación
- Probar la captura en el navegador de prueba (móvil 390x844) en claro y oscuro y revisar la imagen generada.

## Detalles técnicos
- `bun remove html2canvas && bun add html-to-image`; usar `toBlob(el, { pixelRatio: 2, backgroundColor, filter })`, excluyendo botones (lápiz/compartir) vía `data-capture-ignore`.
- Fondo: `hsl(${getComputedStyle(root).getPropertyValue('--background').trim()})`.
- Archivos: `src/components/ShareButton.tsx`, `src/i18n/translations.ts`, ajuste menor de atributos en `Leaderboard.tsx`.
