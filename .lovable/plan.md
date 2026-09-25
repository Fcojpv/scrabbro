# Cierre seguro desde Configuración

## Resultado
- Añadir una **X** en el extremo derecho del encabezado “Configuración”, alineada con el título y con el mismo estilo visual de los iconos actuales.
- Al tocarla durante una partida, mostrar una advertencia breve indicando que la partida se guardará antes de salir.
- Ofrecer dos acciones claras: **Cancelar** y **Guardar y cerrar**.
- Traducir el título, la explicación, los botones y los avisos a inglés, español, chino, hindi, árabe y portugués.

## Comportamiento
- **Android instalado:** guardar inmediatamente el estado más reciente y cerrar la aplicación después de confirmar.
- **Vista web o preview:** guardar inmediatamente y mostrar un aviso indicando que la partida quedó guardada y que el usuario puede cerrar la pestaña o aplicación. Los navegadores no permiten que una página cierre por sí sola una pestaña que el usuario abrió.
- **Sin partida activa:** permitir cerrar sin mostrar información innecesaria sobre una partida.
- Si el guardado falla, no cerrar y mostrar un mensaje de error para evitar pérdida de datos.

## Ajustes de seguridad y experiencia
- Incorporar una función de guardado inmediato, separada del guardado automático actual de 500 ms, para que el último puntaje o turno no se pierda al cerrar rápidamente.
- Mantener el guardado automático existente durante el juego.
- Detener radio y temporizadores antes del cierre confirmado.
- Evitar que la X cierre solamente el menú por accidente: será un comando explícito con nombre accesible y área táctil adecuada.
- Conservar el tamaño compacto del menú y comprobar la alineación en pantalla móvil y en dirección derecha-a-izquierda para árabe.

## Preparación Android
- Configurar Capacitor con el identificador `app.lovable.e20652a9c0c345adb08d3f07dbccc65c` y nombre `scrabbro`.
- Añadir la capacidad nativa necesaria para cerrar la aplicación en Android.
- Mantener una alternativa segura para web, donde el cierre programático está restringido.

## Verificación
- Comprobar la advertencia, Cancelar, guardado y cierre/fallback web.
- Confirmar que una partida cerrada se ofrece para restaurar al abrir nuevamente.
- Revisar visualmente el encabezado de Configuración en móvil, incluidos los seis idiomas.
