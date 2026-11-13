# Video Lab

Primera fase de un estudio audiovisual multimarca: Next.js App Router, TypeScript, Tailwind CSS 4 y componentes propios con iconos Lucide. Compatible con el runtime Node de Vercel. No requiere servicios externos ni variables de entorno.

## Desarrollo

Requiere Node.js 22 o superior y npm. El entorno validado usa Node 24.

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run typecheck
npm run build
npm run start
```

`npm run test:e2e` ejecuta Playwright en escritorio y móvil. La configuración usa Chromium del sistema si existe (`/usr/bin/chromium`), admite `CHROMIUM_PATH` y, en otro caso, usa el navegador de Playwright (`npx playwright install chromium`). El servidor de pruebas utiliza la compilación de producción, por lo que primero debes ejecutar `npm run build`.

## Funciones reales

- Ocho secciones navegables: dashboard, proyectos, editor, biblioteca, marcas, calendario, automatizaciones y configuración.
- Crear y actualizar marcas: nombre, referencia HTTPS del logo, dos colores, tipografía, descripción, público, tono y preferencias de plataformas. Los avatares muestran iniciales; no se descargan logos externos.
- Crear proyectos, buscar y filtrar por marca y estado, abrir un proyecto en el editor y cambiar su nombre y estado (borrador/en progreso).
- Persistencia local versionada en `localStorage`, sincronización entre pestañas y mensajes ante datos corruptos o fallos de escritura. No hay sincronización entre dispositivos, cuentas ni backend. Los datos locales pueden desaparecer al borrar el almacenamiento del navegador.
- Demostración inicial claramente señalada; proyectos demo y locales etiquetados por separado. Las fechas de muestra son fijas. Calendario y fechas de presentación usan America/Santo_Domingo.
- Formularios con validaciones nativas y límites; diálogo modal nativo con foco y Escape, navegación por teclado, enlace para saltar al contenido y preferencias de movimiento reducido.

## Estructura y decisiones

- `src/app/layout.tsx`: metadatos, idioma y estilos.
- `src/app/[[...section]]/page.tsx`: rutas permitidas, soporte de URL directa y 404 para rutas desconocidas.
- `src/components/studio.tsx`: shell y vistas de las ocho secciones.
- `src/components/ui.tsx` y `forms.tsx`: tarjetas, diálogos, estados vacíos y formularios reutilizables.
- `src/lib/models.ts`: modelos serializables de marcas, proyectos y contrato `WorkspaceRepository`.
- `src/lib/demo.ts`: conjunto independiente de ejemplos.
- `src/lib/storage.ts`: adaptador local con validación del contenido almacenado.
- `src/lib/use-workspace.ts`: integración React del almacenamiento externo mediante `useSyncExternalStore`.
- `src/app/globals.css`: tokens visuales, utilidades Tailwind y estilos adaptables del estudio.
- `tests/studio.spec.ts`: escenarios funcionales en Chromium, escritorio y móvil.

Se evita instalar SDKs sin uso. La separación del repositorio de datos permite sustituir el adaptador local por Supabase. Antes de producción multiusuario: incorporar autenticación, tablas `brands`/`projects` con relación por UUID, propietario/espacio de trabajo, políticas RLS, migraciones, validación en servidor y Storage. Nunca exponer una clave de servicio en el cliente.

El editor actual es una estructura visual: previsualización estática CSS, paneles y línea de tiempo reservada. La futura integración Remotion debe añadir composiciones tipadas, reproductor, pistas, duración y flujo de renderizado. No se ha instalado ni se presenta como un motor operativo.

## Pendientes explícitos

Edición audiovisual, reproducción, importación de recursos, exportación/renderizado, IA, autenticación, Supabase, programación real, publicación social y automatizaciones. Los controles aún no implementados están deshabilitados o identificados como próximos. La publicación de demostración del calendario no ejecuta ninguna acción. No se han contratado servicios, comprado dominios ni conectado APIs.

## Despliegue en Vercel

Importa `starpaperlab/videolab`, selecciona Next.js, directorio raíz del repositorio, Node 24.x, instalación `npm ci` y build `npm run build`. Vercel detecta la salida automáticamente. Esta fase no necesita secretos ni variables de entorno. No se ha realizado un despliegue remoto; las comprobaciones se ejecutan localmente sobre producción.

## Auditoría inicial

El checkout estaba vacío, con rama local `work` sin commits y remoto GitHub sin referencias publicadas. No existían archivos fuente, manifiestos, instrucciones AGENTS ni configuración que preservar. Se inicializó el proyecto desde cero. Modern Web Guidance no estaba disponible entre las herramientas verificadas de la sesión; no se atribuye su aplicación.

## Archivos creados

El proyecto se creó completo; no había archivos previos que modificar.

- Raíz: `.gitignore`, `package.json`, `package-lock.json`, `tsconfig.json`, `next-env.d.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `playwright.config.ts` y este `README.md`.
- Aplicación: `src/app/layout.tsx`, `globals.css`, `error.tsx`, `not-found.tsx` y `[[...section]]/page.tsx`.
- Componentes: `src/components/studio.tsx`, `ui.tsx` y `forms.tsx`.
- Dominio y datos: `src/lib/models.ts`, `demo.ts`, `storage.ts` y `use-workspace.ts`.
- Pruebas: `tests/studio.spec.ts`.

## Validación realizada

- `npm run lint`: sin errores ni advertencias de código.
- `npm run typecheck`: correcto.
- `npm run build`: compilación optimizada correcta.
- `npm run test:e2e`: 6 pruebas aprobadas, 3 escenarios ejecutados en escritorio y móvil. Comprueban creación/actualización de marca, persistencia al recargar, creación de proyecto, filtros, actualización de metadatos del editor, estados vacíos, las ocho rutas, ausencia de desbordamiento horizontal, diálogo con Escape, página no encontrada y aviso ante almacenamiento corrupto.
- Capturas de dashboard de escritorio y móvil inspeccionadas visualmente. No se ha realizado una auditoría completa de accesibilidad ni un despliegue remoto.
