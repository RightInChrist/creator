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
  steps: [{
    name: String,
    description: String,
    type: {
      type: String,
      enum: ['job', 'condition', 'parallel', 'sequence']
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    conditions: [mongoose.Schema.Types.Mixed],
    nextSteps: [String],
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
  createdBy: {
    type: String,
    required: true
  },
  variables: [{
    name: String,
    description: String,
    defaultValue: String
  }]
}, {
  timestamps: true
});

const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow; 