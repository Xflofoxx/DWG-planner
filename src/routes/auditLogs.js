const express = require("express");
const router = express.Router();
const { AuditLogController } = require("../controllers");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, AuditLogController.getAll);
router.get("/user/:userId", authMiddleware, AuditLogController.getByUser);
router.get(
  "/resource/:resourceType/:resourceId",
  authMiddleware,
  AuditLogController.getByResource,
);

module.exports = router;
