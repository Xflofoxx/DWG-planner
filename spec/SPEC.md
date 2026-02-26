# DWG Planner Specification

> **Version**: 1.0.0  
> **Project**: DWG Planner MVP  
> **Status**: Implemented

## Overview

DWG Planner is a web application for project management with DWG file support, task management, and DWG property-to-task mapping.

## Technical Stack

| Component      | Technology      | Version |
| -------------- | --------------- | ------- |
| Runtime        | Node.js         | 20.x    |
| Framework      | Express.js      | 4.x     |
| Database       | SQLite          | 3.x     |
| Authentication | JWT + bcrypt    | -       |
| Testing        | Jest            | 29.x    |
| Frontend       | Vanilla HTML/JS | -       |

## Features

| Feature  | Description                                | Status      |
| -------- | ------------------------------------------ | ----------- |
| AUTH     | User authentication (login, register, JWT) | Implemented |
| PROJECTS | Project CRUD operations                    | Implemented |
| TASKS    | Task management with project association   | Implemented |
| DWG      | DWG file management                        | Implemented |
| MAPPINGS | DWG-to-task property mapping               | Implemented |
| AUDIT    | Audit logging for all operations           | Implemented |

## API Endpoints Summary

| Component | Endpoint                             | Methods          |
| --------- | ------------------------------------ | ---------------- |
| Auth      | `/api/auth/login`                    | POST             |
| Auth      | `/api/auth/register`                 | POST             |
| Auth      | `/api/auth/profile`                  | GET              |
| Projects  | `/api/projects`                      | GET, POST        |
| Projects  | `/api/projects/:id`                  | GET, PUT, DELETE |
| Tasks     | `/api/tasks`                         | GET, POST        |
| Tasks     | `/api/tasks/:id`                     | GET, PUT, DELETE |
| Tasks     | `/api/tasks/user/:userId`            | GET              |
| DWG       | `/api/dwg`                           | GET, POST        |
| DWG       | `/api/dwg/project/:projectId`        | GET              |
| DWG       | `/api/dwg/:id`                       | GET, PUT, DELETE |
| Mappings  | `/api/mappings`                      | GET, POST        |
| Mappings  | `/api/mappings/:id`                  | GET, PUT, DELETE |
| Audit     | `/api/audit-logs`                    | GET              |
| Audit     | `/api/audit-logs/user/:userId`       | GET              |
| Audit     | `/api/audit-logs/resource/:type/:id` | GET              |

## Security

- JWT-based authentication
- Password hashing with bcrypt (12 rounds)
- Role-based access control (user, admin)
- Registration can be disabled via config

## Configuration

Configuration is managed via `config.yaml` and `credentials.yaml`.

### Demo User

| Field    | Value                 |
| -------- | --------------------- |
| Email    | demo@dwgplanner.local |
| Password | DemoAdmin2024!        |
| Role     | admin                 |

## Development Commands

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode (watch)
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

## Feature Specifications

| File           | Description                           |
| -------------- | ------------------------------------- |
| AUTH.md        | Authentication API specification      |
| PROJECTS.md    | Project management API specification  |
| TASKS.md       | Task management API specification     |
| DWG.md         | DWG file management API specification |
| MAPPINGS.md    | DWG-to-task mapping API specification |
| AUDIT.md       | Audit logging API specification       |
| STACK.md       | Technical stack details               |
| DEVELOPMENT.md | Development standards and practices   |

## Test Coverage

| Component   | Tests  | Status      |
| ----------- | ------ | ----------- |
| Models      | 41     | Passing     |
| Middleware  | 6      | Passing     |
| Controllers | 1      | Passing     |
| **Total**   | **48** | **Passing** |
