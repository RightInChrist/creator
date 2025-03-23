const { TaskType } = require('../models');

// Get all task types
exports.getAllTaskTypes = async (req, res) => {
  try {
    const taskTypes = await TaskType.findAll();
    return res.status(200).json(taskTypes);
  } catch (error) {
    console.error('Error getting task types:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get task type by ID
exports.getTaskTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const taskType = await TaskType.findByPk(id);
    
    if (!taskType) {
      return res.status(404).json({ message: 'Task type not found' });
    }
    
    return res.status(200).json(taskType);
  } catch (error) {
    console.error('Error getting task type:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Create new task type
exports.createTaskType = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    const existingType = await TaskType.findOne({ where: { name } });
    if (existingType) {
      return res.status(400).json({ message: 'Task type with this name already exists' });
    }
    
    const newTaskType = await TaskType.create({
      name,
      description,
      color,
      icon,
      isDefault: false
    });
    
    return res.status(201).json(newTaskType);
  } catch (error) {
    console.error('Error creating task type:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update task type
exports.updateTaskType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, icon } = req.body;
    
    const taskType = await TaskType.findByPk(id);
    
    if (!taskType) {
      return res.status(404).json({ message: 'Task type not found' });
    }
    
    // Don't allow changing default types
    if (taskType.isDefault) {
      return res.status(403).json({ message: 'Default task types cannot be modified' });
    }
    
    if (name && name !== taskType.name) {
      const existingType = await TaskType.findOne({ where: { name } });
      if (existingType) {
        return res.status(400).json({ message: 'Task type with this name already exists' });
      }
    }
    
    await taskType.update({
      name: name || taskType.name,
      description: description !== undefined ? description : taskType.description,
      color: color || taskType.color,
      icon: icon || taskType.icon
    });
    
    return res.status(200).json(taskType);
  } catch (error) {
    console.error('Error updating task type:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete task type
exports.deleteTaskType = async (req, res) => {
  try {
    const { id } = req.params;
    
    const taskType = await TaskType.findByPk(id);
    
    if (!taskType) {
      return res.status(404).json({ message: 'Task type not found' });
    }
    
    if (taskType.isDefault) {
      return res.status(403).json({ message: 'Default task types cannot be deleted' });
    }
    
    await taskType.destroy();
    
    return res.status(200).json({ message: 'Task type deleted successfully' });
  } catch (error) {
    console.error('Error deleting task type:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}; 