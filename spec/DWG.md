# DWG: DWG File Management

> **Requirement**: DWG-001  
> **Component**: Server  
> **Status**: Implemented

## Description

DWG file management with project association and metadata tracking.

## Endpoints

### GET /api/dwg

List all DWG files.

```
GET /api/dwg
Authorization: Bearer <token> (optional)
```

#### Response

- 200 OK

```json
[
  {
    "id": "dwg-uuid",
    "project_id": "proj-uuid",
    "name": "drawing.dwg",
    "version": "1.0",
    "uploaded_at": "2024-01-01T00:00:00.000Z",
    "size": 1024,
    "mime_type": "application/acad",
    "file_path": "/uploads/drawing.dwg"
  }
]
```

---

### GET /api/dwg/project/:projectId

List DWG files for a specific project.

```
GET /api/dwg/project/:projectId
Authorization: Bearer <token> (optional)
```

#### Response

- 200 OK: Array of DWG files for the project

---

### POST /api/dwg

Create a new DWG file record.

```
POST /api/dwg
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Payload

```json
{
  "project_id": "proj-uuid",
  "name": "drawing.dwg",
  "version": "1.0",
  "size": 1024,
  "mime_type": "application/acad"
}
```

#### Response

- 201 Created

```json
{
  "id": "dwg-uuid",
  "project_id": "proj-uuid",
  "name": "drawing.dwg",
  "version": "1.0",
  "uploaded_at": "2024-01-01T00:00:00.000Z",
  "size": 1024,
  "mime_type": "application/acad"
}
```

- 400 Bad Request: Missing name or project_id

---

### GET /api/dwg/:id

Get DWG file by ID.

```
GET /api/dwg/:id
Authorization: Bearer <token> (optional)
```

#### Response

- 200 OK

```json
{
  "id": "dwg-uuid",
  "project_id": "proj-uuid",
  "name": "drawing.dwg",
  "version": "1.0",
  "uploaded_at": "2024-01-01T00:00:00.000Z",
  "size": 1024,
  "mime_type": "application/acad"
}
```

- 404 Not Found: DWG file not found

---

### PUT /api/dwg/:id

Update a DWG file.

```
PUT /api/dwg/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Payload

```json
{
  "name": "new-drawing.dwg",
  "version": "2.0"
}
```

#### Response

- 200 OK

```json
{
  "message": "DWG file updated successfully"
}
```

- 404 Not Found: DWG file not found

---

### DELETE /api/dwg/:id

Delete a DWG file.

```
DELETE /api/dwg/:id
Authorization: Bearer <token>
```

#### Response

- 200 OK

```json
{
  "message": "DWG file deleted successfully"
}
```

- 404 Not Found: DWG file not found

## DWG File Fields

| Field       | Type     | Required | Default            | Description        |
| ----------- | -------- | -------- | ------------------ | ------------------ |
| id          | string   | Auto     | UUID               | Unique identifier  |
| project_id  | string   | Yes      | -                  | Associated project |
| name        | string   | Yes      | -                  | File name          |
| version     | string   | No       | "1.0"              | File version       |
| uploaded_at | datetime | Auto     | now                | Upload timestamp   |
| size        | integer  | No       | 0                  | File size in bytes |
| mime_type   | string   | No       | "application/acad" | MIME type          |
| file_path   | string   | No       | null               | File path on disk  |

## Allowed File Types

Configured in `config.yaml`:

- `.dwg` - AutoCAD Drawing
- `.dxf` - Drawing Exchange Format
- `.zip` - Compressed archives
- `.pdf` - PDF documents

Max file size: 10MB (configurable)

## Audit Logging

All DWG file operations are logged to the audit log.

| Action | Resource Type |
| ------ | ------------- |
| UPLOAD | dwg           |
| UPDATE | dwg           |
| DELETE | dwg           |

## Implementation

| File                               | Description       |
| ---------------------------------- | ----------------- |
| `src/controllers/DWGController.js` | DWG logic         |
| `src/routes/dwg.js`                | Route definitions |
| `src/models/DWGFile.js`            | DWG file model    |
