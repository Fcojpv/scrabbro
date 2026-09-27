# Cierre seguro y sin ambigüedad

## Decisión de experiencia
No usar una **X** para cerrar la aplicación. En el encabezado de Configuración, una X significa convencionalmente “cerrar este menú” y podría provocar un cierre accidental.

En su lugar:
- Mantener el encabezado “Configuración” limpio.
- Añadir al final del menú una fila independiente con icono de encendido y el texto **“Guardar y cerrar aplicación”**.
- Separarla de Idioma mediante una línea divisoria.
- Usar el color normal del menú; reservar el color de advertencia para la ventana de confirmación, evitando que parezca una acción peligrosa permanente.
- Mantener un área táctil amplia, alineación consistente y diseño compacto.

## Flujo al pulsarla
1. Abrir una confirmación con el título **“¿Guardar y cerrar?”**.
2. Explicar: **“Tu partida actual se guardará y podrás continuarla cuando vuelvas.”**
3. Mostrar **Cancelar** como acción secundaria y **Guardar y cerrar** como acción principal.
4. Guardar inmediatamente el estado más reciente antes de intentar cerrar.
5. Si el guardado falla, mantener la aplicación abierta y mostrar un aviso.

## Comportamiento por entorno
- **Aplicación Android:** detener radio y temporizadores, guardar y cerrar tras confirmar.
- **Web y vista previa:** guardar y mostrar “Partida guardada. Ya puedes cerrar esta ventana”; no intentar un cierre bloqueado por el navegador.
- **Sin partida activa:** mostrar **“Cerrar aplicación”** y omitir la referencia al guardado.

## Idiomas y accesibilidad
- Traducir la opción, confirmación y avisos a inglés, español, chino, hindi, árabe y portugués.
- Añadir nombre accesible al icono, foco visible y soporte correcto para árabe de derecha a izquierda.
- Respetar las dimensiones y tipografía actuales del menú.

## Preparación Android
- Configurar Capacitor con identificador `app.lovable.e20652a9c0c345adb08d3f07dbccc65c` y nombre `scrabbro`.
- Incorporar la capacidad nativa de cierre solo para Android.
- Conservar el comportamiento seguro alternativo en navegador.

## Verificación
- Comprobar Cancelar, guardado inmediato, error de guardado y cierre/fallback web.
- Confirmar que la partida guardada aparece para restaurarse al volver.
- Revisar el menú y la confirmación en móvil, en los seis idiomas y en dirección derecha-a-izquierda.
