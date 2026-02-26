Title: Traceability Matrix – Requisiti vs Test (MVP)
Slug: traceability-mvp
Intent: Definire la mappa tra requisiti MVP e i rispettivi test per facilitare la validazione.

Overview

- Requisiti MVP elencati in spec/features/\*/spec.md (RQ1..)
- Test implementati in tests/

## Test Coverage

| Feature            | Test File                                  | Status      |
| ------------------ | ------------------------------------------ | ----------- |
| DWG Ingestion      | tests/models/DWGFile.test.js               | Implemented |
| DWG Mapping        | tests/models/Mapping.test.js               | Implemented |
| Task Management    | tests/models/Task.test.js                  | Implemented |
| Project Management | tests/models/Project.test.js               | Implemented |
| Authentication     | tests/middleware/auth.test.js              | Implemented |
| Auth Registration  | tests/controllers/AuthRegistration.test.js | Implemented |
| Audit Logging      | tests/models/AuditLog.test.js              | Implemented |
| User Model         | tests/models/User.test.js                  | Implemented |

## Requisiti vs Test Mapping

- RQ1: Caricare DWG -> Tests: tests/models/DWGFile.test.js
- RQ2: Mapping DWGObject -> Tests: tests/models/Mapping.test.js
- RQ3: Task lifecycle -> Tests: tests/models/Task.test.js
- RQ4: Project Management -> Tests: tests/models/Project.test.js
- RQ5: Risorse & Assignments -> Tests: tests/models/Task.test.js
- RQ6: Authentication JWT -> Tests: tests/middleware/auth.test.js
- RQ7: RBAC/Audit -> Tests: tests/models/AuditLog.test.js, tests/middleware/auth.test.js
- RQ8: User Management -> Tests: tests/models/User.test.js

Note: 48 test implementati e passanti.
