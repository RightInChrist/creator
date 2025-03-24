const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');

// GET all tools
router.get('/', toolController.getAllTools);

// GET tool by ID
router.get('/:id', toolController.getToolById);

// POST create new tool
router.post('/', toolController.createTool);

// PUT update tool
router.put('/:id', toolController.updateTool);

// DELETE tool
router.delete('/:id', toolController.deleteTool);

// POST execute tool
router.post('/:id/execute', toolController.executeTool);

module.exports = router; 