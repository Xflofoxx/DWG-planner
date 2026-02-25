Title: Task Management – MVP
Slug: task-management-feature
Intent: Definire gestione task e workflow MVP con mapping DWGObject

Attori
- Planner/Admin: crea/gestisce task; assegna risorse; cambia stato
- Risorsa: aggiorna stato quando assegnata
- Cliente: vista solo (passwordless)

Requisiti chiave
- RQ1: Crea/aggiorna Task con DWGObject mapping
- RQ2: Workflow: planned -> in_progress -> completed
- RQ3: Assegna risorse e gestisci disponibilità
- RQ4: API di gestione task

AC
- AC1: Task con DWGObject associati
- AC2: Stato, date aggiornabili; audit
- AC3: Assegnazioni a risorse funzionanti
