Title: DWG Ingestion – MVP
Slug: dwg-ingestion-feature
Intent: Definire l'inserimento di file DWG per i progetti MVP, generando DWGFile e metadata.

Attori
- Planner/Admin: carica DWG, associa DWGFile al progetto
- Sistema: validazione base dei file (mock per MVP)

Requisiti chiave
- RQ1: Caricare uno o più DWG per un progetto
- RQ2: DWGFile contiene name, version, uploaded_at, size, mime_type
- RQ3: Creazione DWGFile associato al progetto
- RQ4: Errore chiaro in caso di DWG non valido

Criteri di accettazione (AC)
- AC1: DWG caricati generano entità DWGFile collegate al progetto
- AC2: Risposte API contengono dwg_id e metadata

Edge cases
- DWG non valido; duplicate DWG

Note implementative
- MVP: storage locale/mock; estendibile a storage esterno
