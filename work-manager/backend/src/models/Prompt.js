const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  variables: [{
    name: String,
    description: String,
    defaultValue: String
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

const Prompt = mongoose.model('Prompt', promptSchema);

module.exports = Prompt; 