# Diferencia con el líder siempre en una sola línea

## Problema

En la tarjeta de cada jugador, el texto "-224 del líder" se corta y salta a una segunda línea cuando no hay espacio. Pasa más en móvil y empeora en idiomas con palabras largas: español ("del líder", "Empate con líder"), portugués ("Empatado com o líder"), hindi ("लीडर के साथ बराबरी") y chino ("落后领先者").

## Solución propuesta

1. Forzar que esa línea nunca se parta: el texto se mantiene en una sola línea y, si de verdad no cabe, se recorta con "..." en lugar de bajar a otra línea.
2. Dar al bloque de nombre e información un ancho flexible real, para que ceda espacio de forma ordenada en vez de empujar el texto hacia abajo.
3. Reducir levemente el tamaño del texto de la diferencia en pantallas angostas (se mantiene igual en pantallas más anchas), sin tocar el nombre, el puesto, el puntaje, el lápiz ni el reloj de arena.
4. Aplicar el mismo tratamiento al mensaje de empate, que es el texto más largo en varios idiomas.

Las proporciones del resto de los elementos del jugador quedan intactas: la columna de puntaje conserva su ancho fijo y los iconos su posición.

## Detalle técnico

En `src/components/Leaderboard.tsx`, filas 333-371:
- Contenedor izquierdo: `flex items-center gap-4` pasa a incluir `min-w-0 flex-1`; el bloque de nombre/diferencia recibe `min-w-0`.
- Línea de diferencia (`difference > 0`): añadir `whitespace-nowrap` al contenedor y `truncate` al `<span>`, con `text-[11px] sm:text-sm`; el icono `TrendingUp` lleva `shrink-0`.
- Mensaje de empate: mismas clases `truncate whitespace-nowrap text-[11px] sm:text-sm`.
- El bloque derecho ya es `shrink-0`, así que no cede ni crece.

## Verificación

- Compilación sin errores.
- Revisión visual en móvil (394 px) con puntajes de 3-4 dígitos y nombres largos, en español, portugués, hindi y chino, confirmando una sola línea en todos los casos.
