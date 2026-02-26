const express = require('express');
const router = express.Router();
const { TaskController } = require('../controllers');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, TaskController.create);
router.get('/', TaskController.getAll);
router.get('/user/:userId', TaskController.getByUser);
router.get('/:id', TaskController.getById);
router.put('/:id', authMiddleware, TaskController.update);
router.delete('/:id', authMiddleware, TaskController.delete);

module.exports = router;