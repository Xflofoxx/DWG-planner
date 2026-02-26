const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const ProjectModel = {
  create(name, description = "") {
    const id = uuidv4();
    const stmt = db.prepare(
      "INSERT INTO projects (id, name, description) VALUES (?, ?, ?)",
    );
    stmt.run(id, name, description);
    return { id, name, description };
  },

  findById(id) {
    const stmt = db.prepare("SELECT * FROM projects WHERE id = ?");
    return stmt.get(id);
  },

  findAll() {
    const stmt = db.prepare("SELECT * FROM projects ORDER BY created_at DESC");
    return stmt.all();
  },

  update(id, updates) {
    const { name, description } = updates;
    const stmt = db.prepare(
      "UPDATE projects SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    );
    return stmt.run(name, description, id);
  },

  delete(id) {
    const stmt = db.prepare("DELETE FROM projects WHERE id = ?");
    return stmt.run(id);
  },
};

module.exports = ProjectModel;
