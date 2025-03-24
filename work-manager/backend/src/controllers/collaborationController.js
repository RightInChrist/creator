const agentCollaborationService = require('../services/agentCollaborationService');

// Start a new agent conversation
exports.startConversation = async (req, res) => {
  try {
    const { agentIds, context, initialPrompt } = req.body;
    
    if (!agentIds || !Array.isArray(agentIds) || agentIds.length === 0) {
      return res.status(400).json({ message: 'Agent IDs are required' });
    }
    
    if (!initialPrompt) {
      return res.status(400).json({ message: 'Initial prompt is required' });
    }
    
    const conversation = await agentCollaborationService.initiateConversation(
      agentIds,
      context || {},
      initialPrompt
    );
    
    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a product discovery workflow
exports.createProductDiscoveryWorkflow = async (req, res) => {
  try {
    const { projectName } = req.body;
    const createdBy = req.body.createdBy || 'system';
    
    if (!projectName) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    
    const workflow = await agentCollaborationService.createProductDiscoveryWorkflow(
      projectName,
      createdBy
    );
    
    res.status(201).json(workflow);
  } catch (error) {
    console.error('Error creating product discovery workflow:', error);
    res.status(500).json({ message: error.message });
  }
}; 