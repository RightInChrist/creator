const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['product_manager', 'technical_leader', 'designer', 'assistant', 'expert', 'coordinator', 'processor']
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  systemPrompt: {
    type: String,
    required: true
  },
  prompts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt'
  }],
  configuration: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  capabilities: [{
    type: String,
    trim: true
  }],
  collaborationPatterns: [{
    withAgentType: {
      type: String,
      enum: ['product_manager', 'technical_leader', 'designer', 'assistant', 'expert', 'coordinator', 'processor']
    },
    interactionType: {
      type: String,
      enum: ['advise', 'request_info', 'provide_info', 'review', 'approve']
    },
    prompt: String
  }],
  knowledgeBase: [{
    topic: String,
    content: String
  }],
  createdBy: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent; 