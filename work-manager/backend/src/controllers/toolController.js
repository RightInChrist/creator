const Tool = require('../models/Tool');

// Get all tools
exports.getAllTools = async (req, res) => {
  try {
    const tools = await Tool.find();
    res.status(200).json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tool by ID
exports.getToolById = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.status(200).json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new tool
exports.createTool = async (req, res) => {
  try {
    const newTool = new Tool(req.body);
    const savedTool = await newTool.save();
    res.status(201).json(savedTool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update tool
exports.updateTool = async (req, res) => {
  try {
    const updatedTool = await Tool.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.status(200).json(updatedTool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete tool
exports.deleteTool = async (req, res) => {
  try {
    const deletedTool = await Tool.findByIdAndDelete(req.params.id);
    if (!deletedTool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.status(200).json({ message: 'Tool deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Execute tool (placeholder for future implementation)
exports.executeTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    // This is a placeholder for future tool execution logic
    // In a real implementation, this would handle executing the tool with the provided inputs
    
    res.status(200).json({ 
      message: 'Tool execution initiated',
      toolId: tool._id,
      status: 'pending',
      input: req.body
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 