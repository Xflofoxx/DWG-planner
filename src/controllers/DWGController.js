const DWGFile = require("../models/DWGFile");
const AuditLog = require("../models/AuditLog");

const DWGController = {
  async create(req, res) {
    try {
      const { project_id, name, version, size, mime_type } = req.body;

      if (!name || !project_id) {
        return res
          .status(400)
          .json({ message: "Name and project_id are required" });
      }

      const dwgFile = await DWGFile.create(
        project_id,
        name,
        version || "1.0",
        size || 0,
        mime_type || "application/acad",
      );

      if (req.user) {
        await AuditLog.create(req.user.userId, "UPLOAD", "dwg", dwgFile.id, {
          name,
          project_id,
        });
      }

      res.status(201).json(dwgFile);
    } catch (error) {
      console.error("Create DWG error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAll(req, res) {
    try {
      const dwgFiles = await DWGFile.findAll();
      res.json(dwgFiles);
    } catch (error) {
      console.error("Get DWG files error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getByProject(req, res) {
    try {
      const { projectId } = req.params;
      const dwgFiles = await DWGFile.findByProject(projectId);
      res.json(dwgFiles);
    } catch (error) {
      console.error("Get DWG files by project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const dwgFile = await DWGFile.findById(id);

      if (!dwgFile) {
        return res.status(404).json({ message: "DWG file not found" });
      }

      res.json(dwgFile);
    } catch (error) {
      console.error("Get DWG file error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, version } = req.body;

      const existing = await DWGFile.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "DWG file not found" });
      }

      await DWGFile.update(id, { name, version });

      if (req.user) {
        await AuditLog.create(req.user.userId, "UPDATE", "dwg", id, {
          name,
          version,
        });
      }

      res.json({ message: "DWG file updated successfully" });
    } catch (error) {
      console.error("Update DWG error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const existing = await DWGFile.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "DWG file not found" });
      }

      await DWGFile.delete(id);

      if (req.user) {
        await AuditLog.create(req.user.userId, "DELETE", "dwg", id, {
          name: existing.name,
        });
      }

      res.json({ message: "DWG file deleted successfully" });
    } catch (error) {
      console.error("Delete DWG error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = DWGController;
