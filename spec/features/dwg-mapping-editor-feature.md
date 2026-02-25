Title: DWG Mapping Editor – MVP
Slug: dwg-mapping-editor-feature
Intent: Definire l'editor per collegare proprietà DWG ai task e alla pianificazione.

Attori
- Planner/Admin: definisce mapping
- Risorsa: utilizza mapping durante la gestione dei task

Requisiti chiave
- Editor consente di associare proprietà DWG (layer, handle, tag) ai campi Task (start_at, end_at, status, description)
- Salvataggio mapping persistente
- Mapping visibile nelle viste MVP

AC
- AC1: Mapping salvato e riletto dalle viste
- AC2: Supporto aggiornamenti e rollback minimo

Edge cases
- Proprietà DWG mancanti o non valide
