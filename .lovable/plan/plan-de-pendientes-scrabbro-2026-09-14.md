# Plan de Pendientes - ScrabBro

Este plan consolida los desarrollos pendientes identificados en el proyecto, priorizados por impacto en la experiencia de usuario y estabilidad.

## Fase 1: Corrección de bugs críticos e importantes

Objetivo: eliminar errores que afectan datos, rendimiento o estabilidad antes de cualquier nueva funcionalidad.

1. **Duplicación de scores en historial (BUG #1)**
   - Archivo: `src/pages/Index.tsx`, línea 199.
   - Problema: al completarse una ronda se concatena `currentRoundScores` con el score actual, aunque este ya fue agregado previamente.
   - Solución: guardar directamente `currentRoundScores` en `scoreHistory`, sin concatenar de nuevo.

2. **Dependencia circular en `useGameTimer` (BUG #2)**
   - Archivo: `src/hooks/useGameTimer.ts`, línea 37.
   - Problema: `isFinished` está en las dependencias del `useEffect` y se modifica dentro del mismo efecto.
   - Solución: usar una `ref` para rastrear si ya se marcó `finished`, o separar la lógica de finalización.

3. **Memory leaks por `setTimeout` sin cleanup (BUG #3)**
   - Archivo: `src/pages/Index.tsx`, líneas 69, 160 y 246.
   - Problema: timeouts no se limpian si el componente se desmonta.
   - Solución: guardar referencias de timeouts y limpiarlas en el cleanup del `useEffect`.

4. **Re-renders innecesarios por dependencias inestables (BUG #5)**
   - Archivo: `src/pages/Index.tsx`, líneas 76-87.
   - Problema: `players`, `scoreHistory` y `currentRoundScores` se pasan como dependencias y se recrean en cada render.
   - Solución: estabilizar las referencias con `useMemo`/`useCallback`, o serializar/comparar antes de guardar.

5. **Memory leak en celebración del Leaderboard (BUG #6)**
   - Archivo: `src/components/Leaderboard.tsx`, línea 136.
   - Problema: `setTimeout` de 5 segundos para limpiar emojis no se limpia al desmontar.
   - Solución: guardar el timeout en una `ref` y limpiarlo en el cleanup del `useEffect`.

6. **Acceso fuera de rango a `players[currentTurn]` (BUG #8)**
   - Archivo: `src/pages/Index.tsx`, línea 172.
   - Problema: acceso directo sin verificar que el índice sea válido.
   - Solución: agregar validación u optional chaining antes de usar `players[currentTurn]`.

## Fase 2: Integración de la vista de cómic Story

Objetivo: ofrecer una tercera vista con la historia de ScrabBro, accesible desde el swipe móvil y como ruta independiente.

1. **Crear página `/story`**
   - Archivo nuevo: `src/pages/Story.tsx`.
   - Contenido: historia vertical estilo cómic con paneles estilo Ghibli, narrando el viaje de la familia al campo y el origen de ScrabBro.

2. **Crear componente reutilizable `StoryContent`**
   - Archivo nuevo: `src/components/StoryContent.tsx`.
   - Uso: tanto en la ruta `/story` como en la tercera vista del swipe móvil.

3. **Integrar como tercera vista swipeable en móvil**
   - Archivo: `src/pages/Index.tsx`.
   - Cambio: agregar slide 2 con `StoryContent`, actualizar indicadores de puntos a `[0, 1, 2]` y ajustar chevrons.

4. **Agregar ruta en `App.tsx`**
   - Archivo: `src/App.tsx`.
   - Cambio: agregar `<Route path="/story" element={<Story />} />`.

5. **Generar imágenes estilo Ghibli**
   - Crear assets en `src/assets/story/` con escenas: ciudad, viaje, casa campo, desarrollo de app, compartiendo en App Store, agradecimiento.

6. **Traducir contenido del cómic**
   - Archivo: `src/i18n/translations.ts`.
   - Añadir claves `story.*` para cada idioma soportado.

## Fase 3: Preparación para publicación en Play Store

Objetivo: dejar el proyecto listo para compilar como app Android con Capacitor y cumplir requisitos de Google Play.

1. **Configurar Capacitor (entorno local del usuario)**
   - Agregar `@capacitor/core`, `@capacitor/android`, `@capacitor/cli`.
   - Crear `capacitor.config.ts` con `appId` y `webDir: 'dist'`.
   - Documentar comandos: `npm run build`, `npx cap add android`, `npx cap open android`.

2. **Crear assets de la app**
   - Icono adaptativo (`icon.png`, `icon-foreground.png`, `icon-background.png`).
   - Splash screen (`splash.png`) en los tamaños requeridos por Android.
   - Ubicación: `resources/` o `assets/` según convención de Capacitor.

3. **Crear política de privacidad**
   - Archivo: `public/privacy-policy.html` o ruta `/privacy`.
   - Debe declarar qué datos se recopilan (nombres, scores locales, sin backend externo).

4. **Añadir metadatos de la app**
   - Título, descripción corta, descripción larga, capturas de pantalla para Play Store.
   - Archivo: `play-store-assets/metadata.md`.

5. **Verificar requisitos técnicos de Play Store**
   - Target SDK actualizado.
   - App signed.
   - Sin funciones que requieran permisos innecesarios.

## Fase 4: Bugs menores y mejoras de calidad

Objetivo: limpiar deuda técnica sin afectar funcionalidad principal.

1. **Lógica `undefined` vs `null` en `useTurnTimer` (BUG #7)**
   - Archivo: `src/hooks/useTurnTimer.ts`, línea 15.
   - Solución: usar `customTimerMinutes ?? configuredMinutes` para claridad.

2. **Cleanup del ciclo de animación del corazón (BUG #9)**
   - Archivo: `src/pages/Index.tsx`, líneas 89-111.
   - Solución: refactorizar con `refs` para limpiar todos los timeouts anidados.

3. **Cleanup del timeout en `RestoreGameDialog` (BUG #10)**
   - Archivo: `src/components/RestoreGameDialog.tsx`, línea 54.
   - Solución: guardar timeout en `ref` y limpiar en cleanup.

4. **Corrección de visualización en preview de Lovable**
   - Archivo: `src/pages/Index.tsx`, línea 291.
   - Problema: `h-[100dvh]` puede no funcionar correctamente dentro del iframe de preview.
   - Solución: probar `h-screen`, `min-h-screen` o fallback CSS para iframes.

## Fase 5: Mejoras opcionales de experiencia

1. **Añadir hint visual de swipe** en la primera vista para nuevos usuarios.
2. **Vibración táctil (haptic feedback)** al cambiar de vista o al completar una ronda.
3. **Fila de totales en ScoreHistory** con suma acumulada por jugador.
4. **Mejorar visibilidad de chevrons e indicadores de puntos** con mayor contraste.

## Orden recomendado de ejecución

Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5

La Fase 1 es obligatoria antes de continuar, ya que corrige bugs que afectan la integridad de los datos y la estabilidad de la app.
