const express = require("express");
const router = express.Router();
const { MappingController } = require("../controllers");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, MappingController.create);
router.get("/", MappingController.getAll);
router.get("/:id", MappingController.getById);
router.put("/:id", authMiddleware, MappingController.update);
router.delete("/:id", authMiddleware, MappingController.delete);

module.exports = router;
