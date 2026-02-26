const express = require('express');
const router = express.Router();
const { ProjectController } = require('../controllers');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, ProjectController.create);
router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);
router.put('/:id', authMiddleware, ProjectController.update);
router.delete('/:id', authMiddleware, ProjectController.delete);

module.exports = router;