# DWG Planner

DWG Planner is a web application for project management with DWG file support, task management, and DWG property-to-task mapping.

## Tech Stack

- **Backend**: Node.js 20.x + Express.js
- **Database**: SQLite
- **Frontend**: HTML/JS vanilla
- **Testing**: Jest + Supertest
- **Authentication**: JWT + bcrypt

## Quick Start

```bash
# Install dependencies
npm install

# Copy credentials template
cp credentials.yaml.example credentials.yaml

# Edit credentials.yaml with your values
# Then start server (creates demo admin user automatically)
npm start
```

## Configuration

### credentials.yaml

Sensitive configuration is stored in `credentials.yaml`:

```yaml
server:
  port: 3000
  env: development

security:
  jwt:
    secret: "your_secret_key"
    expiresIn: "7d"

database:
  path: "./src/data/dwg-planner.db"

demo:
  admin_email: "demo@dwgplanner.local"
  admin_password: "DemoAdmin2024!"
```

### config.yaml

General application configuration in `config.yaml`:

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

### Environment Variables

You can also use `.env` (variables override config.yaml):

```bash
PORT=3000
JWT_SECRET=your_secret
REGISTRATION_ENABLED=false
```

## Demo User

On first start, an admin user is automatically created:

- **Email**: demo@dwgplanner.local
- **Password**: DemoAdmin2024!

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registration (disabled by default)
- `GET /api/auth/profile` - User profile

### Projects

- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks

- `GET /api/tasks` - List tasks (supports ?project_id=)
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### DWG Files

- `GET /api/dwg` - List DWG files
- `POST /api/dwg` - Upload DWG file
- `GET /api/dwg/project/:projectId` - Project DWG files
- `GET /api/dwg/:id` - Get DWG file
- `PUT /api/dwg/:id` - Update DWG file
- `DELETE /api/dwg/:id` - Delete DWG file

### Mapping

- `GET /api/mappings` - List mappings
- `POST /api/mappings` - Create mapping
- `PUT /api/mappings/:id` - Update mapping
- `DELETE /api/mappings/:id` - Delete mapping

### Audit Log

- `GET /api/audit-logs` - List logs (authenticated)
- `GET /api/audit-logs/user/:userId` - User logs
- `GET /api/audit-logs/resource/:type/:id` - Resource logs

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Project Structure

```
src/
├── config/          # Database configuration
├── controllers/     # API request handlers
├── middleware/      # Express middleware (auth)
├── models/          # Database models
├── public/          # Static frontend
├── routes/          # Route definitions
└── server.js        # Entry point

tests/
├── controllers/     # Controller tests
├── models/          # Model tests
└── __mocks__/      # Database mocks

config.yaml          # General configuration
credentials.yaml    # Sensitive credentials
```

## MVP Features

- [x] Project Management
- [x] Task Management
- [x] DWG File Upload
- [x] DWG-to-Task Mapping
- [x] JWT Authentication
- [x] Audit Logging
- [x] User Roles (user, admin)
- [x] Disableable Registration
- [x] Built-in Web UI

## GitHub Best Practices

- Use `credentials.yaml.example` as template for local configuration
- Never commit `credentials.yaml` or `.env` files
- Keep dependencies updated with `npm audit fix`
- Run linting before commits: `npm run lint`

## License

MIT
