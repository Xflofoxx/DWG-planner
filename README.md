# DWG Planner

DWG Planner is a web application for project management with DWG file support, task management, and DWG property-to-task mapping.

## Tech Stack

| Component      | Technology      | Version |
| -------------- | --------------- | ------- |
| Runtime        | Node.js         | 20.x    |
| Framework      | Express.js      | 4.x     |
| Database       | SQLite          | 3.x     |
| Authentication | JWT + bcrypt    | -       |
| Testing        | Jest            | 29.x    |
| Frontend       | Vanilla HTML/JS | -       |

## Quick Start

```bash
# Install dependencies
npm install

# Copy credentials template
cp credentials.yaml.example credentials.yaml

# Edit credentials.yaml with your values
npm start
```

## Demo User

On first start, an admin user is automatically created:

- **Email**: demo@dwgplanner.local
- **Password**: (see credentials.yaml)

## Configuration

### credentials.yaml

Sensitive configuration stored in `credentials.yaml`:

```yaml
server:
  port: 3000
  env: development

security:
  jwt:
    secret: "CHANGE_ME_IN_PRODUCTION"
    expiresIn: "7d"

database:
  path: "./src/data/dwg-planner.db"

demo:
  admin_email: "demo@dwgplanner.local"
  admin_password: "Demo!2026!"
```

### config.yaml

General application configuration:

```yaml
server:
  port: 3000
  env: development
  cors:
    enabled: true
    origins:
      - "http://localhost:3000"

security:
  jwt:
    secret: "${JWT_SECRET}"
    expiresIn: "7d"
  bcrypt:
    rounds: 12
  registration:
    enabled: false

database:
  type: sqlite
  path: "${DB_PATH}"

upload:
  max_file_size: 10485760
  allowed_types:
    - ".dwg"
    - ".dxf"
    - ".zip"
    - ".pdf"

features:
  dwg_ingestion: true
  dwg_mapping_editor: true
  task_management: true
  audit_logging: true
  passwordless_auth: false
```

## RBAC - Role-Based Access Control

The system implements RBAC with three main roles:

| Role      | Description          | Access Level             |
| --------- | -------------------- | ------------------------ |
| admin     | System administrator | Full system access       |
| pm        | Project Manager      | Full project access      |
| operativo | Field Worker         | Limited project access   |
| cliente   | Client               | Read-only project access |

### Role Permissions

| Resource   | Admin | PM   | Operativo  | Cliente |
| ---------- | ----- | ---- | ---------- | ------- |
| Users      | CRUD  | -    | -          | -       |
| Projects   | CRUD  | CRUD | Read       | Read    |
| Tasks      | CRUD  | CRUD | Update own | Read    |
| DWG Files  | CRUD  | CRUD | Read       | Read    |
| Mappings   | CRUD  | CRUD | -          | -       |
| Audit Logs | Read  | Read | -          | -       |

## API Endpoints

### Authentication

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | /api/auth/login    | Login                   |
| POST   | /api/auth/register | Registration (disabled) |
| GET    | /api/auth/profile  | User profile            |

### Projects

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | /api/projects     | List projects  |
| POST   | /api/projects     | Create project |
| GET    | /api/projects/:id | Get project    |
| PUT    | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |

### Tasks

| Method | Endpoint                | Description |
| ------ | ----------------------- | ----------- |
| GET    | /api/tasks              | List tasks  |
| POST   | /api/tasks              | Create task |
| GET    | /api/tasks/:id          | Get task    |
| PUT    | /api/tasks/:id          | Update task |
| DELETE | /api/tasks/:id          | Delete task |
| GET    | /api/tasks/user/:userId | User tasks  |

### DWG Files

| Method | Endpoint                    | Description       |
| ------ | --------------------------- | ----------------- |
| GET    | /api/dwg                    | List DWG files    |
| POST   | /api/dwg                    | Create DWG file   |
| GET    | /api/dwg/project/:projectId | Project DWG files |
| GET    | /api/dwg/:id                | Get DWG file      |
| PUT    | /api/dwg/:id                | Update DWG file   |
| DELETE | /api/dwg/:id                | Delete DWG file   |

### Mapping

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | /api/mappings     | List mappings  |
| POST   | /api/mappings     | Create mapping |
| PUT    | /api/mappings/:id | Update mapping |
| DELETE | /api/mappings/:id | Delete mapping |

### Audit Log

| Method | Endpoint                           | Description   |
| ------ | ---------------------------------- | ------------- |
| GET    | /api/audit-logs                    | List logs     |
| GET    | /api/audit-logs/user/:userId       | User logs     |
| GET    | /api/audit-logs/resource/:type/:id | Resource logs |

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

| Component  | Coverage |
| ---------- | -------- |
| Models     | 80%      |
| Middleware | 69%      |
| Routes     | 92%      |
| **Total**  | **24%**  |

### Test Suites

- **Models**: User, Project, Task, DWGFile, Mapping, AuditLog
- **Middleware**: Authentication, RBAC
- **Controllers**: Auth registration

## Development

```bash
# Start development server
npm run dev

# Start production server
npm start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## Project Structure

```
src/
├── config/           # Database configuration
├── controllers/     # API request handlers
├── middleware/      # Express middleware (auth, rbac)
├── models/           # Database models
├── public/          # Static frontend (HTML, JS, CSS)
├── routes/          # Route definitions
└── server.js       # Entry point

tests/
├── controllers/     # Controller tests
├── models/          # Model tests
└── __mocks__/      # Database mocks

spec/                # API specifications
```

## Features

- [x] Project Management
- [x] Task Management
- [x] DWG File Upload
- [x] DWG-to-Task Mapping
- [x] JWT Authentication
- [x] Audit Logging
- [x] RBAC (Admin, PM, Operativo, Cliente)
- [x] Multi-user project assignment
- [x] Disableable Registration
- [x] Built-in Web UI

## Documentation

| File             | Description        |
| ---------------- | ------------------ |
| spec/SPEC.md     | Main specification |
| spec/AUTH.md     | Authentication API |
| spec/PROJECTS.md | Project API        |
| spec/TASKS.md    | Task API           |
| spec/DWG.md      | DWG file API       |
| spec/MAPPINGS.md | Mapping API        |
| spec/AUDIT.md    | Audit API          |
| spec/RBAC.md     | RBAC specification |

## GitHub Best Practices

- Use `credentials.yaml.example` as template for local configuration
- Never commit `credentials.yaml` or `.env` files
- Keep dependencies updated with `npm audit fix`
- Run linting before commits: `npm run lint`

## License

MIT
