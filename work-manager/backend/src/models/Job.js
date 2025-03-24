const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
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
    enum: ['code', 'llm', 'agent', 'tool', 'custom'],
    required: true
  },
  code: {
    source: String,
    language: String,
    entryPoint: String
  },
  tools: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tool'
  }],
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  },
  prompts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt'
  }],
  configuration: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  inputs: [{
    name: String,
    description: String,
    type: String,
    required: Boolean,
    defaultValue: mongoose.Schema.Types.Mixed
  }],
  outputs: [{
    name: String,
    description: String,
    type: String
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

const Job = mongoose.model('Job', jobSchema);

module.exports = Job; 