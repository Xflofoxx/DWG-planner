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
  ) {
    const id = uuidv4();
    const stmt = db.prepare(
      "INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)",
    );
    stmt.run(id, projectId, title, description, status, priority, assignedTo);
    return {
      id,
      project_id: projectId,
      title,
      description,
      status,
      priority,
      assigned_to: assignedTo,
    };
  },

  findById(id) {
    const stmt = db.prepare(
      "SELECT t.*, u.email as assigned_email FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.id = ?",
    );
    return stmt.get(id);
  },

  findByProject(projectId) {
    const stmt = db.prepare(
      "SELECT t.*, u.email as assigned_email FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.project_id = ? ORDER BY t.created_at DESC",
    );
    return stmt.all(projectId);
  },

  findAll() {
    const stmt = db.prepare(
      "SELECT t.*, u.email as assigned_email FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id ORDER BY t.created_at DESC",
    );
    return stmt.all();
  },

  findByUser(userId) {
    const stmt = db.prepare(
      "SELECT t.*, u.email as assigned_email FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.assigned_to = ? ORDER BY t.created_at DESC",
    );
    return stmt.all(userId);
  },

  update(id, updates) {
    const { title, description, status, priority, assigned_to } = updates;
    const stmt = db.prepare(
      "UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status), priority = COALESCE(?, priority), assigned_to = COALESCE(?, assigned_to), updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    );
    return stmt.run(title, description, status, priority, assigned_to, id);
  },

  delete(id) {
    const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
    return stmt.run(id);
  },
};

module.exports = TaskModel;
