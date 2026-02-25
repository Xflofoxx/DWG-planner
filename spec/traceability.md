Title: Traceability Matrix – Requisiti vs Test (MVP)
Slug: traceability-mvp
Intent: Definire la mappa tra requisiti MVP e i rispettivi test per facilitare la validazione.

Overview
- Requisiti MVP elencati in spec/features/*/spec.md (RQ1..)
- Test di alto livello descritti in spec/features/tests/spec.md o simili

Formato di mapping (esempio)
- RQ1: Caricare DWG -> Tests: CT-UDWG-01, CT-AC-DWG-01
- RQ2: Mapping DWGObject -> Tests: CT-MAP-01
- RQ3: Task lifecycle -> Tests: CT-TASK-01, CT-TASK-02
- RQ4: Views -> Tests: CT-LVIEW-01, CT-LVIEW-02
- RQ5: Risorse & Assignments -> Tests: CT-RES-01
- RQ6: Passwordless login cliente -> Tests: CT-PW-01
- RQ7: RBAC/Audit -> Tests: CT-RBAC-01, CT-AUD-01

Note: questa matrice puo` espandersi man mano che si aggiungono test concreti.
