const express = require("express");
const router = express.Router();
const ProjectUser = require("../models/ProjectUser");
const User = require("../models/User");
const Project = require("../models/Project");
const { requireRole } = require("../middleware/rbac");

router.get(
  "/project/:projectId/users",
  requireRole("admin", "pm"),
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const users = await ProjectUser.findByProject(projectId);
      res.json(users);
    } catch (error) {
      console.error("Error fetching project users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.post(
  "/project/:projectId/users",
  requireRole("admin", "pm"),
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const { userId, role } = req.body;

      if (!userId || !role) {
        return res
          .status(400)
          .json({ message: "userId and role are required" });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const existing = await ProjectUser.findByProjectAndUser(
        projectId,
        userId,
      );
      if (existing) {
        return res
          .status(409)
          .json({ message: "User already assigned to this project" });
      }

      const assignment = await ProjectUser.create(
        projectId,
        userId,
        role,
        req.user?.userId,
      );

      res.status(201).json(assignment);
    } catch (error) {
      console.error("Error adding user to project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.put(
  "/project/:projectId/users/:userId",
  requireRole("admin", "pm"),
  async (req, res) => {
    try {
      const { projectId, userId } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({ message: "role is required" });
      }

      const existing = await ProjectUser.findByProjectAndUser(
        projectId,
        userId,
      );
      if (!existing) {
        return res
          .status(404)
          .json({ message: "User not assigned to this project" });
      }

      await ProjectUser.updateRole(projectId, userId, role);
      res.json({ message: "User role updated successfully" });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.delete(
  "/project/:projectId/users/:userId",
  requireRole("admin", "pm"),
  async (req, res) => {
    try {
      const { projectId, userId } = req.params;

      const existing = await ProjectUser.findByProjectAndUser(
        projectId,
        userId,
      );
      if (!existing) {
        return res
          .status(404)
          .json({ message: "User not assigned to this project" });
      }

      await ProjectUser.delete(projectId, userId);
      res.json({ message: "User removed from project successfully" });
    } catch (error) {
      console.error("Error removing user from project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.get("/user/:userId/projects", async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await ProjectUser.findByUser(userId);
    res.json(projects);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
