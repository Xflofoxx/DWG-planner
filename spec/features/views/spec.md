Title: Views – MVP (Board, List, Calendar, Gantt)
Slug: views-mvp-multiple
Intent: Definire le viste MVP per monitorare lo stato dei task e la pianificazione.

Viste MVP
- Board: colonne per stato dei task
- List: tabella con filtraggio per stato e date
- Calendar: viste mensili/settimane con date di inizio/fine
- Gantt: timeline base con task, date e dipendenze minime

Interfaccia e integrazione
- Ogni vista si alimenta dai dati di Task, DWGObject mapping e assegnazioni
- Navigazione tra viste e sincronizzazione in tempo reale (mock in MVP)

Acceptance Criteria
- AC1: Ogni vista mostra task correttamente filtrati e ordinati per stato/ data
- AC2: Le date sono visibili e coerenti tra le viste
- AC3: Le dipendenze (se presenti) sono riflessa nel Gantt (schematico se non completo)
