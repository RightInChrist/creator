const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

// GET all tasks
router.get('/', taskController.getAllTasks);

// GET task by ID
router.get('/:id', taskController.getTaskById);

// POST create new task
router.post('/', taskController.createTask);

// PUT update task
router.put('/:id', taskController.updateTask);

// DELETE task
router.delete('/:id', taskController.deleteTask);

module.exports = router; 