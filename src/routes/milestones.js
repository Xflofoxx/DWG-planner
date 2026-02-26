const express = require("express");
const router = express.Router();
const MilestoneController = require("../controllers/MilestoneController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

router.get("/", MilestoneController.getAll);
router.get("/project/:projectId", MilestoneController.getByProject);
router.get("/:id", MilestoneController.getById);
router.post("/", MilestoneController.create);
router.put("/:id", MilestoneController.update);
router.delete("/:id", MilestoneController.delete);

module.exports = router;
