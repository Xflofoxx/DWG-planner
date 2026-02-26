const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const ProjectUserModel = {
  create(projectId, userId, role, assignedBy = null) {
    const id = uuidv4();
    const stmt = db.prepare(
      "INSERT INTO project_users (id, project_id, user_id, role, assigned_by) VALUES (?, ?, ?, ?, ?)",
    );
    stmt.run(id, projectId, userId, role, assignedBy);
    return { id, project_id: projectId, user_id: userId, role };
  },

  findByProject(projectId) {
    const stmt = db.prepare(`
      SELECT pu.*, u.email, u.role as user_default_role
      FROM project_users pu
      JOIN users u ON pu.user_id = u.id
      WHERE pu.project_id = ?
    `);
    return stmt.all(projectId);
  },

  findByUser(userId) {
    const stmt = db.prepare(`
      SELECT pu.*, p.name as project_name
      FROM project_users pu
      JOIN projects p ON pu.project_id = p.id
      WHERE pu.user_id = ?
    `);
    return stmt.all(userId);
  },

  findByProjectAndUser(projectId, userId) {
    const stmt = db.prepare(
      "SELECT * FROM project_users WHERE project_id = ? AND user_id = ?",
    );
    return stmt.get(projectId, userId);
  },

  updateRole(projectId, userId, role) {
    const stmt = db.prepare(
      "UPDATE project_users SET role = ? WHERE project_id = ? AND user_id = ?",
    );
    return stmt.run(role, projectId, userId);
  },

  delete(projectId, userId) {
    const stmt = db.prepare(
      "DELETE FROM project_users WHERE project_id = ? AND user_id = ?",
    );
    return stmt.run(projectId, userId);
  },

  isUserInProject(userId, projectId) {
    const stmt = db.prepare(
      "SELECT 1 FROM project_users WHERE user_id = ? AND project_id = ?",
    );
    return stmt.get(userId, projectId);
  },

  getUserRoleInProject(userId, projectId) {
    const assignment = this.findByProjectAndUser(projectId, userId);
    if (assignment) {
      return assignment.role;
    }
    const user = require("./User").findById(userId);
    return user ? user.role : null;
  },
};

module.exports = ProjectUserModel;
