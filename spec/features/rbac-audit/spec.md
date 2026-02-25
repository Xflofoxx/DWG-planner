Title: RBAC & Audit – MVP
Slug: rbac-audit-mvp
Intent: Definire ruoli, permessi e auditing base per MVP.

Ruoli
- client: solo visualizzazione delle viste del progetto
- resource: modifica task e stato, gestione assegnazioni (in MVP gestione limitata)
- planner/admin: gestione mapping, risorse, contratti, audit

Requisiti chiave
- RQ1: RBAC base per endpoint chiave
- RQ2: Audit log per modifiche a task e assegnazioni
- RQ3: Controlli di accesso per views

Acceptance Criteria
- AC1: Client non può modificare task; Resource e Planner hanno permessi corretti
- AC2: Audit log registra creazioni, aggiornamenti, assegnazioni e login
- AC3: Endpoint dashboard/board disponibil"e al client
