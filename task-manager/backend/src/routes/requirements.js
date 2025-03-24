const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskType = require('../models/TaskType');

// Import requirements from agent collaboration output
router.post('/import', async (req, res) => {
  try {
    const {
      collaborationId,
      projectName,
      businessGoals,
      functionalRequirements,
      technicalRequirements,
      designRequirements,
      constraints,
      createdBy
    } = req.body;
    
    // Validate required fields
    if (!projectName || !businessGoals || !functionalRequirements) {
      return res.status(400).json({ error: 'Project name, business goals, and functional requirements are required' });
    }
    
    // Find task types
    const epicType = await TaskType.findOne({ where: { name: 'Epic' } });
    const storyType = await TaskType.findOne({ where: { name: 'Story' } });
    const taskType = await TaskType.findOne({ where: { name: 'Task' } });
    
    if (!epicType || !storyType || !taskType) {
      return res.status(500).json({ error: 'Required task types not found' });
    }
    
    // Create a main epic for the project
    const epic = await Task.create({
      title: projectName,
      description: businessGoals.join('\n\n'),
      jobToBeDone: `Implement ${projectName}`,
      taskTypeId: epicType.id,
      status: 'TO_DO',
      priority: 'HIGH',
      createdBy
    });
    
    const epicIds = [epic.id.toString()];
    const jtbdIds = [];
    const storyIds = [];
    const taskIds = [];
    
    // Create JTBDs from functional requirements
    for (const req of functionalRequirements) {
      const jtbd = await Task.create({
        title: req.description,
        description: req.description,
        jobToBeDone: req.description,
        parentId: epic.id,
        taskTypeId: storyType.id, // Using Story type for JTBDs
        status: 'TO_DO',
        priority: req.priority === 'high' ? 'HIGH' : 
                 req.priority === 'medium' ? 'MEDIUM' : 'LOW',
        assignedTo: req.userType || '',
        createdBy
      });
      
      jtbdIds.push(jtbd.id.toString());
      
      // Create a user story from each functional requirement
      const story = await Task.create({
        title: `${req.userType || 'User'} - ${req.description.substring(0, 50)}...`,
        description: req.description,
        userStory: `As a ${req.userType || 'User'}, I want to ${req.description} so that I can achieve my goals`,
        parentId: jtbd.id,
        taskTypeId: storyType.id,
        status: 'TO_DO',
        priority: req.priority === 'high' ? 'HIGH' : 
                 req.priority === 'medium' ? 'MEDIUM' : 'LOW',
        createdBy
      });
      
      storyIds.push(story.id.toString());
    }
    
    // Create tasks from technical requirements
    if (technicalRequirements && technicalRequirements.length > 0) {
      for (const req of technicalRequirements) {
        const task = await Task.create({
          title: req.description,
          description: req.description,
          taskTypeId: taskType.id,
          status: 'TO_DO',
          priority: req.impact === 'high' ? 'HIGH' : 
                   req.impact === 'medium' ? 'MEDIUM' : 'LOW',
          parentId: epic.id, // Link directly to epic
          product: req.category || '',
          createdBy
        });
        
        taskIds.push(task.id.toString());
      }
    }
    
    // Create tasks from design requirements
    if (designRequirements && designRequirements.length > 0) {
      for (const req of designRequirements) {
        const task = await Task.create({
          title: `Design: ${req.description}`,
          description: req.description,
          taskTypeId: taskType.id,
          status: 'TO_DO',
          priority: req.impact === 'high' ? 'HIGH' : 
                   req.impact === 'medium' ? 'MEDIUM' : 'LOW',
          parentId: epic.id, // Link directly to epic
          product: req.category || '',
          createdBy
        });
        
        taskIds.push(task.id.toString());
      }
    }
    
    // Create tasks from constraints
    if (constraints && constraints.length > 0) {
      for (const constraint of constraints) {
        const task = await Task.create({
          title: `Constraint: ${constraint.type}`,
          description: constraint.description,
          taskTypeId: taskType.id,
          status: 'TO_DO',
          priority: 'MEDIUM',
          parentId: epic.id, // Link directly to epic
          product: constraint.type || '',
          createdBy
        });
        
        taskIds.push(task.id.toString());
      }
    }
    
    res.status(200).json({
      epicIds,
      jtbdIds,
      storyIds,
      taskIds
    });
  } catch (error) {
    console.error('Error importing requirements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 