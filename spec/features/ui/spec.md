Title: UI MVP – DWG Planner
Slug: dwg-planner-mvp-ui
Intent: Definire le linee guida UI per MVP per le viste e l’editor di mapping.

Linee guida UX
- Editor mapping DWG: interfaccia per associare proprietà DWG a campi task e pianificazione
- Viste: Board (Kanban per stato), List (elenco task), Calendar (date), Gantt (timeline)
- Dashboard: vista progetto e stato; riassunti e indicatori di stato
- Responsive: comportamenti consistenti tra dispositivi mobili e desktop

Composizioni MVP
- Editor mapping: pannello laterale con lista DWGObjects selezionabili e campi di mapping
- Board: colonne per stati (Pianificato, In avanzamento, In attesa, Completato)
- List: tabella con filtro per stato, data e DWGObject associato
- Calendar: calendario mensile/settimane con task posizionati per start/end
- Gantt: linee temporali con dipendenze base (se non definite, mostra stime)

Flussi di navigazione
- Menu: Progetti > DWG Planner > Dashboard/Editor/Impostazioni
- Accesso: login passwordless per cliente, login per risorse/planner

Note di usabilita`
- Feedback immediato per salvataggi mapping e aggiornamenti stato
- Errori chiari e messaggi di validazione inline
- Performance: caricare DWG grandi non blocca il rendering MVP
