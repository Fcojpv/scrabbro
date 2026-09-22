# Diferencia con el líder siempre en una sola línea

## Problema

En la tarjeta de cada jugador, el texto "-224 del líder" se corta y salta a una segunda línea cuando no hay espacio. Pasa más en móvil y empeora en idiomas con palabras largas: español ("del líder", "Empate con líder"), portugués ("Empatado com o líder"), hindi ("लीडर के साथ बराबरी") y chino ("落后领先者").

## Solución propuesta

1. Reemplazar la palabra "líder" por "#1" en los seis idiomas. El texto pasa a ser muy corto y cabe siempre en una línea:
   - Diferencia: "-224 vs #1"
   - Empate: "Empate con #1"
   Además queda coherente con el "#3" que ya se muestra a la izquierda de cada jugador.
2. Forzar que esa línea no se parta nunca (sin puntos suspensivos: con el texto corto ya no hay recorte).
3. Dar al bloque de nombre e información un ancho flexible real, para que ceda espacio de forma ordenada en vez de empujar el texto hacia abajo.

Las proporciones del resto de los elementos del jugador quedan intactas: el puesto, el nombre, la columna de puntaje con su ancho fijo, el lápiz y el reloj de arena no se mueven.

## Textos por idioma

| Idioma | Diferencia | Empate |
|---|---|---|
| Inglés | vs #1 | Tied with #1 |
| Español | vs #1 | Empate con #1 |
| Chino | 落后 #1 | 与 #1 并列 |
| Hindi | #1 से | #1 के बराबर |
| Árabe | مقابل #1 | تعادل مع #1 |
| Portugués | vs #1 | Empate com #1 |

## Detalle técnico

- `src/i18n/translations.ts`: actualizar `fromLeader` y `tiedWithLeader` en los seis idiomas con los valores de la tabla.
- `src/components/Leaderboard.tsx`, filas 333-371:
  - Contenedor izquierdo: añadir `min-w-0 flex-1`; el bloque de nombre/diferencia recibe `min-w-0`.
  - Línea de diferencia y mensaje de empate: `whitespace-nowrap`; el icono `TrendingUp` lleva `shrink-0`.
  - El bloque derecho ya es `shrink-0`, así que no cede ni crece.

## Verificación

- Compilación sin errores.
- Revisión visual en móvil (394 px) con puntajes de 3-4 dígitos y nombres largos, en los seis idiomas, confirmando una sola línea en todos los casos.
