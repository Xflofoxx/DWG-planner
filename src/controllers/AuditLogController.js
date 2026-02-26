const AuditLog = require("../models/AuditLog");

const AuditLogController = {
  async getAll(req, res) {
    try {
      const { limit } = req.query;
      const logs = await AuditLog.findAll(limit ? parseInt(limit) : 100);
      res.json(logs);
    } catch (error) {
      console.error("Get audit logs error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getByUser(req, res) {
    try {
      const { userId } = req.params;
      const { limit } = req.query;
      const logs = await AuditLog.findByUser(
        userId,
        limit ? parseInt(limit) : 50,
      );
      res.json(logs);
    } catch (error) {
      console.error("Get audit logs by user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getByResource(req, res) {
    try {
      const { resourceType, resourceId } = req.params;
      const logs = await AuditLog.findByResource(resourceType, resourceId);
      res.json(logs);
    } catch (error) {
      console.error("Get audit logs by resource error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = AuditLogController;
