Title: REQ → TEST Traceability (MVP)
Slug: traceability-mvp-req-test
Intent: Definire link chiari tra requisiti MVP e i test associati.

Scope
- MVP DWG Planner: mapping tra DWG, task, editor, viste, risorse, login passwordless e auditing.

Requisiti MVP (RQ)
- RQ1 Ingest DWG / DWGFile
- RQ2 DWG Object Mapping (DWGObject) to Task/Planning
- RQ3 Task Lifecycle (create, update, start, pause, complete)
- RQ4 Views (Board, List, Calendar, Gantt)
- RQ5 Resources (create, assign, availability)
- RQ6 Passwordless login per client (visualizzazione)
- RQ7 RBAC e audit
- RQ8 Audit logging per modifiche
- RQ9 Mapping editor per proprietà DWG

Test id e descrizione (esempi)
- CT-UDWG-01: DWG/ DWGFile creazione e associazione progetto
- CT-MAP-01: DWGObject mapping a Task (editor) e salvataggio
- CT-TASK-01: creazione task e assegnazione DWGObject
- CT-LVIEW-01: Board mostra stato corrrettamente
- CT-LVIEW-02: List mostra task per filtro
- CT-CAL-01: Calendario mostra tasks con date
- CT-GANT-01: Gantt mostra timeline base
- CT-RES-01: creare risorse e assegnazioni
- CT-PW-01: login passwordless client (mock) e verifica accesso
- CT-RBAC-01: permessi a ruoli (client vs resource vs planner)
- CT-AUD-01: audit log registra modifiche
- CT-MAP-02: aggiornamento mapping riflette su viste

Tracciabilità
- Ogni requisito mappa a uno o più test; la traccia è mantenuta nelle specifiche specifiche delle feature e in spec/traceability.md (base).
