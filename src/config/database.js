const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..\\data\\dwg-planner.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT DEFAULT 'user', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS dwg_files (id TEXT PRIMARY KEY, project_id TEXT, name TEXT NOT NULL, version TEXT, uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP, size INTEGER, mime_type TEXT, file_path TEXT)`,
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, project_id TEXT, title TEXT NOT NULL, description TEXT, status TEXT DEFAULT 'pending', priority TEXT DEFAULT 'medium', assigned_to TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS mappings (id TEXT PRIMARY KEY, dwg_file_id TEXT, layer TEXT, handle TEXT, tag TEXT, task_field TEXT, planning_field TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS audit_logs (id TEXT PRIMARY KEY, user_id TEXT, action TEXT NOT NULL, resource_type TEXT, resource_id TEXT, details TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS project_users (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP, assigned_by TEXT, FOREIGN KEY (project_id) REFERENCES projects(id), FOREIGN KEY (user_id) REFERENCES users(id), UNIQUE(project_id, user_id))`,
  );
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_dwg_project ON dwg_files(project_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id)`);
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_project_users_project ON project_users(project_id)`,
  );
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_project_users_user ON project_users(user_id)`,
  );
});

const wrapper = {
  prepare: (sql) => ({
    run: (...args) => {
      return new Promise((resolve, reject) => {
        db.run(sql, args, function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes || 0 });
        });
      });
    },
    get: (...args) => {
      return new Promise((resolve, reject) => {
        db.get(sql, args, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    },
    all: (...args) => {
      return new Promise((resolve, reject) => {
        db.all(sql, args, (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      });
    },
  }),
};

module.exports = wrapper;
