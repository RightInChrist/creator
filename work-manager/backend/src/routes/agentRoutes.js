const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

// GET all agents
router.get('/', agentController.getAllAgents);

// GET agent by ID
router.get('/:id', agentController.getAgentById);

// POST create new agent
router.post('/', agentController.createAgent);

// PUT update agent
router.put('/:id', agentController.updateAgent);

// DELETE agent
router.delete('/:id', agentController.deleteAgent);

module.exports = router; 