Title: Tests – MVP DWG Planner
Slug: tests-mvp-dwg-planner
Intent: Definire la strategia di testing e la tracciabilita` tra requisiti e test per MVP.

Strategia
- Unit tests: modell dati, mapping logic, validator
- Integration: API contracts, login passwordless, mapping editor
- End-to-end: scenario completo MVP, verifichera UI dalle viste

Tracciabilita` Requisiti-Test
- Ogni requisito ha uno o piu` test associati (AC)

Esempi di casi di test (Given/When/Then)
- CT-UDWG-01: Carica DWG -> DWGFile creato
- CT-MAP-01: Map DWGObject to Task -> mapping salvata
- CT-TASK-01: Crea Task e assegna a Risorsa -> task aggiornato, stato avanzamento
- CT-LVIEW-01: Visualizza Board -> stato task riflette su board
- CT-PW-01: Login passwordless cliente -> sessione attiva
