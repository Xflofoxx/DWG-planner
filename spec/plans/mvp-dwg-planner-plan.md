Title: MVP Plan – DWG Planner
Slug: mvp-dwg-planner-plan
Intent: Raccogliere in un piano esecutivo le scelte MVP, i deliverables e le gates.

Overview
- Obiettivo MVP: implementare le funzionalita` di carico DWG, mapping, task management, viste, gestione risorse, passwordless client, audit/RBAC.
- Deliverables: API contracts, data model, mapping editor, dashboard UI, login passwordless, RBAC, audit, test plan.

Architettura MVP (alto livello)
- Backend: REST API per DWG, objects, tasks, resources, login, assingments
- Frontend: dashboard SPA con board, list, calendar, gantt
- Storage: in-memory + mock storage per DWG; estendibile a DB reale
- Sicurezza: RBAC, passwordless login per client, audit trail

Piano di rilascio MVP
- MVP Alpha: Caricamento DWG, mapping DWGObject, Task CRUD, Basic views, passwordless login client, RBAC, audit
- MVP Beta: Editor mapping completo, calendar/gantt avanzato, gestione risorse
- MVP GA: end-to-end tests, monitoring, deploy pipeline
