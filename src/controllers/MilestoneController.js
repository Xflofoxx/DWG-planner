const Milestone = require("../models/Milestone");
const AuditLog = require("../models/AuditLog");

const MilestoneController = {
  async getAll(req, res) {
    try {
      const milestones = Milestone.findAll();
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getByProject(req, res) {
    try {
      const { projectId } = req.params;
      const milestones = Milestone.findByProject(projectId);
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching project milestones:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const milestone = Milestone.findById(id);
      if (!milestone) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      res.json(milestone);
    } catch (error) {
      console.error("Error fetching milestone:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async create(req, res) {
    try {
      const { project_id, name, description, date } = req.body;
      if (!project_id || !name || !date) {
        return res
          .status(400)
          .json({ message: "project_id, name and date are required" });
      }
      const milestone = Milestone.create(project_id, name, date, description);

      if (req.user) {
        await AuditLog.create(
          req.user.userId,
          "CREATE",
          "milestone",
          milestone.id,
          JSON.stringify({ name, date }),
        );
      }

      res.status(201).json(milestone);
    } catch (error) {
      console.error("Error creating milestone:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, date, status } = req.body;

      const existing = Milestone.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "Milestone not found" });
      }

      await Milestone.update(id, { name, description, date, status });

      if (req.user) {
        await AuditLog.create(
          req.user.userId,
          "UPDATE",
          "milestone",
          id,
          JSON.stringify({ name, date, status }),
        );
      }

      res.json({ message: "Milestone updated successfully" });
    } catch (error) {
      console.error("Error updating milestone:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const existing = Milestone.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "Milestone not found" });
      }

      await Milestone.delete(id);

      if (req.user) {
        await AuditLog.create(
          req.user.userId,
          "DELETE",
          "milestone",
          id,
          JSON.stringify({ name: existing.name }),
        );
      }

      res.json({ message: "Milestone deleted successfully" });
    } catch (error) {
      console.error("Error deleting milestone:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = MilestoneController;
