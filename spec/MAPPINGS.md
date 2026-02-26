# MAPPINGS: DWG-to-Task Mapping

> **Requirement**: MAP-001  
> **Component**: Server  
> **Status**: Implemented

## Description

Mapping between DWG file properties (layers, handles, tags) and task fields for planning purposes.

## Endpoints

### GET /api/mappings

List all mappings, optionally filtered by DWG file.

```
GET /api/mappings?dwg_file_id=<dwg_id>
Authorization: Bearer <token> (optional)
```

#### Response

- 200 OK

```json
[
  {
    "id": "map-uuid",
    "dwg_file_id": "dwg-uuid",
    "layer": "LAYER_1",
    "handle": "ABC123",
    "tag": "TAG_001",
    "task_field": "layer",
    "planning_field": "planning_value",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### POST /api/mappings

Create a new mapping.

```
POST /api/mappings
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Payload

```json
{
  "dwg_file_id": "dwg-uuid",
  "layer": "LAYER_1",
  "handle": "ABC123",
  "tag": "TAG_001",
  "task_field": "layer",
  "planning_field": "planning_value"
}
```

#### Response

- 201 Created

```json
{
  "id": "map-uuid",
  "dwg_file_id": "dwg-uuid",
  "layer": "LAYER_1",
  "handle": "ABC123",
  "tag": "TAG_001",
  "task_field": "layer",
  "planning_field": "planning_value",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

- 400 Bad Request: Missing dwg_file_id or task_field

---

### GET /api/mappings/:id

Get mapping by ID.

```
GET /api/mappings/:id
Authorization: Bearer <token> (optional)
```

#### Response

- 200 OK

```json
{
  "id": "map-uuid",
  "dwg_file_id": "dwg-uuid",
  "layer": "LAYER_1",
  "handle": "ABC123",
  "tag": "TAG_001",
  "task_field": "layer",
  "planning_field": "planning_value",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

- 404 Not Found: Mapping not found

---

### PUT /api/mappings/:id

Update a mapping.

```
PUT /api/mappings/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Payload

```json
{
  "layer": "NEW_LAYER",
  "handle": "NEW_HANDLE",
  "tag": "NEW_TAG",
  "task_field": "new_task_field",
  "planning_field": "new_planning_value"
}
```

#### Response

- 200 OK

```json
{
  "message": "Mapping updated successfully"
}
```

- 404 Not Found: Mapping not found

---

### DELETE /api/mappings/:id

Delete a mapping.

```
DELETE /api/mappings/:id
Authorization: Bearer <token>
```

#### Response

- 200 OK

```json
{
  "message": "Mapping deleted successfully"
}
```

- 404 Not Found: Mapping not found

## Mapping Fields

| Field          | Type     | Required | Default | Description          |
| -------------- | -------- | -------- | ------- | -------------------- |
| id             | string   | Auto     | UUID    | Unique identifier    |
| dwg_file_id    | string   | Yes      | -       | Associated DWG file  |
| layer          | string   | No       | null    | DWG layer name       |
| handle         | string   | No       | null    | DWG entity handle    |
| tag            | string   | No       | null    | DWG entity tag       |
| task_field     | string   | Yes      | -       | Task field to map to |
| planning_field | string   | No       | null    | Planning value       |
| created_at     | datetime | Auto     | now     | Creation timestamp   |

## Use Cases

### Layer Mapping

Map DWG layers to task fields:

- Layer "ELECTRICAL" → Task field "electrical"
- Layer "PLUMBING" → Task field "plumbing"

### Handle Mapping

Map specific DWG entity handles to task details:

- Handle "ABC123" → Task assigned_to user

### Tag Mapping

Map DWG tags to custom fields:

- Tag "AREA_A1" → planning_field "zone_a1"

## Audit Logging

All mapping operations are logged to the audit log.

## Implementation

| File                                   | Description       |
| -------------------------------------- | ----------------- |
| `src/controllers/MappingController.js` | Mapping logic     |
| `src/routes/mappings.js`               | Route definitions |
| `src/models/Mapping.js`                | Mapping model     |

## Related Features

| Feature | Description         |
| ------- | ------------------- |
| DWG     | DWG file management |
| TASKS   | Task management     |
