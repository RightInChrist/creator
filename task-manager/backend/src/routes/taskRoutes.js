const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

// GET all tasks
router.get('/', taskController.getAllTasks);

// GET task by ID
router.get('/:id', taskController.getTaskById);

// GET related tasks for a specific task
router.get('/:id/related', taskController.getRelatedTasks);

// POST create new task
router.post('/', taskController.createTask);

// POST link tasks
router.post('/:id/link', taskController.linkTasks);

// POST unlink tasks
router.post('/:id/unlink', taskController.unlinkTasks);

// PUT update task
router.put('/:id', taskController.updateTask);

// DELETE task
router.delete('/:id', taskController.deleteTask);

module.exports = router; 