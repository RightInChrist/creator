const Conversation = require('../models/Conversation');

// Get all conversations for a project
exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      projectId: req.query.projectId,
      status: 'active'
    }).sort({ updatedAt: -1 });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get conversation by ID
exports.getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      status: 'active'
    });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new conversation
exports.createConversation = async (req, res) => {
  try {
    const newConversation = new Conversation(req.body);
    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update conversation
exports.updateConversation = async (req, res) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, status: 'active' },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedConversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.status(200).json(updatedConversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete conversation (archive)
exports.deleteConversation = async (req, res) => {
  try {
    const archivedConversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, status: 'active' },
      { status: 'archived' },
      { new: true }
    );
    if (!archivedConversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.status(200).json({ message: 'Conversation archived successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add message to conversation
exports.addMessage = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      status: 'active'
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    conversation.messages.push(req.body);
    const updatedConversation = await conversation.save();
    res.status(200).json(updatedConversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 