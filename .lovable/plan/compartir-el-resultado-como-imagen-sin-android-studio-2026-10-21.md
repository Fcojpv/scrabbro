# Compartir el resultado como imagen (sin Android Studio)

## Idea
Usar el menú para compartir que ya trae Chrome en Android y Safari en iPhone. Es el mismo menú del teléfono, con WhatsApp, Instagram, Gmail, etc. Además, ScrabBro se podrá instalar en la pantalla de inicio desde el navegador. No hace falta Android Studio ni ningún comando.

## Qué verá el usuario
1. Pulsa Compartir y luego "Como imagen".
2. Se abre una **vista previa** con una tarjeta bonita del resultado:
   - encabezado "ScrabBro", número de ronda y fecha;
   - las posiciones con sus medallas y puntajes;
   - un pie corto con el enlace de ScrabBro.
3. Debajo de la vista previa aparecen tres botones:
   - **Compartir imagen**: abre el menú del teléfono con la imagen ya adjunta.
   - **Guardar imagen**: descarga la imagen de verdad. El aviso "Imagen guardada" solo aparece cuando la descarga se hizo realmente.
   - **Cerrar**.
4. Si el teléfono no puede abrir el menú, la vista previa sigue abierta y aparece el mensaje "Mantén presionada la imagen para guardarla o compartirla". Esto funciona en cualquier teléfono.
5. Si el usuario cancela el menú, no sale ningún error.

Se acaba el aviso falso de "descargada".

## App instalable desde el navegador
- Se agregan el icono de ScrabBro, un nombre, los colores del tema y el modo pantalla completa. Así, la opción "Añadir a pantalla de inicio" la abre como una app.
- No se agrega modo sin conexión, para evitar problemas de versiones viejas guardadas.

## Aviso honesto sobre tu app Android actual
La app Android que ya tienes (hecha con Capacitor) muestra ScrabBro dentro de una ventana interna de Android. Esa ventana no deja abrir el menú del teléfono. Ahí la imagen se verá en la vista previa y el usuario podrá **mantenerla presionada** para guardarla o compartirla. El menú completo funcionará en Chrome, Safari y en la versión instalada desde el navegador.

## Textos
Todos los textos nuevos irán en los 6 idiomas, con soporte de derecha a izquierda para árabe.

## Verificación
- Pruebas en un móvil simulado (390x844), en modo claro y oscuro: la tarjeta se ve bien, el botón Compartir entrega la imagen al menú del teléfono, la descarga es real y el mensaje de respaldo aparece cuando corresponde.
- Al final, solo tendrás que probarlo una vez desde Chrome en tu teléfono.

## Detalles técnicos
- Nuevo `ShareImageDialog.tsx`: muestra la imagen con un `<img src={objectURL}>` y genera el `File` una sola vez. Llama a `navigator.share({files})` directamente desde el clic del botón, para conservar el gesto del usuario (si se hace después de un `await` de la captura, Chrome lo rechaza). Usa `canShare` y, si no funciona, muestra la indicación de mantener presionada la imagen.
- La tarjeta se captura desde un nodo oculto que se renderiza fuera de la pantalla, con `html-to-image` `toBlob` y pixelRatio 2. El fondo se calcula desde el tema.
- La descarga solo se marca como exitosa fuera de un WebView. Se detecta con `Capacitor.isNativePlatform()` o con el user agent `; wv`.
- Archivos: `public/manifest.webmanifest`, iconos 192/512 generados, etiquetas en `index.html` (manifest, apple-touch-icon y título/descr. actualizados). No se usará service worker ni vite-plugin-pwa.
- `ShareButton.tsx` abre el nuevo diálogo. Se agregan claves nuevas en `translations.ts`.
- Se anotará la regla en AGENTS.md: compartir imagen = Web Share con gesto directo y respaldo de mantener presionado.
