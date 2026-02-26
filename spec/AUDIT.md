# AUDIT: Audit Logging

> **Requirement**: AUDIT-001  
> **Component**: Server  
> **Status**: Implemented

## Description

Audit logging system that tracks all create, update, and delete operations across the application.

## Endpoints

### GET /api/audit-logs

List all audit logs (requires authentication).

```
GET /api/audit-logs
Authorization: Bearer <token>
```

#### Response

- 200 OK

```json
[
  {
    "id": "log-uuid",
    "user_id": "user-uuid",
    "action": "CREATE",
    "resource_type": "project",
    "resource_id": "proj-uuid",
    "details": "{\"name\": \"Project Name\"}",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

- 401 Unauthorized: Missing or invalid token

---

### GET /api/audit-logs/user/:userId

Get audit logs for a specific user.

```
GET /api/audit-logs/user/:userId
Authorization: Bearer <token>
```

#### Response

- 200 OK: Array of audit logs for the user

---

### GET /api/audit-logs/resource/:type/:id

Get audit logs for a specific resource.

```
GET /api/audit-logs/resource/:type/:id
Authorization: Bearer <token>
```

#### Example

```
GET /api/audit-logs/resource/project/proj-uuid
```

#### Response

- 200 OK: Array of audit logs for the resource

## Audit Log Fields

| Field         | Type     | Description                                    |
| ------------- | -------- | ---------------------------------------------- |
| id            | string   | Unique identifier                              |
| user_id       | string   | User who performed the action                  |
| action        | string   | Action type (CREATE, UPDATE, DELETE, etc.)     |
| resource_type | string   | Type of resource (project, task, dwg, mapping) |
| resource_id   | string   | ID of the affected resource                    |
| details       | string   | JSON string with additional details            |
| created_at    | datetime | Timestamp of the action                        |

## Action Types

| Action | Description      |
| ------ | ---------------- |
| CREATE | Resource created |
| UPDATE | Resource updated |
| DELETE | Resource deleted |
| UPLOAD | File uploaded    |
| LOGIN  | User logged in   |
| LOGOUT | User logged out  |

## Resource Types

| Resource | Description     |
| -------- | --------------- |
| project  | Project entity  |
| task     | Task entity     |
| dwg      | DWG file entity |
| mapping  | Mapping entity  |
| user     | User entity     |

## Audit Log Details

Details are stored as JSON strings:

```json
{
  "name": "Project Name",
  "description": "Project description"
}
```

## Implementation

| File                                    | Description       |
| --------------------------------------- | ----------------- |
| `src/controllers/AuditLogController.js` | Audit log logic   |
| `src/routes/auditLogs.js`               | Route definitions |
| `src/models/AuditLog.js`                | Audit log model   |

## Automatic Logging

Audit logs are automatically created by controllers:

- `ProjectController` - Creates, updates, deletes projects
- `TaskController` - Creates, updates, deletes tasks
- `DWGController` - Uploads, updates, deletes DWG files
- `MappingController` - Creates, updates, deletes mappings
- `AuthController` - Login/logout events (optional)

## Queries

### Get all logs for a user

```
GET /api/audit-logs/user/user-uuid
```

### Get all logs for a project

```
GET /api/audit-logs/resource/project/proj-uuid
```

### Get all logs for a task

```
GET /api/audit-logs/resource/task/task-uuid
```

## Retention

Audit logs are retained in the SQLite database. Consider implementing a retention policy for long-term storage.
