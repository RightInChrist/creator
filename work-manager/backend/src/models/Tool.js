const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
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
    enum: ['local', 'remote', 'api'],
    required: true
  },
  endpoint: {
    type: String,
    trim: true
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    default: 'POST'
  },
  authentication: {
    type: {
      type: String,
      enum: ['none', 'basic', 'bearer', 'api_key', 'oauth'],
      default: 'none'
    },
    credentials: mongoose.Schema.Types.Mixed
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
  code: {
    source: String,
    language: String,
    entryPoint: String
  },
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

const Tool = mongoose.model('Tool', toolSchema);

module.exports = Tool; 