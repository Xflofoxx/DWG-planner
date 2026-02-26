const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const DWGFileModel = {
  create(
    projectId,
    name,
    version = "1.0",
    size = 0,
    mimeType = "application/acad",
  ) {
    const id = uuidv4();
    const stmt = db.prepare(
      "INSERT INTO dwg_files (id, project_id, name, version, size, mime_type) VALUES (?, ?, ?, ?, ?, ?)",
    );
    stmt.run(id, projectId, name, version, size, mimeType);
    return {
      id,
      project_id: projectId,
      name,
      version,
      size,
      mime_type: mimeType,
    };
  },

  findById(id) {
    const stmt = db.prepare("SELECT * FROM dwg_files WHERE id = ?");
    return stmt.get(id);
  },

  findByProject(projectId) {
    const stmt = db.prepare(
      "SELECT * FROM dwg_files WHERE project_id = ? ORDER BY uploaded_at DESC",
    );
    return stmt.all(projectId);
  },

  findAll() {
    const stmt = db.prepare(
      "SELECT * FROM dwg_files ORDER BY uploaded_at DESC",
    );
    return stmt.all();
  },

  update(id, updates) {
    const { name, version } = updates;
    const stmt = db.prepare(
      "UPDATE dwg_files SET name = ?, version = ? WHERE id = ?",
    );
    return stmt.run(name, version, id);
  },

  delete(id) {
    const stmt = db.prepare("DELETE FROM dwg_files WHERE id = ?");
    return stmt.run(id);
  },
};

module.exports = DWGFileModel;
