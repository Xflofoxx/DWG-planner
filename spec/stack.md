Title: Stack Tecnologico – DWG Planner MVP
Slug: stack-tecnologico-dwg-planner
Intent: Definire lo stack tecnologico scelto per MVP, con motivazioni.

Runtime: Node.js 20.x (LTS)
- Motivo: ampia maturita`, ecosistema stabile, facile integrazione con SQLite e DuckDB, buone librerie per REST API e server
- Runtime di esecuzione consigliato: Node.js (npm) o Bun.js come runner, con compatibilita` per moduli Node

Backend & API
- Framework: Express (MVP) o Fastify per possibile upgrade
- Database principale: SQLite (sqlite3 o better-sqlite3) per MVP
- Analytics: DuckDB Node bindings per analitica avanzata

Frontend
- React (Vite) / alternative leggeri per MVP

Deployment & tooling
- Package manager: npm o bun; scelta consigliata: npm per massima compatibilita` nei framework
- Testing: Jest + Supertest per API
- Linting: ESLint + Prettier

Note
- Il switch a Bun e la migrazione tra sqlite3/better-sqlite3 deve essere compatibile con i moduli Node
