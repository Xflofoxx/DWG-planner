const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const ProjectModel = {
  create(name, description = "", startDate = null, endDate = null) {
    const id = uuidv4();
    const stmt = db.prepare(
      "INSERT INTO projects (id, name, description, start_date, end_date, status, progress) VALUES (?, ?, ?, ?, ?, 'planning', 0)",
    );
    stmt.run(id, name, description, startDate, endDate);
    return {
      id,
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      status: "planning",
      progress: 0,
    };
  },

  findById(id) {
    const stmt = db.prepare("SELECT * FROM projects WHERE id = ?");
    return stmt.get(id);
  },

  findAll() {
    const stmt = db.prepare("SELECT * FROM projects ORDER BY created_at DESC");
    return stmt.all();
  },

  findAllPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const stmt = db.prepare(
      "SELECT * FROM projects ORDER BY created_at DESC LIMIT ? OFFSET ?",
    );
    return stmt.all(limit, offset);
  },

  getTotalCount() {
    const stmt = db.prepare("SELECT COUNT(*) as count FROM projects");
    return stmt.get();
  },

  getStats(id) {
    const project = this.findById(id);
    if (!project) return null;

    const tasksStmt = db.prepare(
      "SELECT status, COUNT(*) as count FROM tasks WHERE project_id = ? GROUP BY status",
    );
    const tasks = tasksStmt.all(id);

    const dwgStmt = db.prepare(
      "SELECT COUNT(*) as count FROM dwg_files WHERE project_id = ?",
    );
    const dwgCount = dwgStmt.get(id);

    const mappingStmt = db.prepare(
      "SELECT COUNT(*) as count FROM mappings m JOIN dwg_files d ON m.dwg_file_id = d.id WHERE d.project_id = ?",
    );
    const mappingCount = mappingStmt.get(id);

    const taskStmt = db.prepare(
      "SELECT COUNT(*) as total, AVG(progress) as avg_progress FROM tasks WHERE project_id = ?",
    );
    const taskStats = taskStmt.get(id);

    return {
      project,
      tasks: tasks.reduce((acc, t) => ({ ...acc, [t.status]: t.count }), {}),
      totalTasks: tasks.reduce((acc, t) => acc + t.count, 0),
      dwgCount: dwgCount.count,
      mappingCount: mappingCount.count,
      avgProgress: taskStats.avg_progress || 0,
    };
  },

  update(id, updates) {
    const { name, description, start_date, end_date, status, progress, color } =
      updates;
    const stmt = db.prepare(
      "UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ?, status = ?, progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    );
    return stmt.run(
      name,
      description,
      start_date,
      end_date,
      status,
      progress || 0,
      id,
    );
  },

  delete(id) {
    const stmt = db.prepare("DELETE FROM projects WHERE id = ?");
    return stmt.run(id);
  },
};

module.exports = ProjectModel;
