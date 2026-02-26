const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const AuditLogModel = {
  create(userId, action, resourceType, resourceId, details = {}) {
    const id = uuidv4();
    const stmt = db.prepare(
      "INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details) VALUES (?, ?, ?, ?, ?, ?)",
    );
    stmt.run(
      id,
      userId,
      action,
      resourceType,
      resourceId,
      JSON.stringify(details),
    );
    return {
      id,
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
    };
  },

  findById(id) {
    const stmt = db.prepare("SELECT * FROM audit_logs WHERE id = ?");
    return stmt.get(id);
  },

  findByUser(userId, limit = 50) {
    const stmt = db.prepare(
      "SELECT * FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
    );
    return stmt.all(userId, limit);
  },

  findAll(limit = 100) {
    const stmt = db.prepare(
      "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?",
    );
    return stmt.all(limit);
  },

  findByResource(resourceType, resourceId) {
    const stmt = db.prepare(
      "SELECT * FROM audit_logs WHERE resource_type = ? AND resource_id = ? ORDER BY created_at DESC",
    );
    return stmt.all(resourceType, resourceId);
  },
};

module.exports = AuditLogModel;
