Title: DWG Mapping Editor – MVP
Slug: dwg-mapping-editor-feature
Intent: Definire l'editor per collegare proprietà DWG ai task e alla pianificazione.

Attori
- Planner/Admin: definisce mapping
- Risorsa: usa mapping nei task

Requisiti chiave
- Editor consente di associare proprietà DWG (layer, handle, tag) ai campi Task e Planning
- Salvataggio mapping persistente
- Mapping visibile nelle viste MVP

AC
- AC1: Mapping salvato e letto nelle viste
- AC2: Supporto aggiornamenti/minimi rollback

Edge cases
- Proprieta` DWG mancanti/ non valide
