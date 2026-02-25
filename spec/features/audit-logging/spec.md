Title: Audit Logging – MVP
Slug: audit-logging-mvp
Intent: Definire modello di logging per audit delle modifiche nel MVP.

Cosa registra l’audit
- timestamp
- user_id / session_id
- entity: tipo di entità modificata (DWGFile, DWGObject, Task, Assignment, Resource, etc.)
- action: create, update, delete, assign, login, state-change
- details: JSON con vecchi e nuovi valori o descrizione operazione
- project_id / context: riferimento al progetto

Modalita` di conservazione
- Salvataggio in log persistente (mock per MVP) con rotation policy futura

Utilizzo
- Endpoint di consultazione audit per planner/admin
- Include nei report di stato e in test di integrazione
