# DWG Planner MVP

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Run tests:
```bash
npm test
```

## Project Structure

- `src/` - Main source code
- `src/models/` - Database models and schemas
- `src/controllers/` - Request handlers
- `src/routes/` - API route definitions
- `src/middleware/` - Express middleware
- `src/services/` - Business logic
- `src/utils/` - Utility functions
- `src/config/` - Configuration files
- `src/public/` - Static assets
- `src/views/` - HTML templates

## API Endpoints

- `GET /api/auth` - Authentication routes
- `GET /api/dwg` - DWG file management
- `GET /api/projects` - Project management
- `GET /api/tasks` - Task management

## Database

Uses SQLite with Better-SQLite3 for local development. Database file: `data/dwg-planner.db`

## Testing

Tests are written with Jest and Supertest. Run with:
```bash
npm test
```

## Linting

ESLint and Prettier are configured for code formatting:
```bash
npm run lint
npm run lint:fix
```

## Environment Variables

Create `.env` file with:
```
PORT=3000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## MVP Features

- DWG File Ingestion
- DWG Mapping Editor
- Task Management
- Project Management
- Authentication
- Audit Logging
- Access Control

## Deployment

For production, ensure:
- Environment variables are set
- Database is initialized
- Static assets are served correctly
- Security headers are enabled