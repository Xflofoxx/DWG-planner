# TASKS: Task Management

> **Requirement**: TASK-001  
> **Component**: Server  
> **Status**: Implemented

## Description

Task management with project association, status tracking, and priority levels.

## Endpoints

### GET /api/tasks

List all tasks, optionally filtered by project.

```
GET /api/tasks?project_id=<project_id>
Authorization: Bearer <token> (optional)
```

#### Response

- 200 OK

```json
[
  {
    "id": "task-uuid",
    "project_id": "proj-uuid",
    "title": "Task Title",
    "description": "Task description",
    "status": "pending",
    "priority": "medium",
    "assigned_to": "user-uuid",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### POST /api/tasks

Create a new task.

```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Payload

```json
{
  "project_id": "proj-uuid",
  "title": "Task Title",
  "description": "Task description",
  "status": "pending",
  "priority": "high",
  "assigned_to": "user-uuid"
}
```

#### Response

- 201 Created

```json
{
  "id": "task-uuid",
  "project_id": "proj-uuid",
  "title": "Task Title",
  "description": "Task description",
  "status": "pending",
  "priority": "high",
  "assigned_to": "user-uuid",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

- 400 Bad Request: Missing title or project_id

---

### GET /api/tasks/:id

Get task by ID.

```
GET /api/tasks/:id
Authorization: Bearer <token> (optional)
```

#### Response

- 200 OK

```json
{
  "id": "task-uuid",
  "project_id": "proj-uuid",
  "title": "Task Title",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "assigned_to": "user-uuid",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

- 404 Not Found: Task not found

---

### PUT /api/tasks/:id

Update a task.

```
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Payload

```json
{
  "title": "New Title",
  "description": "New description",
  "status": "completed",
  "priority": "low",
  "assigned_to": "user-uuid"
}
```

#### Response

- 200 OK

```json
{
  "message": "Task updated successfully"
}
```

- 404 Not Found: Task not found

---

### DELETE /api/tasks/:id

Delete a task.

```
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

#### Response

- 200 OK

```json
{
  "message": "Task deleted successfully"
}
```

- 404 Not Found: Task not found

---

### GET /api/tasks/user/:userId

Get tasks assigned to a user.

```
GET /api/tasks/user/:userId
Authorization: Bearer <token> (optional)
```

#### Response

- 200 OK: Array of tasks assigned to the user

## Task Fields

| Field       | Type     | Required | Default   | Description           |
| ----------- | -------- | -------- | --------- | --------------------- |
| id          | string   | Auto     | UUID      | Unique identifier     |
| project_id  | string   | Yes      | -         | Associated project    |
| title       | string   | Yes      | -         | Task title            |
| description | string   | No       | ""        | Task description      |
| status      | string   | No       | "pending" | Task status           |
| priority    | string   | No       | "medium"  | Task priority         |
| assigned_to | string   | No       | null      | Assigned user ID      |
| created_at  | datetime | Auto     | now       | Creation timestamp    |
| updated_at  | datetime | Auto     | now       | Last update timestamp |

## Status Values

| Status      | Description      |
| ----------- | ---------------- |
| pending     | Task not started |
| in_progress | Task in progress |
| completed   | Task completed   |

## Priority Values

| Priority | Description     |
| -------- | --------------- |
| low      | Low priority    |
| medium   | Medium priority |
| high     | High priority   |

## Audit Logging

All task operations are logged to the audit log.

## Implementation

| File                                | Description       |
| ----------------------------------- | ----------------- |
| `src/controllers/TaskController.js` | Task logic        |
| `src/routes/tasks.js`               | Route definitions |
| `src/models/Task.js`                | Task model        |
