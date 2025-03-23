const express = require('express');
const taskTypeController = require('../controllers/taskTypeController');

const router = express.Router();

// GET all task types
router.get('/', taskTypeController.getAllTaskTypes);

// GET task type by ID
router.get('/:id', taskTypeController.getTaskTypeById);

// POST create new task type
router.post('/', taskTypeController.createTaskType);

// PUT update task type
router.put('/:id', taskTypeController.updateTaskType);

// DELETE task type
router.delete('/:id', taskTypeController.deleteTaskType);

module.exports = router; 