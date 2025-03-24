const Workflow = require('../models/Workflow');

// Get all workflows
exports.getAllWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find();
    res.status(200).json(workflows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get workflow by ID
exports.getWorkflowById = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }
    res.status(200).json(workflow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new workflow
exports.createWorkflow = async (req, res) => {
  try {
    const newWorkflow = new Workflow(req.body);
    const savedWorkflow = await newWorkflow.save();
    res.status(201).json(savedWorkflow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update workflow
exports.updateWorkflow = async (req, res) => {
  try {
    const updatedWorkflow = await Workflow.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedWorkflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }
    res.status(200).json(updatedWorkflow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete workflow
exports.deleteWorkflow = async (req, res) => {
  try {
    const deletedWorkflow = await Workflow.findByIdAndDelete(req.params.id);
    if (!deletedWorkflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }
    res.status(200).json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change workflow status
exports.changeWorkflowStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['draft', 'active', 'paused', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const workflow = await Workflow.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }
    
    res.status(200).json(workflow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 