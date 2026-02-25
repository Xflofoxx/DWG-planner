DWG Planner MVP Server (Node.js + SQLite)

Overview:
- Endpoints: DWG ingestion, DWGObject mapping, task management, resources, assignments, passwordless login (mock), health.
- DB: SQLite file-based (dwg_planner.db) for MVP data; setup script creates schema; seed script loads sample data.

Setup instructions:
- cd code/mvp-server
- npm install
- npm run setup (initializes DB schema)
- npm run seed (populates sample data)
- npm start

Seed data:
- See code/mvp-server/scripts/seed-data.js for what gets inserted. Adjust as needed for your domain.

Notes:
- This MVP server is intended for validating the spec-driven approach and is not production-ready. Add authentication, proper persistence, error handling, and security hardening for production use.
