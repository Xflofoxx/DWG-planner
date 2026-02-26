const Project = require("../models/Project");
const AuditLog = require("../models/AuditLog");

const ProjectController = {
  async create(req, res) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Project name is required" });
      }

      const project = await Project.create(name, description || "");

      if (req.user) {
        await AuditLog.create(
          req.user.userId,
          "CREATE",
          "project",
          project.id,
          { name },
        );
      }

      res.status(201).json(project);
    } catch (error) {
      console.error("Create project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAll(req, res) {
    try {
      const projects = await Project.findAll();
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const existing = await Project.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "Project not found" });
      }

      await Project.update(id, { name, description });

      if (req.user) {
        await AuditLog.create(req.user.userId, "UPDATE", "project", id, {
          name,
          description,
        });
      }

      res.json({ message: "Project updated successfully" });
    } catch (error) {
      console.error("Update project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const existing = await Project.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "Project not found" });
      }

      await Project.delete(id);

      if (req.user) {
        await AuditLog.create(req.user.userId, "DELETE", "project", id, {
          name: existing.name,
        });
      }

      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = ProjectController;
