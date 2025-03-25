const express = require('express');
const router = express.Router();
const conversationController = require('../../controllers/conversationController');

// GET /api/v1/conversations
router.get('/', conversationController.getAllConversations);

// GET /api/v1/conversations/:id
router.get('/:id', conversationController.getConversationById);

// POST /api/v1/conversations
router.post('/', conversationController.createConversation);

// PUT /api/v1/conversations/:id
router.put('/:id', conversationController.updateConversation);

// DELETE /api/v1/conversations/:id
router.delete('/:id', conversationController.deleteConversation);

// POST /api/v1/conversations/:id/messages
router.post('/:id/messages', conversationController.addMessage);

module.exports = router; 