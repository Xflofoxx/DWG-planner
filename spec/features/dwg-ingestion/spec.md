Title: DWG Ingestion – MVP
Slug: dwg-ingestion-mvp
Intent: Definire i requisiti per caricare DWG e creare DWGFile associati a un progetto.

Attori
- Planner/Admin: carica DWG, crea DWGFile
- Sistema: valida i file (mock per MVP), estrazione metadati di base

Requisiti chiave
- RQ1: Possibilità di caricare uno o più DWG per un progetto
- RQ2: DWGFile contiene name, version, uploaded_at, size, mime_type
- RQ3: DWG ingestion genera DWGFile associato al progetto
- RQ4: In caso di DWG non valido, errore chiaro

Criteri di accettazione
- AC1: Caricamento DWG crea entità DWGFile collegata al progetto
- AC2: Risposte JSON strutturate con dwg_id e metadata

Note di progettazione
- MVP: file DWG archiviati localmente in mock storage; estendere a storage reale in secondi MVP
