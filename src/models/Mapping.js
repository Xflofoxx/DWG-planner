const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const MappingModel = {
  create(dwgFileId, layer, handle, tag, taskField, planningField) {
    const id = uuidv4();
    const stmt = db.prepare(
      "INSERT INTO mappings (id, dwg_file_id, layer, handle, tag, task_field, planning_field) VALUES (?, ?, ?, ?, ?, ?, ?)",
    );
    stmt.run(id, dwgFileId, layer, handle, tag, taskField, planningField);
    return {
      id,
      dwg_file_id: dwgFileId,
      layer,
      handle,
      tag,
      task_field: taskField,
      planning_field: planningField,
    };
  },

  findById(id) {
    const stmt = db.prepare("SELECT * FROM mappings WHERE id = ?");
    return stmt.get(id);
  },

  findByDwgFile(dwgFileId) {
    const stmt = db.prepare(
      "SELECT * FROM mappings WHERE dwg_file_id = ? ORDER BY created_at DESC",
    );
    return stmt.all(dwgFileId);
  },

  findAll() {
    const stmt = db.prepare("SELECT * FROM mappings ORDER BY created_at DESC");
    return stmt.all();
  },

  update(id, updates) {
    const { layer, handle, tag, task_field, planning_field } = updates;
    const stmt = db.prepare(
      "UPDATE mappings SET layer = COALESCE(?, layer), handle = COALESCE(?, handle), tag = COALESCE(?, tag), task_field = COALESCE(?, task_field), planning_field = COALESCE(?, planning_field) WHERE id = ?",
    );
    return stmt.run(layer, handle, tag, task_field, planning_field, id);
  },

  delete(id) {
    const stmt = db.prepare("DELETE FROM mappings WHERE id = ?");
    return stmt.run(id);
  },
};

module.exports = MappingModel;
