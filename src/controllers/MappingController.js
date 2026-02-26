const Mapping = require("../models/Mapping");
const AuditLog = require("../models/AuditLog");

const MappingController = {
  async create(req, res) {
    try {
      const { dwg_file_id, layer, handle, tag, task_field, planning_field } =
        req.body;

      if (!dwg_file_id || !task_field) {
        return res
          .status(400)
          .json({ message: "dwg_file_id and task_field are required" });
      }

      const mapping = await Mapping.create(
        dwg_file_id,
        layer,
        handle,
        tag,
        task_field,
        planning_field,
      );

      if (req.user) {
        await AuditLog.create(
          req.user.userId,
          "CREATE",
          "mapping",
          mapping.id,
          { dwg_file_id, task_field },
        );
      }

      res.status(201).json(mapping);
    } catch (error) {
      console.error("Create mapping error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAll(req, res) {
    try {
      const { dwg_file_id } = req.query;

      let mappings;
      if (dwg_file_id) {
        mappings = await Mapping.findByDwgFile(dwg_file_id);
      } else {
        mappings = await Mapping.findAll();
      }

      res.json(mappings);
    } catch (error) {
      console.error("Get mappings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const mapping = await Mapping.findById(id);

      if (!mapping) {
        return res.status(404).json({ message: "Mapping not found" });
      }

      res.json(mapping);
    } catch (error) {
      console.error("Get mapping error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { layer, handle, tag, task_field, planning_field } = req.body;

      const existing = await Mapping.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "Mapping not found" });
      }

      await Mapping.update(id, {
        layer,
        handle,
        tag,
        task_field,
        planning_field,
      });

      if (req.user) {
        await AuditLog.create(req.user.userId, "UPDATE", "mapping", id, {
          task_field,
          planning_field,
        });
      }

      res.json({ message: "Mapping updated successfully" });
    } catch (error) {
      console.error("Update mapping error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const existing = await Mapping.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "Mapping not found" });
      }

      await Mapping.delete(id);

      if (req.user) {
        await AuditLog.create(req.user.userId, "DELETE", "mapping", id, {
          task_field: existing.task_field,
        });
      }

      res.json({ message: "Mapping deleted successfully" });
    } catch (error) {
      console.error("Delete mapping error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = MappingController;
