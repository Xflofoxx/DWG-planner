# RBAC: Role-Based Access Control

> **Requirement**: RBAC-001  
> **Component**: Server  
> **Status**: Spec Ready

## Overview

The system implements Role-Based Access Control with three main roles: PM (Project Manager), Operativo (Field Worker), and Cliente (Client). Users can be assigned to multiple projects with potentially different roles.

## User Roles

| Role      | Description          | Access Level             |
| --------- | -------------------- | ------------------------ |
| admin     | System administrator | Full system access       |
| pm        | Project Manager      | Full project access      |
| operativo | Field Worker         | Limited project access   |
| cliente   | Client               | Read-only project access |

## Role Permissions

### Admin

| Resource   | Create | Read | Update | Delete |
| ---------- | ------ | ---- | ------ | ------ |
| Users      | Yes    | All  | All    | Yes    |
| Projects   | Yes    | All  | All    | Yes    |
| Tasks      | Yes    | All  | All    | Yes    |
| DWG Files  | Yes    | All  | All    | Yes    |
| Mappings   | Yes    | All  | All    | Yes    |
| Audit Logs | No     | All  | No     | No     |

### PM (Project Manager)

| Resource   | Create | Read         | Update       | Delete |
| ---------- | ------ | ------------ | ------------ | ------ |
| Users      | No     | Project only | Project only | No     |
| Projects   | Yes    | Own projects | Own projects | Yes    |
| Tasks      | Yes    | Own projects | Own projects | Yes    |
| DWG Files  | Yes    | Own projects | Own projects | Yes    |
| Mappings   | Yes    | Own projects | Own projects | Yes    |
| Audit Logs | No     | Own projects | No           | No     |

### Operativo (Field Worker)

| Resource   | Create | Read              | Update       | Delete |
| ---------- | ------ | ----------------- | ------------ | ------ |
| Users      | No     | No                | No           | No     |
| Projects   | No     | Assigned only     | No           | No     |
| Tasks      | No     | Assigned tasks    | Own assigned | No     |
| DWG Files  | No     | Assigned projects | No           | No     |
| Mappings   | No     | Assigned projects | No           | No     |
| Audit Logs | No     | No                | No           | No     |

### Cliente (Client)

| Resource   | Create | Read                          | Update | Delete |
| ---------- | ------ | ----------------------------- | ------ | ------ |
| Users      | No     | No                            | No     | No     |
| Projects   | No     | Assigned only                 | No     | No     |
| Tasks      | No     | Assigned projects (read only) | No     | No     |
| DWG Files  | No     | Assigned projects             | No     | No     |
| Mappings   | No     | Assigned projects             | No     | No     |
| Audit Logs | No     | No                            | No     | No     |

## User-Project Assignment

Users can be assigned to multiple projects with different roles per project.

### Project Users Table

```sql
CREATE TABLE project_users (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  assigned_by TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(project_id, user_id)
);
```

## API Endpoints

### GET /api/users

List all users (admin only).

### GET /api/users/:id

Get user by ID.

### PUT /api/users/:id

Update user (self or admin).

### GET /api/projects/:id/users

List users assigned to a project (PM+).

### POST /api/projects/:id/users

Assign user to project (PM+).

### DELETE /api/projects/:id/users/:userId

Remove user from project (PM+).

### PUT /api/projects/:id/users/:userId

Update user's role in project (PM+).

## Middleware

### requireRole(roles)

Check if user has required role for the operation.

### checkProjectAccess(resource)

Check if user has access to the specific project.

## Implementation Files

| File                         | Description                   |
| ---------------------------- | ----------------------------- |
| `src/middleware/rbac.js`     | RBAC middleware               |
| `src/models/ProjectUser.js`  | Project-User assignment model |
| `src/routes/users.js`        | User management routes        |
| `src/routes/projectUsers.js` | Project membership routes     |

## Migration

```sql
-- Add role column to users table
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';

-- Create project_users table
CREATE TABLE project_users (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  assigned_by TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(project_id, user_id)
);
```
