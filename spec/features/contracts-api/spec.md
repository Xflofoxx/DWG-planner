Title: API Contracts – DWG Planner MVP
Slug: dwg-planner-mvp-api
Intent: Definire i contratti API ad alto livello per MVP senza dettagli di implementazione.

Ruoli e sicurezza
- Ruoli: client, resource, planner/admin
- Passwordless login per client; token a breve durata; sessioni tramite cookie/JWT
- RBAC: permessi basati sul ruolo per ogni endpoint

Endpoints MVP
- POST /projects/{project_id}/dwg
  Payload: { name: string, version?: string, metadata?: JSON }
  Response: { dwg_id, project_id, name, version, uploaded_at }

- GET /projects/{project_id}/dwg
  Response: [ { dwg_id, name, version, uploaded_at } ]

- POST /dwg/{dwg_id}/objects/map
  Payload: { object_id: string, type: string, properties?: JSON, task_id?: string }
  Response: { mapping_id, dwg_id, object_id }

- GET /dwg/{dwg_id}/objects
  Response: [ { id, dwg_id, object_id, type, properties } ]

- POST /tasks
  Payload: { project_id, title, start_at, end_at, dwg_object_ids?: [string], assigned_resource_ids?: [string], description? }
  Response: { task_id, status }

- PATCH /tasks/{task_id}
  Payload: { status?: string, start_at?: string, end_at?: string, notes?: string, assigned_resource_ids?: [string] }

- POST /resources
  Payload: { user_id, role, availability }
  Response: { resource_id }

- POST /tasks/{task_id}/assignments
  Payload: { resource_id, role, allocation_start, allocation_end }
  Response: { assignment_id }

- POST /login/passwordless
  Payload: { email }
  Response: { login_token, expiry }

- POST /login/passwordless/verify
  Payload: { login_token }
  Response: { access_token, refresh_token, expires_in }

Error handling
- Standard HTTP status codes (400, 401, 403, 404, 409, 500)
- Response body: { code, message, details? }

Note di sicurezza
- Le risposte devono seguire formati JSON stabili
- Audit trail per modifiche alle entita` e alle assegnazioni
