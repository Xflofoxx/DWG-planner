const express = require('express');
const router = express.Router();
const { DWGController } = require('../controllers');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, DWGController.create);
router.get('/', DWGController.getAll);
router.get('/project/:projectId', DWGController.getByProject);
router.get('/:id', DWGController.getById);
router.put('/:id', authMiddleware, DWGController.update);
router.delete('/:id', authMiddleware, DWGController.delete);

module.exports = router;