# Abrir el menú nativo para compartir la imagen del ranking

## Diagnóstico
- La app Android está hecha con Capacitor, y eso significa que funciona dentro de un WebView de Android. En ese WebView:
  - `navigator.share` con archivos no está disponible (`canShare({files})` devuelve false), así que el código pasa directo al "plan B", que es descargar.
  - La descarga usa un enlace `<a download>` con un blob. El WebView de Android ignora ese tipo de descarga y no lo pasa al sistema. Por eso sale el aviso "Imagen descargada" pero no se guarda ningún archivo.
- La imagen sí se genera bien (html-to-image funciona). Lo que falla es el paso de entregarla al sistema operativo.

## Solución (compatible con la arquitectura actual)
El menú nativo para compartir de Android (el selector con WhatsApp, Instagram, Gmail, etc.) solo se abre desde código nativo. Capacitor tiene complementos oficiales para hacerlo:

1. **@capacitor/filesystem**: guarda la imagen PNG en la caché de la app y devuelve una ruta `file://` que el sistema puede leer.
2. **@capacitor/share**: abre el selector nativo de Android con esa imagen y un texto.

Flujo nuevo de "Compartir como imagen":

```text
Capturar ranking (html-to-image, x2)
        |
   ¿App nativa? (Capacitor.isNativePlatform)
     | sí                                  | no (navegador)
 Blob -> base64                          navigator.share({files}) si existe
 Filesystem.writeFile(Cache)             si no -> descarga real (la de hoy)
 Share.share({ files:[uri], text })
     |
 Menú nativo de Android
```

- Si el usuario cancela el menú, no se muestra ningún error.
- El aviso "Imagen descargada" solo aparecerá cuando de verdad se haya descargado (en el navegador).
- En la app nativa, los archivos temporales viejos de la caché se borran antes de crear el nuevo.
- Se aplicará también a "Compartir como texto": en la app nativa usará `Share.share({ text })`, que es más fiable que el compartir web dentro del WebView.

## Lo que tendrás que hacer tú (una sola vez)
Esto agrega código nativo, así que en tu computador:
1. `git pull`
2. `npm install`
3. `npx cap sync android`
4. `npx cap run android` (o abrir el proyecto en Android Studio)

Sin `cap sync`, la app del teléfono no tendrá los complementos y seguirá fallando.

## Verificación
- En este entorno: compilación y typecheck. También una prueba con Playwright en el navegador móvil, para confirmar que la imagen se genera y que en la web se usa el camino correcto.
- Desde aquí no puedo abrir el menú nativo real: necesita un teléfono o emulador Android. Para que lo confirmes, dejaré mensajes claros en la consola y en los avisos (por ejemplo "complemento no instalado, ejecuta cap sync") y te daré una lista de 3 pasos para probarlo.

## Detalles técnicos
- `bun add @capacitor/share @capacitor/filesystem`
- `src/lib/nativeShare.ts`: `blobToBase64`, `shareImageNative(blob, text)` (que hace `Filesystem.writeFile({ path: 'scrabbro-<ts>.png', data, directory: Directory.Cache })` y luego `Share.share({ files: [uri], text, dialogTitle })`) y `shareTextNative(text)`. Los complementos se importan dinámicamente para no cargar más el bundle web.
- `ShareButton.tsx`: rama nativa antes de la web; `AbortError` y "Share canceled" se tratan como cancelación sin aviso.
- Nueva traducción `shareSheetTitle` en los 6 idiomas (título del selector).
- Test pequeño de `blobToBase64` junto a los tests existentes.
- La regla "compartir en nativo usa @capacitor/share + filesystem cache" se anotará en AGENTS.md.
