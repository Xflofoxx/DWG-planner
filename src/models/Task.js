const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const TaskModel = {
  create(
    projectId,
    title,
    description = "",
    status = "pending",
    priority = "medium",
    assignedTo = null,
    startDate = null,
    dueDate = null,
    tags = null,
  ) {
    const id = uuidv4();
    const stmt = db.prepare(
      "INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, start_date, due_date, tags, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)",
    );
    stmt.run(
      id,
      projectId,
      title,
      description,
      status,
      priority,
      assignedTo,
      startDate,
      dueDate,
      tags,
    );
    return {
      id,
      project_id: projectId,
      title,
      description,
      status,
      priority,
      assigned_to: assignedTo,
      start_date: startDate,
      due_date: dueDate,
      tags,
      progress: 0,
    };
  },

  findById(id) {
    const stmt = db.prepare(
      "SELECT t.*, u.email as assigned_email, p.name as project_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id LEFT JOIN projects p ON t.project_id = p.id WHERE t.id = ?",
    );
    return stmt.get(id);
  },

  findByProject(projectId) {
    const stmt = db.prepare(
      "SELECT t.*, u.email as assigned_email FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.project_id = ? ORDER BY t.due_date ASC, t.priority DESC",
    );
    return stmt.all(projectId);
  },

  findAll() {
    const stmt = db.prepare(
      "SELECT t.*, u.email as assigned_email, p.name as project_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id LEFT JOIN projects p ON t.project_id = p.id ORDER BY t.due_date ASC, t.priority DESC",
    );
    return stmt.all();
  },

  findAllPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const stmt = db.prepare(
      "SELECT t.*, u.email as assigned_email, p.name as project_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id LEFT JOIN projects p ON t.project_id = p.id ORDER BY t.due_date ASC LIMIT ? OFFSET ?",
    );
    return stmt.all(limit, offset);
  },

  getTotalCount() {
    const stmt = db.prepare("SELECT COUNT(*) as count FROM tasks");
    return stmt.get();
  },

  getKanbanByProject(projectId) {
    const stmt = db.prepare(
      "SELECT t.*, u.email as assigned_email FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.project_id = ? ORDER BY t.priority DESC",
    );
    const tasks = stmt.all(projectId);

    const columns = {
      pending: [],
      in_progress: [],
      in_review: [],
      completed: [],
    };

    tasks.forEach((task) => {
      if (columns[task.status]) {
        columns[task.status].push(task);
      } else {
        columns.pending.push(task);
      }
    });

    return columns;
  },

  getByStatus(status) {
    const stmt = db.prepare(
      "SELECT t.*, u.email as assigned_email, p.name as project_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id LEFT JOIN projects p ON t.project_id = p.id WHERE t.status = ? ORDER BY t.due_date ASC",
    );
    return stmt.all(status);
  },

  getGanttData(projectId) {
    const stmt = db.prepare(
      "SELECT t.id, t.title, t.start_date, t.due_date, t.progress, t.status, t.priority, p.name as project_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.project_id = ? AND t.start_date IS NOT NULL AND t.due_date IS NOT NULL ORDER BY t.start_date ASC",
    );
    return stmt.all(projectId);
  },

  getCalendarData(projectId, startDate, endDate) {
    const stmt = db.prepare(
      "SELECT t.id, t.title, t.due_date, t.status, t.priority, t.progress, p.name as project_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.project_id = ? AND t.due_date BETWEEN ? AND ?",
    );
    return stmt.all(projectId, startDate, endDate);
  },

  findByUser(userId) {
    const stmt = db.prepare(
      "SELECT t.*, u.email as assigned_email FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.assigned_to = ? ORDER BY t.due_date ASC",
    );
    return stmt.all(userId);
  },

  update(id, updates) {
    const {
      title,
      description,
      status,
      priority,
      assigned_to,
      start_date,
      due_date,
      progress,
      tags,
      dependencies,
    } = updates;
    const stmt = db.prepare(
      "UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status), priority = COALESCE(?, priority), assigned_to = COALESCE(?, assigned_to), start_date = COALESCE(?, start_date), due_date = COALESCE(?, due_date), progress = COALESCE(?, progress), tags = COALESCE(?, tags), dependencies = COALESCE(?, dependencies), updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    );
    return stmt.run(
      title,
      description,
      status,
      priority,
      assigned_to,
      start_date,
      due_date,
      progress,
      tags,
      dependencies,
      id,
    );
  },

  updateStatus(id, status) {
    const stmt = db.prepare(
      "UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    );
    return stmt.run(status, id);
  },

  updateProgress(id, progress) {
    const stmt = db.prepare(
      "UPDATE tasks SET progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    );
    return stmt.run(progress, id);
  },

  delete(id) {
    const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
    return stmt.run(id);
  },
};

module.exports = TaskModel;
