const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const MilestoneModel = {
  create(projectId, name, date, description = null) {
    const id = uuidv4();
    const stmt = db.prepare(
      "INSERT INTO milestones (id, project_id, name, description, date) VALUES (?, ?, ?, ?, ?)",
    );
    stmt.run(id, projectId, name, description, date);
    return {
      id,
      project_id: projectId,
      name,
      description,
      date,
      status: "pending",
    };
  },

  findById(id) {
    const stmt = db.prepare("SELECT * FROM milestones WHERE id = ?");
    return stmt.get(id);
  },

  findByProject(projectId) {
    const stmt = db.prepare(
      "SELECT * FROM milestones WHERE project_id = ? ORDER BY date ASC",
    );
    return stmt.all(projectId);
  },

  findAll() {
    const stmt = db.prepare("SELECT * FROM milestones ORDER BY date ASC");
    return stmt.all();
  },

  update(id, updates) {
    const { name, description, date, status } = updates;
    const stmt = db.prepare(
      "UPDATE milestones SET name = ?, description = ?, date = ?, status = ? WHERE id = ?",
    );
    return stmt.run(name, description, date, status, id);
  },

  updateStatus(id, status) {
    const stmt = db.prepare("UPDATE milestones SET status = ? WHERE id = ?");
    return stmt.run(status, id);
  },

  delete(id) {
    const stmt = db.prepare("DELETE FROM milestones WHERE id = ?");
    return stmt.run(id);
  },

  getUpcoming(limit = 5) {
    const stmt = db.prepare(`
      SELECT m.*, p.name as project_name 
      FROM milestones m 
      JOIN projects p ON m.project_id = p.id 
      WHERE m.date >= date('now') AND m.status != 'completed'
      ORDER BY m.date ASC 
      LIMIT ?
    `);
    return stmt.all(limit);
  },
};

module.exports = MilestoneModel;
