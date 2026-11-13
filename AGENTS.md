# Video Lab — instrucciones para agentes

## Modern Web Guidance

Modern Web Guidance está instalado para Codex en este proyecto. Antes de desarrollar o modificar funcionalidades web relevantes (HTML, CSS, interfaces, lógica del navegador, rendimiento o accesibilidad), lee `.agents/skills/modern-web-guidance/SKILL.md` y consulta las guías pertinentes.

1. Busca recomendaciones con consultas concretas por capacidad o patrón:
   `npx modern-web-guidance@latest search "<consulta>"`.
2. Recupera y lee las guías relevantes antes de implementar:
   `npx modern-web-guidance@latest retrieve "<id>"`.
3. Verifica las recomendaciones, su aplicabilidad, compatibilidad y posibles alternativas antes de implementarlas. No inventes guías ni interpretes una recomendación como autorización para ampliar el alcance.
4. Prioriza APIs modernas y estándares web. Mantén compatibilidad con navegadores modernos, utilizando la información Baseline de las guías y detección de capacidades o degradación adecuada cuando sea necesaria.
5. Optimiza rendimiento y accesibilidad: HTML semántico, navegación con teclado, foco visible, etiquetas, estados y contraste adecuados. Comprueba la interacción real.
6. Evita patrones obsoletos y dependencias innecesarias. Prefiere capacidades nativas cuando sean apropiadas; no añadas polyfills ni bibliotecas sin justificar su necesidad.
7. Aplica diseño responsive para escritorio, tabletas y móviles. Respeta `prefers-reduced-motion` y evita animaciones imprescindibles para comprender o utilizar la interfaz.
8. No sustituyas funcionalidades existentes sin justificación técnica, pruebas y autorización dentro del alcance solicitado.
9. Después de cambios, ejecuta `npm run lint`, `npm run typecheck` y `npm run build`. Cuando cambien flujos de uso, ejecuta también `npm run test:e2e` tras compilar. Informa de resultados y limitaciones sin afirmar verificaciones no realizadas.

Para un escaneo de patrones antiguos solicitado explícitamente:
`npx modern-web-guidance@latest legacy-scan .`.
El escaneo cubre solo un subconjunto de patrones; verifica sus hallazgos antes de proponer cambios. Cero hallazgos no equivale a una auditoría completa de rendimiento o accesibilidad.

## Entorno y límites del proyecto

- Usa el checkout existente: cada tarea en la nube ya está aislada. No crees worktrees salvo petición explícita del usuario.
- Mantén la separación entre datos de demostración, persistencia local e integraciones reales. No presentes capacidades pendientes como funcionales.
- No expongas secretos ni inventes credenciales. No modifiques Supabase o Vercel ni despliegues a producción sin autorización específica.
- Conserva los archivos y cambios existentes. Limita las modificaciones al alcance solicitado y documenta las decisiones relevantes.
