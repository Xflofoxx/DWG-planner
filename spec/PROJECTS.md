# PROJECTS: Project Management

> **Requirement**: PROJ-001  
> **Component**: Server  
> **Status**: Implemented

## Description

Project management with CRUD operations and audit logging.

## Endpoints

### GET /api/projects

List all projects.

```
GET /api/projects
Authorization: Bearer <token> (optional)
```

#### Response

- 200 OK

```json
[
  {
    "id": "proj-uuid",
    "name": "Project Name",
    "description": "Project description",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### POST /api/projects

Create a new project.

```
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Payload

```json
{
  "name": "Project Name",
  "description": "Project description"
}
```

#### Response

- 201 Created

```json
{
  "id": "proj-uuid",
  "name": "Project Name",
  "description": "Project description",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

- 400 Bad Request: Missing name

---

### GET /api/projects/:id

Get project by ID.

```
GET /api/projects/:id
Authorization: Bearer <token> (optional)
```

#### Response

- 200 OK

```json
{
  "id": "proj-uuid",
  "name": "Project Name",
  "description": "Project description",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

- 404 Not Found: Project not found

---

### PUT /api/projects/:id

Update a project.

```
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Payload

```json
{
  "name": "New Name",
  "description": "New description"
}
```

#### Response

- 200 OK

```json
{
  "message": "Project updated successfully"
}
```

- 404 Not Found: Project not found

---

### DELETE /api/projects/:id

Delete a project.

```
DELETE /api/projects/:id
Authorization: Bearer <token>
```

#### Response

- 200 OK

```json
{
  "message": "Project deleted successfully"
}
```

- 404 Not Found: Project not found

## Audit Logging

All project operations (create, update, delete) are logged to the audit log.

| Action | Resource Type | Resource ID |
| ------ | ------------- | ----------- |
| CREATE | project       | project.id  |
| UPDATE | project       | project.id  |
| DELETE | project       | project.id  |

## Implementation

| File                                   | Description       |
| -------------------------------------- | ----------------- |
| `src/controllers/ProjectController.js` | Project logic     |
| `src/routes/projects.js`               | Route definitions |
| `src/models/Project.js`                | Project model     |
