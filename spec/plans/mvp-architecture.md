Title: MVP Architecture – DWG Planner
Slug: mvp-architecture-dwg-planner
Intent: Descrivere l’architettura MVP in modo sintetico (componenti, interfacce, flussi principali).

Componenti principali
- Ingest DWG: carica DWG e metadata
- DWG Object Mapping: mappa oggetti DWG a campi Task/Planning
- Task Management: CRUD e stato
- Views Engine: board, list, calendar, gantt – fetch dati dal backend
- Resources & Assignments: gestione risorse e assegnazioni
- Authentication: passwordless per client; autentica risorse/planner
- Audit: log eventi
- RBAC: ruolo-based access control

Interfacce
- Backend REST API per tutte le entità
- Frontend SPA per dashboard e editor

Tecnologie (scelte ad alto livello)
- Backend: Node.js/Express (MVP), PostgreSQL o SQLite in MVP later
- Frontend: React o Vue (MVP)
- Storage DWG: mock o file storage locale
- Passwordless: token via email (mock durante MVP)
