const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const UserModel = {
  create(email, password, role = "user") {
    const id = uuidv4();
    const stmt = db.prepare(
      "INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)",
    );
    stmt.run(id, email, password, role);
    return { id, email, role };
  },

  findByEmail(email) {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email);
  },

  findById(id) {
    const stmt = db.prepare(
      "SELECT id, email, role, created_at FROM users WHERE id = ?",
    );
    return stmt.get(id);
  },

  findAll() {
    const stmt = db.prepare("SELECT id, email, role, created_at FROM users");
    return stmt.all();
  },

  update(id, updates) {
    const { email, role } = updates;
    const stmt = db.prepare(
      "UPDATE users SET email = ?, role = ? WHERE id = ?",
    );
    return stmt.run(email, role, id);
  },

  delete(id) {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    return stmt.run(id);
  },
};

module.exports = UserModel;
