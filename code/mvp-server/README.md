DWG Planner MVP Server (Node.js + SQLite)

Overview:
- Endpoints per DWG ingestion, DWGObject mapping, task management, resources, passwordless login (mock), and assignments.
- Uses SQLite file-based DB (dwg_planner.db) to persist MVP data.
- In-memory passwordless tokens for simple auth flow in MVP.

Setup:
- cd code/mvp-server
- npm install
- node index.js

Note: This is a minimal PoC MVP intended to validate the spec-driven architecture and API contracts. For production, consider persistent session management, proper authentication, and a robust data model with migrations.
