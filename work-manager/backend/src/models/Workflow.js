const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
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
    enum: ['discovery', 'requirements', 'development', 'delivery', 'general'],
    default: 'general'
  },
  participants: [{
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent'
    },
    role: String
  }],
  steps: [{
    name: String,
    description: String,
    type: {
      type: String,
      enum: ['job', 'condition', 'parallel', 'sequence', 'agent_task', 'human_task', 'collaboration']
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent'
    },
    actionType: {
      type: String,
      enum: ['collect_info', 'analyze', 'advise', 'decide', 'execute', 'review', 'approve']
    },
    prompt: String,
    conditions: [mongoose.Schema.Types.Mixed],
    collaborators: [{
      agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent'
      },
      role: String,
      actionType: String
    }],
    nextSteps: [String],
    expectedOutput: mongoose.Schema.Types.Mixed,
    configuration: mongoose.Schema.Types.Mixed
  }],
  triggers: [{
    type: {
      type: String,
      enum: ['schedule', 'event', 'manual', 'webhook']
    },
    configuration: mongoose.Schema.Types.Mixed
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'archived'],
    default: 'draft'
  },
  metadata: {
    domain: String,
    audience: String,
    complexity: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },
  createdBy: {
    type: String,
    required: true
  },
  variables: [{
    name: String,
    description: String,
    defaultValue: String
  }],
  artifacts: [{
    name: String,
    description: String,
    type: String,
    content: mongoose.Schema.Types.Mixed,
    createdAt: Date
  }]
}, {
  timestamps: true
});

const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow; 