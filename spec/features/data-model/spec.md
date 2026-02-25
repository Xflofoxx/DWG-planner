Title: Data Model – DWG Planner MVP
Slug: dwg-planner-mvp-data-model
Intent: Definire le entità principali e le relazioni per MVP, inclusi esempi di payload JSON.

Entità principali (concettuali)
- Project: id, name, description, client_id, created_at, updated_at
- DWGFile: id, project_id, name, version, uploaded_at, size, mime_type
- DWGObject: id, dwg_id, object_id, type, properties (JSON)
- Task: id, project_id, title, description, start_at, end_at, status, dwg_object_ids (array), assigned_resource_ids (array), notes
- Resource: id, user_id, role, availability (array)
- Assignment: id, task_id, resource_id, allocation_start, allocation_end, workload
- Client: id, user_id, email, name, passwordless_enabled
- User: id, email, name, external_id
- Audit: id, timestamp, user_id, action, details

Relazioni (cardinalita` approssimate)
- Project 1:N DWGFile
- DWGFile 1:N DWGObject
- Project 1:N Task
- Task 0:N DWGObject (via dwg_object_ids)
- Task 1:N Assignment
- Assignment -> Resource
- Client 1:1 User

Vincoli chiave
- id come chiave primaria per ogni entità
- DWGObject.properties memorizzate come JSON
- Status di Task come enum: planned, in_progress, blocked, completed

Esempi di payload JSON (schemi sintetici)
- DWGFile
  { "id": "dwg1", "project_id": "p1", "name": "layout.dwg", "version": "1.0", "uploaded_at": "2026-02-25T12:00:00Z", "size": 204800 }
- DWGObject
  { "id": "obj1", "dwg_id": "dwg1", "object_id": "A123", "type": "LINE", "properties": { "layer": "L1", "handle": "0x1" } }
- Task
  { "id": "t1", "project_id": "p1", "title": "Setup base", "start_at": "2026-03-01T09:00:00Z", "end_at": "2026-03-05T17:00:00Z", "status": "planned", "dwg_object_ids": ["obj1"], "assigned_resource_ids": ["r1"], "notes": "Initial setup" }
- Resource
  { "id": "r1", "user_id": "u1", "role": "engineer", "availability": [ {"date": "2026-03-01", "hours": 8} ] }
- Assignment
  { "id": "a1", "task_id": "t1", "resource_id": "r1", "allocation_start": "2026-03-01T09:00:00Z", "allocation_end": "2026-03-01T17:00:00Z" }
