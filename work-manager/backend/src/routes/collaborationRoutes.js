const express = require('express');
const router = express.Router();
const collaborationController = require('../controllers/collaborationController');

// Start a conversation between agents
router.post('/conversations', collaborationController.startConversation);

// Create a product discovery workflow
router.post('/workflows/product-discovery', collaborationController.createProductDiscoveryWorkflow);

module.exports = router; 