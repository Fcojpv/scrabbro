# Finalizar partida: bandera, textos, sorpresa y celebración

## Qué verá el usuario

1. **Nueva ubicación**: una bandera a cuadros en la barra superior, justo a la izquierda de Reiniciar, con el mismo estilo de los demás iconos (sin color rojo). Se quita el botón provisional de la tarjeta de turno.
2. **Textos más naturales** en los 6 idiomas:
   - Español: "Finalizar partida"
   - English: "End match"
   - Português: "Encerrar partida"
   - 中文: "结束对局"
   - हिन्दी: "खेल समाप्त करें"
   - العربية: "إنهاء المباراة"
   Se ajustan también el título y la pregunta de confirmación.
3. **Sorpresa de los jugadores**: al pulsar la bandera todos muestran el emoji de sorpresa.
   - Si se cancela, la sorpresa se mantiene **30 segundos** y luego vuelve a la normalidad (ya no queda pegada).
   - Si se continúa a penalizaciones, se retira al aplicar el resultado.
4. **Cronómetros**: al abrir la confirmación se pausan el reloj de turno y el de partida; si se cancela, siguen desde donde estaban; si se confirma, se detienen.
5. **Celebración final**: al aplicar las penalizaciones, lluvia de confeti para el primer lugar y se abre automáticamente la ventana de resultado (la misma de "Compartir como imagen") para invitar a compartir el podio.
6. **Penalizaciones**: se mantienen igual (un número por jugador).

## Detalles técnicos

- `Index.tsx`: botón `Flag` (lucide) antes de `RotateCcw` en ambas barras (móvil y escritorio), `aria-label` y tooltip traducidos; quitar `onEndGame` de `TurnInput`.
- `TurnInput.tsx`: eliminar el botón provisional y la prop `onEndGame`.
- `handleEndGame`: activar sorpresa y pausa (`isPaused` en ambos timers vía estado `endGamePending`); al cancelar programar `surpriseTimeoutRef` de 30 000 ms que pone `showSurpriseEmojis=false`; limpiar el timeout al reabrir, al aplicar y al desmontar.
- `EndGameDialog`: exponer `onCancel` separado de la confirmación.
- `handleApplyPenalties`: detener timers, confeti (canvas-confetti), y abrir el flujo de compartir imagen existente (exponer apertura programática desde `ShareButton` o reutilizar `ShareImageDialog` con la captura de `ResultCard`).
- `translations.ts`: actualizar `finishedGame`, `endGameConfirmation`, `endGameQuestion` y añadir `endMatchLabel` en los 6 idiomas.
- Test pequeño para la duración de 30 s de la sorpresa (constante exportada).
- Verificación en Playwright móvil 394×639: cancelar → emoji desaparece tras 30 s y relojes reanudan; confirmar → confeti y ventana de resultado.
