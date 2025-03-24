const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskType = require('../models/TaskType');
const { Op } = require('sequelize');

// Get all epics
router.get('/', async (req, res) => {
  try {
    // Find the Epic task type
    const epicType = await TaskType.findOne({ where: { name: 'Epic' } });
    
    if (!epicType) {
      return res.status(404).json({ error: 'Epic task type not found' });
    }
    
    // Get all tasks with Epic type
    const epics = await Task.findAll({
      where: { taskTypeId: epicType.id },
      order: [['createdAt', 'DESC']]
    });
    
    // Map to the Epic format in the swagger schema
    const formattedEpics = epics.map(epic => ({
      id: epic.id.toString(),
      title: epic.title,
      description: epic.description || '',
      businessGoal: epic.jobToBeDone || '',
      priority: epic.priority === 'LOW' ? 3 : 
                epic.priority === 'MEDIUM' ? 5 : 
                epic.priority === 'HIGH' ? 7 : 
                epic.priority === 'URGENT' ? 10 : 5,
      status: epic.status === 'TO_DO' ? 'planned' : 
              epic.status === 'IN_PROGRESS' ? 'in_progress' : 
              epic.status === 'DONE' ? 'completed' : 
              epic.status === 'IN_REVIEW' ? 'in_progress' : 'planned',
      startDate: epic.dueDate ? new Date(epic.dueDate).toISOString().split('T')[0] : null,
      endDate: epic.dueDate ? new Date(new Date(epic.dueDate).getTime() + 30*24*60*60*1000).toISOString().split('T')[0] : null, // Add 30 days from dueDate
      createdBy: epic.createdBy || '',
      createdAt: epic.createdAt.toISOString(),
      updatedAt: epic.updatedAt.toISOString(),
    }));
    
    res.json(formattedEpics);
  } catch (error) {
    console.error('Error fetching epics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new epic
router.post('/', async (req, res) => {
  try {
    const { title, description, businessGoal, priority, status, startDate, endDate, createdBy } = req.body;
    
    // Validate required fields
    if (!title || !description || !businessGoal) {
      return res.status(400).json({ error: 'Title, description and businessGoal are required' });
    }
    
    // Find Epic task type
    const epicType = await TaskType.findOne({ where: { name: 'Epic' } });
    if (!epicType) {
      return res.status(404).json({ error: 'Epic task type not found' });
    }
    
    // Map status and priority to our existing enum values
    const taskStatus = status === 'planned' ? 'TO_DO' : 
                      status === 'in_progress' ? 'IN_PROGRESS' : 
                      status === 'completed' ? 'DONE' : 
                      status === 'blocked' ? 'TO_DO' : 'TO_DO';
    
    const taskPriority = priority <= 3 ? 'LOW' : 
                        priority <= 6 ? 'MEDIUM' : 
                        priority <= 8 ? 'HIGH' : 'URGENT';
    
    // Create new epic (task with Epic type)
    const epic = await Task.create({
      title,
      description,
      jobToBeDone: businessGoal, // Map businessGoal to jobToBeDone field
      taskTypeId: epicType.id,
      status: taskStatus,
      priority: taskPriority,
      dueDate: startDate ? new Date(startDate) : null,
      createdBy
    });
    
    // Format response to match Epic schema
    const formattedEpic = {
      id: epic.id.toString(),
      title: epic.title,
      description: epic.description || '',
      businessGoal: epic.jobToBeDone || '',
      priority: priority || 5,
      status: status || 'planned',
      startDate: startDate || null,
      endDate: endDate || null,
      createdBy: epic.createdBy || '',
      createdAt: epic.createdAt.toISOString(),
      updatedAt: epic.updatedAt.toISOString()
    };
    
    res.status(201).json(formattedEpic);
  } catch (error) {
    console.error('Error creating epic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get epic by ID
router.get('/:epicId', async (req, res) => {
  try {
    const { epicId } = req.params;
    
    // Find the Epic task type
    const epicType = await TaskType.findOne({ where: { name: 'Epic' } });
    
    if (!epicType) {
      return res.status(404).json({ error: 'Epic task type not found' });
    }
    
    // Get the epic
    const epic = await Task.findOne({
      where: { 
        id: epicId,
        taskTypeId: epicType.id
      }
    });
    
    if (!epic) {
      return res.status(404).json({ error: 'Epic not found' });
    }
    
    // Format response to match Epic schema
    const formattedEpic = {
      id: epic.id.toString(),
      title: epic.title,
      description: epic.description || '',
      businessGoal: epic.jobToBeDone || '',
      priority: epic.priority === 'LOW' ? 3 : 
                epic.priority === 'MEDIUM' ? 5 : 
                epic.priority === 'HIGH' ? 7 : 
                epic.priority === 'URGENT' ? 10 : 5,
      status: epic.status === 'TO_DO' ? 'planned' : 
              epic.status === 'IN_PROGRESS' ? 'in_progress' : 
              epic.status === 'DONE' ? 'completed' : 
              epic.status === 'IN_REVIEW' ? 'in_progress' : 'planned',
      startDate: epic.dueDate ? new Date(epic.dueDate).toISOString().split('T')[0] : null,
      endDate: epic.dueDate ? new Date(new Date(epic.dueDate).getTime() + 30*24*60*60*1000).toISOString().split('T')[0] : null,
      createdBy: epic.createdBy || '',
      createdAt: epic.createdAt.toISOString(),
      updatedAt: epic.updatedAt.toISOString()
    };
    
    res.json(formattedEpic);
  } catch (error) {
    console.error('Error fetching epic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update epic
router.put('/:epicId', async (req, res) => {
  try {
    const { epicId } = req.params;
    const { title, description, businessGoal, priority, status, startDate, endDate, createdBy } = req.body;
    
    // Find the Epic task type
    const epicType = await TaskType.findOne({ where: { name: 'Epic' } });
    
    if (!epicType) {
      return res.status(404).json({ error: 'Epic task type not found' });
    }
    
    // Find the epic
    const epic = await Task.findOne({
      where: { 
        id: epicId,
        taskTypeId: epicType.id
      }
    });
    
    if (!epic) {
      return res.status(404).json({ error: 'Epic not found' });
    }
    
    // Map status and priority to our existing enum values
    const taskStatus = status === 'planned' ? 'TO_DO' : 
                      status === 'in_progress' ? 'IN_PROGRESS' : 
                      status === 'completed' ? 'DONE' : 
                      status === 'blocked' ? 'TO_DO' : epic.status;
    
    const taskPriority = priority <= 3 ? 'LOW' : 
                        priority <= 6 ? 'MEDIUM' : 
                        priority <= 8 ? 'HIGH' : 
                        priority > 8 ? 'URGENT' : epic.priority;
    
    // Update epic
    await epic.update({
      title: title || epic.title,
      description: description !== undefined ? description : epic.description,
      jobToBeDone: businessGoal !== undefined ? businessGoal : epic.jobToBeDone,
      status: taskStatus,
      priority: taskPriority,
      dueDate: startDate ? new Date(startDate) : epic.dueDate,
      createdBy: createdBy || epic.createdBy
    });
    
    // Format response to match Epic schema
    const formattedEpic = {
      id: epic.id.toString(),
      title: epic.title,
      description: epic.description || '',
      businessGoal: epic.jobToBeDone || '',
      priority: priority || (epic.priority === 'LOW' ? 3 : 
                epic.priority === 'MEDIUM' ? 5 : 
                epic.priority === 'HIGH' ? 7 : 
                epic.priority === 'URGENT' ? 10 : 5),
      status: status || (epic.status === 'TO_DO' ? 'planned' : 
              epic.status === 'IN_PROGRESS' ? 'in_progress' : 
              epic.status === 'DONE' ? 'completed' : 
              epic.status === 'IN_REVIEW' ? 'in_progress' : 'planned'),
      startDate: startDate || (epic.dueDate ? new Date(epic.dueDate).toISOString().split('T')[0] : null),
      endDate: endDate || (epic.dueDate ? new Date(new Date(epic.dueDate).getTime() + 30*24*60*60*1000).toISOString().split('T')[0] : null),
      createdBy: epic.createdBy || '',
      createdAt: epic.createdAt.toISOString(),
      updatedAt: epic.updatedAt.toISOString()
    };
    
    res.json(formattedEpic);
  } catch (error) {
    console.error('Error updating epic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete epic
router.delete('/:epicId', async (req, res) => {
  try {
    const { epicId } = req.params;
    
    // Find the Epic task type
    const epicType = await TaskType.findOne({ where: { name: 'Epic' } });
    
    if (!epicType) {
      return res.status(404).json({ error: 'Epic task type not found' });
    }
    
    // Find the epic
    const epic = await Task.findOne({
      where: { 
        id: epicId,
        taskTypeId: epicType.id
      }
    });
    
    if (!epic) {
      return res.status(404).json({ error: 'Epic not found' });
    }
    
    // Delete the epic
    await epic.destroy();
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting epic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 