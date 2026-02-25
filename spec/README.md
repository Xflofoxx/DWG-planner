OpenCode Spec Docs – Struttura per funzionalità

Questo repository adotta una struttura di specifiche per funzionalità individuali (feature-driven), basata sulla metodologia Spec-Driven Development. Le specifiche di alto livello del progetto sono articolate in moduli/feature-specifici, ciascuno contenente: spec.md, plan.md, data-model.md, contracts.md, ui.md, tests.md, e altri file rilevanti. La versione MVP del progetto DWG Planner è divisa in più feature indipendenti per facilitare iterazioni rapide, tracciabilità e validazione.

Struttura consigliata (root spec):
- spec/
  - 001-dwg-planner/ (storico – evita duplicazione, ma qui è dove iniziavamo)
  - features/
    - dwg-ingestion/
    - dwg-mapping-editor/
    - task-management/
    - views/
    - resources/
    - auth-passwordless/
    - rbac-audit/
    - mvp-scenarios/
  - development-standards.md

Note: puoi convertire i documenti esistenti in questa nuova struttura e archiviarli qui per una migliore tracciabilita` delle feature.
