const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const bcrypt = require("bcryptjs");

const db = require("./config/database");

function loadConfig() {
  const configPath = path.join(__dirname, "..", "config.yaml");
  const configFile = fs.readFileSync(configPath, "utf8");
  return yaml.parse(configFile);
}

function initDemoUser() {
  const config = loadConfig();
  const { admin_email, admin_password } = config.demo;

  if (!admin_email || !admin_password) {
    console.log("Demo user configuration not found in config.yaml");
    return;
  }

  return new Promise((resolve, reject) => {
    db.prepare("SELECT * FROM users WHERE email = ?").get(
      admin_email,
      (err, user) => {
        if (err) {
          console.error("Error checking for demo user:", err);
          reject(err);
          return;
        }

        if (user) {
          console.log("Demo admin user already exists");
          resolve(user);
          return;
        }

        const id = require("uuid").v4();
        const hashedPassword = bcrypt.hashSync(admin_password, 12);

        db.prepare(
          "INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)",
        ).run(id, admin_email, hashedPassword, "admin", (insertErr) => {
          if (insertErr) {
            console.error("Error creating demo user:", insertErr);
            reject(insertErr);
            return;
          }

          console.log(`Demo admin user created: ${admin_email}`);
          resolve({ id, email: admin_email, role: "admin" });
        });
      },
    );
  });
}

if (require.main === module) {
  initDemoUser()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { initDemoUser, loadConfig };
