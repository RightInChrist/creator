const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');

// GET all prompts
router.get('/', promptController.getAllPrompts);

// GET prompt by ID
router.get('/:id', promptController.getPromptById);

// POST create new prompt
router.post('/', promptController.createPrompt);

// PUT update prompt
router.put('/:id', promptController.updatePrompt);

// DELETE prompt
router.delete('/:id', promptController.deletePrompt);

module.exports = router; 