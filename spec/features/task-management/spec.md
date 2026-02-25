Title: Task Management – MVP
Slug: task-management-mvp
Intent: Definire la gestione dei task (creazione, stato, assegnazioni) con integrazione DWGObject mapping

Attori
- Planner/Admin: crea e aggiorna task, definisce stato
- Risorsa: aggiorna stato (in quanto assegnata)
- Cliente: view principale (Attraverso passwordless)

Requisiti chiave
- RQ1: Create/Update Task con lega a DWGObjects
- RQ2: Workflow stato: planned -> in_progress -> completed
- RQ3: Assegnazioni: assegnare risorse a task e aggiornarne lo stato di disponibilità
- RQ4: API per recupero lista task, dettaglio, update status

Criteri di accettazione
- AC1: Un task può essere creato e avere DWGObjects associati
- AC2: Stato e date possono essere aggiornati; changes loggati
- AC3: Assegnazioni a risorse funzionano con aggiornamenti di disponibilità
