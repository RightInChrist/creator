const express = require('express');
const taskTemplateController = require('../controllers/taskTemplateController');

const router = express.Router();

// GET all task templates
router.get('/', taskTemplateController.getAllTemplates);

// GET task template by ID
router.get('/:id', taskTemplateController.getTemplateById);

// POST create new task template
router.post('/', taskTemplateController.createTemplate);

// POST generate tasks from template
router.post('/:id/generate', taskTemplateController.generateTasksFromTemplate);

// PUT update task template
router.put('/:id', taskTemplateController.updateTemplate);

// DELETE task template
router.delete('/:id', taskTemplateController.deleteTemplate);

module.exports = router; 