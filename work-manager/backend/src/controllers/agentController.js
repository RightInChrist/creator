const Agent = require('../models/Agent');

// Get all agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().populate('prompts');
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get agent by ID
exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).populate('prompts');
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new agent
exports.createAgent = async (req, res) => {
  try {
    const newAgent = new Agent(req.body);
    const savedAgent = await newAgent.save();
    res.status(201).json(savedAgent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update agent
exports.updateAgent = async (req, res) => {
  try {
    const updatedAgent = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAgent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.status(200).json(updatedAgent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete agent
exports.deleteAgent = async (req, res) => {
  try {
    const deletedAgent = await Agent.findByIdAndDelete(req.params.id);
    if (!deletedAgent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 