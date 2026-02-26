const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const db = require("./config/database");
const authRoutes = require("./routes/auth");
const dwgRoutes = require("./routes/dwg");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");
const mappingRoutes = require("./routes/mappings");
const auditLogRoutes = require("./routes/auditLogs");
const projectUsersRoutes = require("./routes/projectUsers");
const authMiddleware = require("./middleware/auth");
const { initDemoUser } = require("./scripts/init-demo");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/dwg", dwgRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/mappings", mappingRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/project-users", projectUsersRoutes);

app.get("/", (req, res) => {
  res.json({ message: "DWG Planner MVP API is running" });
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await initDemoUser();
  } catch (err) {
    console.error("Failed to initialize demo user:", err);
  }
});

module.exports = app;
