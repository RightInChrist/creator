const Prompt = require('../models/Prompt');

// Get all prompts
exports.getAllPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find();
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get prompt by ID
exports.getPromptById = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    res.status(200).json(prompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new prompt
exports.createPrompt = async (req, res) => {
  try {
    const newPrompt = new Prompt(req.body);
    const savedPrompt = await newPrompt.save();
    res.status(201).json(savedPrompt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update prompt
exports.updatePrompt = async (req, res) => {
  try {
    const updatedPrompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPrompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    res.status(200).json(updatedPrompt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete prompt
exports.deletePrompt = async (req, res) => {
  try {
    const deletedPrompt = await Prompt.findByIdAndDelete(req.params.id);
    if (!deletedPrompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    res.status(200).json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 