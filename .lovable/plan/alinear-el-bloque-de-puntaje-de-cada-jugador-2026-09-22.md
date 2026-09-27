# Alinear el bloque de puntaje de cada jugador

## Qué se ve mal hoy

En la zona derecha de cada tarjeta de jugador:
- El número del puntaje queda pegado a la derecha, sin centrarse respecto a la palabra "puntos".
- El reloj de arena (temporizador propio) se monta encima del lápiz de editar.
- Entre jugadores el bloque no queda alineado verticalmente, porque su ancho cambia según la cantidad de dígitos.

## Qué se va a hacer

1. Centrar el número y la palabra "puntos" uno sobre otro, como una columna ordenada.
2. Fijar un ancho estable para esa columna (igual para 1 dígito o para 4), de modo que todos los jugadores queden alineados verticalmente.
3. Separar el reloj de arena del lápiz: se mantiene como indicador discreto junto al botón, sin superponerse al icono ni recortarse.
4. Centrar verticalmente todo el conjunto (puntaje, lápiz, reloj) dentro de la tarjeta, con un espacio parejo entre elementos.

No cambia ningún tamaño de tarjeta, color, ni el comportamiento de editar o del temporizador.

## Detalle técnico

En `src/components/Leaderboard.tsx`, contenedor de las líneas 373-393:
- Reemplazar `text-right` por un contenedor `flex items-center justify-end gap-2 shrink-0`.
- La columna del puntaje pasa a `flex flex-col items-center justify-center w-[64px]` (ancho fijo en lugar de `min-w-[60px]`), manteniendo la reducción condicional de fuente para `score > 999`.
- El `Hourglass` deja de estar en `absolute -top-1 -right-1` dentro del botón: se mueve a un elemento hermano del `Button` (o a un ancla con offset menor y `pointer-events-none`), para que no se solape con el `Pencil` ni se corte en el borde de la tarjeta.
- Se conserva `overflow-hidden` de la `Card` verificando que el indicador quede dentro del área visible.

## Verificación

- Compilación sin errores.
- Revisión visual en móvil (394x595) con puntajes de 1 y 4 dígitos y con un jugador con temporizador propio, confirmando alineación vertical entre todas las tarjetas.
