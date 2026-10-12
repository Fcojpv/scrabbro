# Comentarios integrados sin interrumpir la partida

## Resultado
Añadir dentro del menú de configuración una opción **“Enviar comentarios”**, con un icono de mensaje y signo “+”. Al pulsarla se abrirá una ventana sobre ScrabBro con un Google Form incrustado, sin salir de la aplicación ni perder la partida.

## Diseño y ubicación
- Colocar la opción dentro del engranaje, separada de idiomas y antes de **“Guardar y Cerrar Aplicación”**.
- Usar un icono de mensaje con “+”, más reconocible para comentarios que una mano depositando algo.
- Mantener tamaño, color, tipografía, alineación y área táctil del menú actual.
- Mostrar una ventana adaptada a teléfonos, con título, breve descripción y cierre claro.
- Evitar abrir pestañas externas durante el flujo normal; incluir un enlace alternativo solo si Google impide cargar el formulario incrustado.

## Comportamiento durante la partida
- Guardar inmediatamente el estado actual antes de abrir el formulario.
- Pausar los temporizadores de turno y partida conservando exactamente el tiempo restante/transcurrido.
- Pausar la radio si estaba reproduciéndose.
- Al cerrar la ventana, reanudar únicamente lo que estaba activo antes de abrirla.
- No reiniciar turnos, puntajes, ronda, historial ni la posición actual de la vista.
- Si el guardado falla, no abrir el formulario y mostrar un aviso para evitar pérdida de información.

## Google Forms
- Usar la URL de inserción (`.../viewform?embedded=true`) del formulario que proporciones.
- El formulario y sus respuestas seguirán administrándose desde tu cuenta de Google.
- Configurar Google Forms para no exigir inicio de sesión, salvo que quieras limitar quién responde.
- Añadir un texto corto de privacidad dentro del propio formulario si se solicitan nombres o correos.

## Idiomas y accesibilidad
- Traducir título, descripción, botón del menú, estados de carga, alternativa de apertura y errores a inglés, español, chino, hindi, árabe y portugués.
- Añadir nombre accesible al icono, foco visible y funcionamiento correcto en árabe de derecha a izquierda.
- Mantener objetivos táctiles cómodos y evitar que el teclado tape los campos del formulario.

## Detalles técnicos
- Crear un diálogo de comentarios reutilizando el sistema de ventanas existente e integrar el `iframe` de Google Forms.
- Extender ambos temporizadores con operaciones reales de pausa/reanudación; no usar las operaciones actuales de detener, porque borran su configuración.
- Registrar el estado previo de temporizadores y radio para restaurarlo al cerrar.
- Usar el guardado inmediato ya existente antes de mostrar el formulario.
- Mantener la URL del formulario en una constante de configuración y restringirla a una dirección HTTPS de Google Forms.

## Verificación
- Probar apertura, escritura, envío y cierre en formato móvil.
- Confirmar que puntajes, turno, ronda e historial permanecen intactos.
- Confirmar que los relojes no avanzan mientras el formulario está abierto y continúan desde el mismo valor.
- Confirmar reanudación selectiva de radio y temporizadores.
- Revisar los seis idiomas, dirección árabe, formulario largo con teclado abierto y alternativa si el formulario no carga.

## Necesario para conectarlo
Antes de finalizar la integración necesitaré la **URL de inserción de tu Google Form**. En Google Forms: **Enviar → `<>` Insertar HTML → copiar únicamente la URL del atributo `src`**. No necesito acceso a tu cuenta ni al formulario.
