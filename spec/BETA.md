# DWG Planner - Beta Specification

> **Version**: 1.0.0-beta  
> **Status**: Implementation Ready

## 1. Overview

DWG Planner is a comprehensive project management application for construction and engineering projects with DWG file support, task management, and DWG-to-task mapping.

## 2. User Roles

| Role      | Description          | Dashboard Access                    |
| --------- | -------------------- | ----------------------------------- |
| admin     | System administrator | Full access                         |
| pm        | Project Manager      | Full project management             |
| operativo | Field Worker         | Task updates, DWG view              |
| cliente   | Client               | Read-only, DWG + task visualization |

## 3. Dashboard Views

### 3.1 PM/Admin Dashboard

- Project overview with stats
- Recent activity
- Task summary by status
- Upcoming deadlines
- Quick actions

### 3.2 Cliente Dashboard

- Project selection dropdown
- DWG file browser
- Component/Layer selector
- Associated tasks display
- Task status visualization

## 4. Task Views

### 4.1 Kanban Board

- Columns: Da Fare, In Lavorazione, In Revisione, Completato
- Drag and drop between columns
- Task cards with: title, assignee, priority, due date
- Filter by: assignee, priority, date range

### 4.2 List View

- Sortable table columns
- Columns: Task, Project, Assignee, Priority, Status, Due Date, Progress
- Bulk actions
- Export functionality

### 4.3 Gantt Chart

- Timeline visualization
- Task bars with duration
- Dependencies visualization
- Milestone markers
- Zoom: Day, Week, Month

### 4.4 Calendar View

- Month/Week/Day views
- Tasks displayed on due dates
- Color coding by status/priority
- Click to create task

## 5. Data Models

### 5.1 Project Enhancements

```sql
ALTER TABLE projects ADD COLUMN start_date DATE;
ALTER TABLE projects ADD COLUMN end_date DATE;
ALTER TABLE projects ADD COLUMN status TEXT DEFAULT 'planning';
ALTER TABLE projects ADD COLUMN progress INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN color TEXT;
```

### 5.2 Task Enhancements

```sql
ALTER TABLE tasks ADD COLUMN start_date DATE;
ALTER TABLE tasks ADD COLUMN due_date DATE;
ALTER TABLE tasks ADD COLUMN progress INTEGER DEFAULT 0;
ALTER TABLE tasks ADD COLUMN tags TEXT;
ALTER TABLE tasks ADD COLUMN dependencies TEXT;
```

### 5.3 Milestones

```sql
CREATE TABLE milestones (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  name TEXT NOT NULL,
  date DATE,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 6. API Endpoints

### Projects

- `GET /api/projects` - List with pagination
- `POST /api/projects` - Create
- `GET /api/projects/:id` - Get with stats
- `PUT /api/projects/:id` - Update
- `DELETE /api/projects/:id` - Delete
- `GET /api/projects/:id/stats` - Project statistics
- `GET /api/projects/:id/milestones` - Project milestones
- `POST /api/projects/:id/milestones` - Create milestone

### Tasks

- `GET /api/tasks?view=kanban|list|gantt|calendar` - List with view
- `GET /api/tasks/kanban` - Kanban data
- `GET /api/tasks/gantt` - Gantt data
- `PUT /api/tasks/:id/status` - Update status
- `PUT /api/tasks/:id/progress` - Update progress

### Dashboard

- `GET /api/dashboard/stats` - Overall stats
- `GET /api/dashboard/activity` - Recent activity

## 7. UI Components

### Navigation

- Collapsible sidebar
- Role-based menu items
- Quick search

### Task Card

- Title and description preview
- Assignee avatar
- Priority indicator (color coded)
- Due date with overdue warning
- Progress bar
- Tags
- Comment count indicator

### DWG Viewer Panel

- File list with thumbnails
- Layer filter
- Component selector
- Zoom controls (placeholder for future)

## 8. Acceptance Criteria

- [ ] User can login with different roles
- [ ] PM sees full dashboard with all projects
- [ ] Cliente sees only assigned projects
- [ ] Kanban board allows drag and drop
- [ ] List view is sortable
- [ ] Gantt shows timeline with tasks
- [ ] Calendar shows tasks on dates
- [ ] Cliente can select DWG and see associated tasks
- [ ] Pagination works on all lists
- [ ] 70+ tests passing
