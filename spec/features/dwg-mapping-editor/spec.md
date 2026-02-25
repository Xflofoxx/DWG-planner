Title: DWG Mapping Editor – MVP
Slug: dwg-mapping-editor-mvp
Intent: Definire l'editor per collegare proprietà DWG ai task e alla pianificazione.

Attori
- Planner/Admin: definisce mapping
- Risorsa: usa mapping durante la gestione dei task

Requisiti chiave
- Editor consente di associare proprietà DWG (layer, handle, tag) ai campi Task (start_at, end_at, status, description)
- Salvataggio mapping persiste nel sistema
- Mapping visibile nelle viste (reattivazione su board/list/calendar/gantt)

Criteri di accettazione
- AC1: Editor consente di selezionare DWGObject e associare proprietà a campi di Task
- AC2: Mapping viene salvato e ricalcolato durante le viste MVP
- AC3: Mapping supporta aggiornamenti e rollback minimi

Note di progettazione
- MVP: mapping semplice; estendibile con valdiazione e regole business
