const { Task, TaskType } = require('../models');
const { Op } = require('sequelize');

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        { model: TaskType, as: 'taskType' },
        { model: Task, as: 'parent' }
      ]
    });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id, {
      include: [
        { model: TaskType, as: 'taskType' },
        { model: Task, as: 'parent' },
        { model: Task, as: 'subtasks' }
      ]
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Get related tasks if any
    let relatedTasks = [];
    if (task.relatedTasks && task.relatedTasks.length > 0) {
      relatedTasks = await Task.findAll({
        where: {
          id: {
            [Op.in]: task.relatedTasks
          }
        },
        include: [{ model: TaskType, as: 'taskType' }]
      });
    }
    
    // Get siblings if parent exists
    let siblings = [];
    if (task.parentId) {
      siblings = await Task.findAll({
        where: {
          parentId: task.parentId,
          id: {
            [Op.ne]: task.id // Exclude self
          }
        },
        include: [{ model: TaskType, as: 'taskType' }]
      });
    }
    
    // Add related tasks and siblings to the response
    const taskWithRelationships = {
      ...task.toJSON(),
      relatedTasks,
      siblings
    };
    
    return res.status(200).json(taskWithRelationships);
  } catch (error) {
    console.error('Error getting task:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      taskTypeId, 
      status, 
      priority, 
      dueDate, 
      estimatedHours,
      assignedTo,
      createdBy,
      parentId,
      // New fields
      gitRepo,
      product,
      feature,
      jobToBeDone,
      userStory,
      stepsToReproduce,
      definitionOfDone,
      relatedTasks
    } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!taskTypeId) {
      return res.status(400).json({ message: 'Task type is required' });
    }
    
    // Verify task type exists
    const taskType = await TaskType.findByPk(taskTypeId);
    if (!taskType) {
      return res.status(404).json({ message: 'Task type not found' });
    }
    
    // Verify parent exists if specified
    if (parentId) {
      const parent = await Task.findByPk(parentId);
      if (!parent) {
        return res.status(404).json({ message: 'Parent task not found' });
      }
    }
    
    // Verify related tasks exist if specified
    if (relatedTasks && relatedTasks.length > 0) {
      const taskCount = await Task.count({
        where: {
          id: {
            [Op.in]: relatedTasks
          }
        }
      });
      
      if (taskCount !== relatedTasks.length) {
        return res.status(404).json({ message: 'One or more related tasks not found' });
      }
    }
    
    const newTask = await Task.create({
      title,
      description,
      taskTypeId,
      status: status || 'TO_DO',
      priority: priority || 'MEDIUM',
      dueDate,
      estimatedHours,
      assignedTo,
      createdBy,
      parentId,
      // New fields
      gitRepo,
      product,
      feature,
      jobToBeDone,
      userStory,
      stepsToReproduce,
      definitionOfDone,
      relatedTasks
    });
    
    // Fetch the created task with associations
    const createdTask = await Task.findByPk(newTask.id, {
      include: [
        { model: TaskType, as: 'taskType' },
        { model: Task, as: 'parent' }
      ]
    });
    
    return res.status(201).json(createdTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      taskTypeId, 
      status, 
      priority, 
      dueDate, 
      estimatedHours,
      actualHours,
      assignedTo,
      parentId,
      // New fields
      gitRepo,
      product,
      feature,
      jobToBeDone,
      userStory,
      stepsToReproduce,
      definitionOfDone,
      relatedTasks
    } = req.body;
    
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify task type exists if changing
    if (taskTypeId && taskTypeId !== task.taskTypeId) {
      const taskType = await TaskType.findByPk(taskTypeId);
      if (!taskType) {
        return res.status(404).json({ message: 'Task type not found' });
      }
    }
    
    // Verify parent exists if changing
    if (parentId && parentId !== task.parentId) {
      // Check for circular reference
      if (parentId === task.id) {
        return res.status(400).json({ message: 'Task cannot be its own parent' });
      }
      
      const parent = await Task.findByPk(parentId);
      if (!parent) {
        return res.status(404).json({ message: 'Parent task not found' });
      }
    }
    
    // Verify related tasks exist if specified
    if (relatedTasks && relatedTasks.length > 0) {
      // Check for self-reference
      if (relatedTasks.includes(Number(id))) {
        return res.status(400).json({ message: 'Task cannot be related to itself' });
      }
      
      const taskCount = await Task.count({
        where: {
          id: {
            [Op.in]: relatedTasks
          }
        }
      });
      
      if (taskCount !== relatedTasks.length) {
        return res.status(404).json({ message: 'One or more related tasks not found' });
      }
    }
    
    await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      taskTypeId: taskTypeId || task.taskTypeId,
      status: status || task.status,
      priority: priority || task.priority,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
      estimatedHours: estimatedHours !== undefined ? estimatedHours : task.estimatedHours,
      actualHours: actualHours !== undefined ? actualHours : task.actualHours,
      assignedTo: assignedTo !== undefined ? assignedTo : task.assignedTo,
      parentId: parentId !== undefined ? parentId : task.parentId,
      // New fields
      gitRepo: gitRepo !== undefined ? gitRepo : task.gitRepo,
      product: product !== undefined ? product : task.product,
      feature: feature !== undefined ? feature : task.feature,
      jobToBeDone: jobToBeDone !== undefined ? jobToBeDone : task.jobToBeDone,
      userStory: userStory !== undefined ? userStory : task.userStory,
      stepsToReproduce: stepsToReproduce !== undefined ? stepsToReproduce : task.stepsToReproduce,
      definitionOfDone: definitionOfDone !== undefined ? definitionOfDone : task.definitionOfDone,
      relatedTasks: relatedTasks !== undefined ? relatedTasks : task.relatedTasks
    });
    
    // Fetch the updated task with associations
    const updatedTask = await Task.findByPk(id, {
      include: [
        { model: TaskType, as: 'taskType' },
        { model: Task, as: 'parent' }
      ]
    });
    
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if this task has any subtasks
    const subtasks = await Task.findAll({ where: { parentId: id } });
    if (subtasks.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete task with subtasks. Delete all subtasks first or update their parent.',
        subtasksCount: subtasks.length
      });
    }
    
    await task.destroy();
    
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get related tasks
exports.getRelatedTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (!task.relatedTasks || task.relatedTasks.length === 0) {
      return res.status(200).json([]);
    }
    
    const relatedTasks = await Task.findAll({
      where: {
        id: {
          [Op.in]: task.relatedTasks
        }
      },
      include: [{ model: TaskType, as: 'taskType' }]
    });
    
    return res.status(200).json(relatedTasks);
  } catch (error) {
    console.error('Error getting related tasks:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Link tasks
exports.linkTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetIds } = req.body;
    
    if (!targetIds || !Array.isArray(targetIds) || targetIds.length === 0) {
      return res.status(400).json({ message: 'Target task IDs are required' });
    }
    
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if target IDs include self
    if (targetIds.includes(Number(id))) {
      return res.status(400).json({ message: 'Task cannot be linked to itself' });
    }
    
    // Verify all target tasks exist
    const targetCount = await Task.count({
      where: {
        id: {
          [Op.in]: targetIds
        }
      }
    });
    
    if (targetCount !== targetIds.length) {
      return res.status(404).json({ message: 'One or more target tasks not found' });
    }
    
    // Get current related tasks and add new ones without duplicates
    const currentRelatedTasks = task.relatedTasks || [];
    const newRelatedTasks = [...new Set([...currentRelatedTasks, ...targetIds])];
    
    await task.update({ relatedTasks: newRelatedTasks });
    
    // For bidirectional linking, also update the target tasks
    for (const targetId of targetIds) {
      const targetTask = await Task.findByPk(targetId);
      const targetRelated = targetTask.relatedTasks || [];
      if (!targetRelated.includes(Number(id))) {
        await targetTask.update({ 
          relatedTasks: [...targetRelated, Number(id)]
        });
      }
    }
    
    // Fetch updated task with related tasks
    const updatedTask = await Task.findByPk(id);
    const relatedTasks = await Task.findAll({
      where: {
        id: {
          [Op.in]: updatedTask.relatedTasks
        }
      },
      include: [{ model: TaskType, as: 'taskType' }]
    });
    
    return res.status(200).json({
      ...updatedTask.toJSON(),
      relatedTasks
    });
  } catch (error) {
    console.error('Error linking tasks:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Unlink tasks
exports.unlinkTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetIds } = req.body;
    
    if (!targetIds || !Array.isArray(targetIds) || targetIds.length === 0) {
      return res.status(400).json({ message: 'Target task IDs are required' });
    }
    
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Get current related tasks and remove the specified ones
    const currentRelatedTasks = task.relatedTasks || [];
    const newRelatedTasks = currentRelatedTasks.filter(
      taskId => !targetIds.includes(taskId)
    );
    
    await task.update({ relatedTasks: newRelatedTasks });
    
    // For bidirectional unlinking, also update the target tasks
    for (const targetId of targetIds) {
      const targetTask = await Task.findByPk(targetId);
      if (targetTask) {
        const targetRelated = targetTask.relatedTasks || [];
        await targetTask.update({ 
          relatedTasks: targetRelated.filter(taskId => taskId !== Number(id))
        });
      }
    }
    
    // Fetch updated task with related tasks
    const updatedTask = await Task.findByPk(id);
    let relatedTasks = [];
    if (updatedTask.relatedTasks && updatedTask.relatedTasks.length > 0) {
      relatedTasks = await Task.findAll({
        where: {
          id: {
            [Op.in]: updatedTask.relatedTasks
          }
        },
        include: [{ model: TaskType, as: 'taskType' }]
      });
    }
    
    return res.status(200).json({
      ...updatedTask.toJSON(),
      relatedTasks
    });
  } catch (error) {
    console.error('Error unlinking tasks:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}; 