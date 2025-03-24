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
    enum: ['assistant', 'expert', 'coordinator', 'processor']
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