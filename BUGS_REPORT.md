# 📋 Informe de Bugs - Scrabble Score App

## Resumen Ejecutivo

Se encontraron **10 bugs** en el proyecto, clasificados por severidad:
- 🔴 **Críticos**: 2 bugs (afectan funcionalidad core)
- 🟡 **Importantes**: 4 bugs (afectan UX o pueden causar problemas)
- 🟢 **Menores**: 4 bugs (mejoras de calidad de código)

---

## 🔴 BUGS CRÍTICOS

### BUG #1: Duplicación de Score en Historial de Rondas
**Archivo**: `src/pages/Index.tsx`  
**Línea**: 199  
**Severidad**: 🔴 Crítico  
**Nivel de Daño**: Alto - Los scores se duplican en el historial, causando datos incorrectos

**Descripción**:
En `handleSubmitScore`, cuando se completa una ronda (nextTurn === 0), el score del jugador actual se agrega dos veces al historial:
1. Primero se agrega a `currentRoundScores` (línea 183-186)
2. Luego se concatena `currentRoundScores` con el mismo score nuevamente (línea 199)

**Código Problemático**:
```typescript
// Línea 183-186: Se agrega el score a currentRoundScores
setCurrentRoundScores(prev => [
  ...prev,
  { playerId: currentPlayerId, score, wasBingo }
]);

// Línea 197-199: Se duplica al guardar en historial
if (nextTurn === 0) {
  setScoreHistory(prev => [...prev, currentRoundScores.concat([{ playerId: currentPlayerId, score, wasBingo }])]);
  // ↑ Aquí se concatena currentRoundScores (que ya tiene el score) con el mismo score otra vez
}
```

**Impacto**:
- Los scores en el historial son incorrectos
- La suma total de puntos por ronda no coincide con la realidad
- Afecta la integridad de los datos del juego

**Plan de Reparación**:
1. Remover la concatenación duplicada en línea 199
2. Usar directamente `currentRoundScores` que ya contiene el score actual
3. Verificar que el historial muestre los scores correctos

**¿Vale la pena corregirlo?**: ✅ **SÍ** - Es crítico para la integridad de los datos

---

### BUG #2: Dependencia Circular en useGameTimer
**Archivo**: `src/hooks/useGameTimer.ts`  
**Línea**: 37  
**Severidad**: 🔴 Crítico  
**Nivel de Daño**: Medio-Alto - Puede causar re-renders infinitos o comportamiento impredecible

**Descripción**:
El `useEffect` en `useGameTimer` tiene `isFinished` como dependencia, pero `isFinished` se establece dentro del mismo efecto. Esto puede causar:
- Re-renders innecesarios
- Comportamiento impredecible del timer
- Posibles loops infinitos en ciertos escenarios

**Código Problemático**:
```typescript
useEffect(() => {
  // ...
  const interval = setInterval(() => {
    if (startTimeRef.current) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
      
      if (countdownMinutes !== null) {
        const totalSeconds = countdownMinutes * 60;
        if (elapsed >= totalSeconds && !isFinished) {
          setIsFinished(true); // ← Se modifica isFinished aquí
        }
      }
    }
  }, 1000);

  return () => clearInterval(interval);
}, [isActive, countdownMinutes, isFinished]); // ← isFinished como dependencia causa el problema
```

**Impacto**:
- El efecto se re-ejecuta cada vez que `isFinished` cambia
- Puede causar que el intervalo se recree innecesariamente
- Comportamiento impredecible del countdown

**Plan de Reparación**:
1. Remover `isFinished` de las dependencias del useEffect
2. Usar una ref para rastrear si ya se marcó como finished
3. O mover la lógica de `isFinished` a un useEffect separado

**¿Vale la pena corregirlo?**: ✅ **SÍ** - Afecta la estabilidad del timer

---

## 🟡 BUGS IMPORTANTES

### BUG #3: Memory Leak - setTimeout sin Cleanup
**Archivo**: `src/pages/Index.tsx`  
**Líneas**: 69, 160, 246  
**Severidad**: 🟡 Importante  
**Nivel de Daño**: Medio - Memory leaks que pueden acumularse con el tiempo

**Descripción**:
Hay múltiples `setTimeout` que no se limpian si el componente se desmonta antes de que se ejecuten:
- Línea 69: setTimeout para mostrar RestoreGameDialog
- Línea 160: setTimeout para mostrar toast después de restaurar
- Línea 246: setTimeout para mostrar EndGameDialog

**Código Problemático**:
```typescript
// Línea 69
setTimeout(() => {
  setShowRestoreDialog(true);
}, 100);

// Línea 160
setTimeout(() => {
  toast.success(t.gameRestored, { duration: 3000 });
}, 100);

// Línea 246
setTimeout(() => {
  setShowEndGameDialog(true);
}, 100);
```

**Impacto**:
- Memory leaks si el componente se desmonta
- Posibles actualizaciones de estado en componentes desmontados
- Warnings de React en desarrollo

**Plan de Reparación**:
1. Guardar los timeouts en refs
2. Limpiarlos en el cleanup del useEffect
3. Verificar que el componente esté montado antes de actualizar estado

**¿Vale la pena corregirlo?**: ✅ **SÍ** - Mejora la calidad del código y previene memory leaks

---

### BUG #4: Lógica Confusa de Penalizaciones
**Archivo**: `src/components/EndGameDialog.tsx` + `src/pages/Index.tsx`  
**Líneas**: EndGameDialog.tsx:46, Index.tsx:251-256  
**Severidad**: 🟡 Importante  
**Nivel de Daño**: Medio - UX confusa para el usuario

**Descripción**:
En `EndGameDialog`, las penalizaciones siempre se convierten a valores positivos (línea 46: `Math.abs(penalty)`), pero luego en `Index.tsx` se restan del score (línea 255: `score: p.score - penalties[p.id]`). Esto es confuso porque:
- Si el usuario ingresa un número negativo, se convierte a positivo y luego se resta (doble negación = suma)
- Si el usuario ingresa un número positivo, se mantiene positivo y se resta (correcto)

**Código Problemático**:
```typescript
// EndGameDialog.tsx línea 46
finalPenalties[player.id] = Math.abs(penalty); // Siempre positivo

// Index.tsx línea 255
score: p.score - penalties[p.id] // Se resta
```

**Impacto**:
- UX confusa: el usuario no sabe si debe ingresar valores positivos o negativos
- Comportamiento inconsistente si se ingresa un negativo

**Plan de Reparación**:
1. Clarificar la lógica: aceptar solo valores positivos y restarlos
2. O aceptar valores negativos directamente y sumarlos
3. Mejorar la documentación/UI para que sea claro
4. Agregar validación para prevenir valores negativos si se decide la opción 1

**¿Vale la pena corregirlo?**: ✅ **SÍ** - Mejora la UX y claridad del código

---

### BUG #5: useEffect con Dependencias que Causan Re-renders Innecesarios
**Archivo**: `src/pages/Index.tsx`  
**Línea**: 76-87  
**Severidad**: 🟡 Importante  
**Nivel de Daño**: Medio - Performance, re-renders innecesarios

**Descripción**:
El `useEffect` que auto-guarda el estado del juego tiene dependencias que incluyen objetos y arrays (`players`, `scoreHistory`, `currentRoundScores`). Estos se recrean en cada render, causando que el efecto se ejecute constantemente, incluso cuando no hay cambios reales.

**Código Problemático**:
```typescript
useEffect(() => {
  if (gameStarted) {
    saveGameState({
      gameStarted,
      players,        // ← Objeto que se recrea en cada render
      currentTurn,
      roundNumber,
      scoreHistory,  // ← Array que se recrea en cada render
      currentRoundScores, // ← Array que se recrea en cada render
    });
  }
}, [gameStarted, players, currentTurn, roundNumber, scoreHistory, currentRoundScores]);
```

**Impacto**:
- Re-renders innecesarios
- Escrituras excesivas a localStorage (aunque hay debounce)
- Posible impacto en performance

**Plan de Reparación**:
1. Usar `useMemo` o `useCallback` para estabilizar las referencias
2. O usar una comparación profunda con `useRef` para detectar cambios reales
3. O serializar las dependencias a strings para comparación

**¿Vale la pena corregirlo?**: ✅ **SÍ** - Mejora el performance, especialmente en juegos largos

---

### BUG #6: setTimeout sin Cleanup en Leaderboard
**Archivo**: `src/components/Leaderboard.tsx`  
**Línea**: 87  
**Severidad**: 🟡 Importante  
**Nivel de Daño**: Medio - Memory leak potencial

**Descripción**:
El `setTimeout` que limpia los emojis de celebración (línea 87) no se limpia si el componente se desmonta antes de que se ejecute.

**Código Problemático**:
```typescript
setTimeout(() => {
  setCelebratingPlayers(new Set());
  setPlayerEmojis(new Map());
}, 5000);
```

**Impacto**:
- Memory leak si el componente se desmonta
- Posible actualización de estado en componente desmontado

**Plan de Reparación**:
1. Guardar el timeout en un ref
2. Limpiarlo en el cleanup del useEffect
3. Verificar que el componente esté montado antes de actualizar estado

**¿Vale la pena corregirlo?**: ✅ **SÍ** - Previene memory leaks

---

## 🟢 BUGS MENORES

### BUG #7: Lógica de undefined vs null en useTurnTimer
**Archivo**: `src/hooks/useTurnTimer.ts`  
**Línea**: 15  
**Severidad**: 🟢 Menor  
**Nivel de Daño**: Bajo - Puede causar comportamiento inesperado en edge cases

**Descripción**:
La lógica de prioridad de minutos usa `customTimerMinutes !== undefined`, pero luego compara con `null`. Esto puede causar confusión si `customTimerMinutes` es explícitamente `undefined` vs cuando no existe.

**Código Problemático**:
```typescript
const minutesToUse = customTimerMinutes !== undefined ? customTimerMinutes : configuredMinutes;
if (minutesToUse !== null && minutesToUse > 0) {
  // ...
}
```

**Impacto**:
- Comportamiento potencialmente confuso si `customTimerMinutes` es `undefined` explícitamente
- Mejor claridad del código

**Plan de Reparación**:
1. Clarificar la lógica: usar `customTimerMinutes ?? configuredMinutes`
2. O normalizar a `null` cuando no hay valor
3. Agregar comentarios para claridad

**¿Vale la pena corregirlo?**: ⚠️ **OPCIONAL** - Mejora la claridad pero no es crítico

---

### BUG #8: Posible Acceso Fuera de Rango en players[currentTurn]
**Archivo**: `src/pages/Index.tsx`  
**Línea**: 60, 172  
**Severidad**: 🟢 Menor  
**Nivel de Daño**: Bajo - Puede causar error si hay un desajuste de estado

**Descripción**:
Se accede a `players[currentTurn]` sin verificar que el índice sea válido. Aunque en condiciones normales esto no debería pasar, si hay un desajuste de estado podría causar un error.

**Código Problemático**:
```typescript
// Línea 60
const turnTimer = useTurnTimer(currentTurn, gameStarted, players[currentTurn]?.customTimerMinutes);

// Línea 172
const currentPlayerId = players[currentTurn].id; // ← Sin optional chaining
```

**Impacto**:
- Posible error si `currentTurn` está fuera de rango
- Crash de la aplicación en edge cases

**Plan de Reparación**:
1. Agregar validación antes de acceder
2. Usar optional chaining donde sea necesario
3. Agregar guards para prevenir estados inválidos

**¿Vale la pena corregirlo?**: ✅ **SÍ** - Previene crashes, aunque sea poco probable

---

### BUG #9: Cleanup Problemático en Heart Animation Cycle
**Archivo**: `src/pages/Index.tsx`  
**Líneas**: 89-111  
**Severidad**: 🟢 Menor  
**Nivel de Daño**: Bajo - Memory leak menor

**Descripción**:
El ciclo de animación del corazón tiene un cleanup que retorna una función, pero la función `cycle()` también retorna un cleanup. La estructura puede ser confusa y el cleanup puede no ejecutarse correctamente.

**Código Problemático**:
```typescript
const cycle = () => {
  setIsHeartFilled(false);
  
  const fillTimeout = setTimeout(() => {
    setIsHeartFilled(true);
    
    const emptyTimeout = setTimeout(() => {
      cycle(); // Restart cycle
    }, 5000);
    
    return () => clearTimeout(emptyTimeout); // ← Este return no se ejecuta
  }, 60000);
  
  return () => clearTimeout(fillTimeout); // ← Este sí se ejecuta
};

const cleanup = cycle();
return cleanup;
```

**Impacto**:
- El cleanup del `emptyTimeout` nunca se ejecuta
- Memory leak menor

**Plan de Reparación**:
1. Refactorizar para usar refs y limpiar todos los timeouts correctamente
2. O usar un enfoque más simple con useEffect anidados

**¿Vale la pena corregirlo?**: ⚠️ **OPCIONAL** - Memory leak menor, pero mejora la calidad

---

### BUG #10: setTimeout sin Cleanup en RestoreGameDialog
**Archivo**: `src/components/RestoreGameDialog.tsx`  
**Línea**: 54  
**Severidad**: 🟢 Menor  
**Nivel de Daño**: Bajo - Memory leak menor

**Descripción**:
El `setTimeout` en `handleRestore` no se limpia si el componente se desmonta antes de que se ejecute.

**Código Problemático**:
```typescript
const handleRestore = () => {
  onOpenChange(false);
  setTimeout(() => {
    onRestore();
  }, 50);
};
```

**Impacto**:
- Memory leak menor
- Posible ejecución de callback en componente desmontado

**Plan de Reparación**:
1. Guardar timeout en ref
2. Limpiar en cleanup del componente
3. O usar un flag para verificar que el componente esté montado

**¿Vale la pena corregirlo?**: ⚠️ **OPCIONAL** - Similar a otros bugs de setTimeout

---

## 📊 Resumen de Prioridades

### Debe Corregirse (Críticos + Importantes):
1. ✅ BUG #1: Duplicación de Score (Crítico)
2. ✅ BUG #2: Dependencia Circular useGameTimer (Crítico)
3. ✅ BUG #3: Memory Leaks setTimeout (Importante)
4. ✅ BUG #4: Lógica Penalizaciones (Importante)
5. ✅ BUG #5: Re-renders Innecesarios (Importante)
6. ✅ BUG #6: setTimeout Leaderboard (Importante)
7. ✅ BUG #8: Acceso Fuera de Rango (Menor pero importante para estabilidad)

### Opcional (Mejoras de Calidad):
- BUG #7: Lógica undefined/null
- BUG #9: Heart Animation Cleanup
- BUG #10: setTimeout RestoreGameDialog

---

## 🎯 Recomendación Final

**Total de Bugs**: 10  
**Críticos**: 2 (deben corregirse)  
**Importantes**: 4 (deben corregirse)  
**Menores**: 4 (2 recomendados, 2 opcionales)

**Recomendación**: Corregir los **6 bugs críticos e importantes** primero, ya que afectan la funcionalidad core y la estabilidad de la aplicación. Los bugs menores pueden corregirse después como mejoras de calidad.


