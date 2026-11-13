# Modern Web Guidance — verificación inicial

## Instalación

No existía una instalación local previa. Se utilizó el procedimiento oficial del paquete npm `modern-web-guidance@1.0.0`:

```sh
npx modern-web-guidance@latest install
```

El instalador detectó `codex` y eligió automáticamente la instalación local para el proyecto; terminó con código 0. Fuente declarada y utilizada: `https://github.com/GoogleChrome/modern-web-guidance.git`. No fue necesario el método alternativo de marketplace ni una instalación global.

Archivos instalados: `.agents/skills/modern-web-guidance/` (210 archivos: `SKILL.md` y guías), y `skills-lock.json` en la raíz. El identificador de versión de la habilidad en `SKILL.md` es `2026_11_09-5bcc021b`; la versión del CLI comprobada mediante `--version` es `1.0.0`. Son identificadores distintos.

El agente leyó `SKILL.md` desde el checkout y ejecutó su flujo de búsqueda/recuperación. Esto verifica el uso efectivo de la habilidad en esta sesión; no se afirma haber probado otra sesión nueva de Codex.

## Prueba real

```sh
npx modern-web-guidance@latest search "web application performance and accessibility"
npx modern-web-guidance@latest retrieve "performance,accessibility"
```

Ambos comandos terminaron con código 0. La búsqueda devolvió 10 resultados, incluidos los IDs `performance` y `accessibility`; la recuperación entregó el contenido de ambas guías. Resultado original de búsqueda: `search-results.json`.

## Escaneo inicial

```sh
npx modern-web-guidance@latest legacy-scan .
```

Código de salida 0. **0 hallazgos en 33 guías calificadas**. El CLI indica cobertura aproximada del 20% del corpus y que omitió 1 archivo de documentación/pruebas. Salida original: `legacy-scan.txt`. No se interpreta este resultado como certificación de rendimiento, accesibilidad o ausencia de todos los patrones obsoletos. No se aplicaron modernizaciones.

## Instrucciones y protección del proyecto

Se creó `AGENTS.md` en la raíz con consulta obligatoria para trabajo web relevante, estándares modernos, compatibilidad y fallbacks, rendimiento, accesibilidad, responsive, movimiento reducido, validación previa de recomendaciones, justificación de cambios y pruebas posteriores.

Se compararon hashes SHA-256 antes y después de la instalación: todos los archivos de `src/`, `tests/`, `package.json` y `package-lock.json` permanecieron idénticos. No se modificaron funcionalidades ni configuraciones de Supabase/Vercel y no hubo despliegues.

Validación posterior: `npm run lint`, `npm run typecheck` y `npm run build` aprobados. No se repitieron pruebas E2E porque no cambió código de aplicación ni pruebas ni dependencias.

## Consideraciones

No hay bloqueos detectados. El CLI utiliza telemetría anónima por defecto, según el aviso oficial; permite desactivarla con `DISABLE_TELEMETRY=1`. Los comandos con `@latest` pueden actualizar el CLI en consultas futuras y requieren acceso a npm; las guías instaladas también pueden leerse localmente. La habilidad no se añadió como dependencia de ejecución de la aplicación.

Fuentes oficiales: [documentación Chrome](https://developer.chrome.com/docs/modern-web-guidance), [repositorio de la habilidad](https://github.com/GoogleChrome/modern-web-guidance), [código fuente del CLI](https://github.com/GoogleChrome/modern-web-guidance-src).
