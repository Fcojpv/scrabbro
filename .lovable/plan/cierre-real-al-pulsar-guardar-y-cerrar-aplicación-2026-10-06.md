# Cierre real al pulsar "Guardar y Cerrar Aplicación"

## Qué pasa hoy
- En la **app Android** el botón ya cierra la aplicación de verdad.
- En el **navegador del teléfono**, la app guarda la partida pero no puede cerrarse. Por seguridad, Chrome y Safari no dejan que una página cierre una pestaña que abrió la persona. Por eso aparece "Ya puedes cerrar esta ventana".

## Qué cambia
1. Tras confirmar, la partida se guarda de inmediato. Esto no cambia.
2. **Android (Play Store):** la app se cierra al momento, sin mostrar ningún aviso.
3. **Navegador o app instalada desde el navegador:**
   - Primero se intenta cerrar la ventana. Funciona cuando el navegador lo permite, por ejemplo en algunas apps instaladas desde la pantalla de inicio o en ventanas abiertas desde otra.
   - Si el navegador lo impide, aparece una **pantalla de despedida** a pantalla completa en lugar del aviso pequeño. Muestra el logo de ScrabBro, el mensaje "Partida guardada" y el botón **"Volver a la partida"**. Los temporizadores y la radio quedan detenidos, así que la app queda "apagada" y se puede salir con el botón de inicio del teléfono.
4. Si el guardado falla, la app no se cierra y muestra un aviso, igual que ahora.

## Idiomas
Los textos nuevos de la pantalla de despedida estarán en los 6 idiomas, incluido el árabe escrito de derecha a izquierda.

## Detalles técnicos
- En `handleCloseApp` (Index.tsx): si `Capacitor.isNativePlatform()`, se llama a `App.exitApp()` sin toast. Si no, se llama a `window.close()` y, después de unos 300 ms, si `window.closed` es false, se activa el estado `appClosed`.
- Nuevo componente `ClosedScreen` (overlay fijo con colores del tema) que, al pulsar "Volver a la partida", restaura la vista y reanuda la partida.
- Nuevas claves en translations.ts: `closedTitle`, `closedDescription`, `backToGame`.
- Se verifica con Playwright en móvil: confirmar, ver la pantalla de despedida y volver a la partida.
