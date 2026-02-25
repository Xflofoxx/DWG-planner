Title: DWG Ingestion – MVP
Slug: dwg-ingestion-feature
Intent: Definire l'inserimento di DWG per i progetti MVP e la creazione di DWGFile con metadata.

Attori
- Planner/Admin: carica DWG e collega a un progetto
- Sistema: validazione base dei file (mock)

Requisiti chiave
- RQ1: Caricare uno o più DWG per un progetto
- RQ2: DWGFile contiene name, version, uploaded_at, size, mime_type
- RQ3: Creazione DWGFile associato al progetto
- RQ4: Gestione errori per DWG non valido

Criteri di accettazione
- AC1: DWG caricati generano DWGFile collegato al progetto
- AC2: Risposta API contiene dwg_id e metadata

Edge cases
- DWG non valido; DWG duplicati
