const Task = require("../models/Task");
const AuditLog = require("../models/AuditLog");

const TaskController = {
  async create(req, res) {
    try {
      const { project_id, title, description, status, priority, assigned_to } =
        req.body;

      if (!title || !project_id) {
        return res
          .status(400)
          .json({ message: "Title and project_id are required" });
      }

      const task = await Task.create(
        project_id,
        title,
        description || "",
        status || "pending",
        priority || "medium",
        assigned_to,
      );

      if (req.user) {
        await AuditLog.create(req.user.userId, "CREATE", "task", task.id, {
          title,
          project_id,
        });
      }

      res.status(201).json(task);
    } catch (error) {
      console.error("Create task error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAll(req, res) {
    try {
      const { project_id } = req.query;

      let tasks;
      if (project_id) {
        tasks = await Task.findByProject(project_id);
      } else {
        tasks = await Task.findAll();
      }

      res.json(tasks);
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json(task);
    } catch (error) {
      console.error("Get task error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, status, priority, assigned_to } = req.body;

      const existing = await Task.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "Task not found" });
      }

      await Task.update(id, {
        title,
        description,
        status,
        priority,
        assigned_to,
      });

      if (req.user) {
        await AuditLog.create(req.user.userId, "UPDATE", "task", id, {
          title,
          status,
          priority,
        });
      }

      res.json({ message: "Task updated successfully" });
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const existing = await Task.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "Task not found" });
      }

      await Task.delete(id);

      if (req.user) {
        await AuditLog.create(req.user.userId, "DELETE", "task", id, {
          title: existing.title,
        });
      }

      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getByUser(req, res) {
    try {
      const { userId } = req.params;
      const tasks = await Task.findByUser(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Get tasks by user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = TaskController;
