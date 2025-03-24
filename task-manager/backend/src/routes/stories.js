const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskType = require('../models/TaskType');
const { Op } = require('sequelize');

// Get all user stories with optional filtering
router.get('/', async (req, res) => {
  try {
    const { epicId, jtbdId } = req.query;
    
    // Find the Story task type
    const storyType = await TaskType.findOne({ where: { name: 'Story' } });
    
    if (!storyType) {
      return res.status(404).json({ error: 'Story task type not found' });
    }
    
    // Build query conditions
    const whereConditions = {
      taskTypeId: storyType.id
    };
    
    // If epicId is provided, find stories with this Epic as parent
    if (epicId) {
      whereConditions.parentId = epicId;
    }
    
    // If jtbdId is provided, include tasks referencing this JTBD
    // This is trickier because we don't have a direct JTBD link in our schema
    let tasks;
    if (jtbdId) {
      // Get the task that represents the JTBD
      const jtbd = await Task.findByPk(jtbdId);
      
      if (!jtbd || !jtbd.jobToBeDone) {
        return res.status(404).json({ error: 'Job to be done not found' });
      }
      
      // Find stories that reference this JTBD
      // We can match by userStory containing the JTBD's statement
      tasks = await Task.findAll({
        where: {
          ...whereConditions,
          userStory: {
            [Op.like]: `%${jtbd.jobToBeDone}%`
          }
        },
        include: [
          {
            model: TaskType,
            as: 'taskType',
            attributes: ['id', 'name']
          },
          {
            model: Task,
            as: 'parent',
            attributes: ['id', 'title', 'taskTypeId']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else {
      // Regular query without JTBD filter
      tasks = await Task.findAll({
        where: whereConditions,
        include: [
          {
            model: TaskType,
            as: 'taskType',
            attributes: ['id', 'name']
          },
          {
            model: Task,
            as: 'parent',
            attributes: ['id', 'title', 'taskTypeId', 'jobToBeDone']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    }
    
    // Map tasks to UserStory format
    const userStories = tasks.map(task => {
      // Parse acceptance criteria if present
      const acceptanceCriteria = task.definitionOfDone ? 
        task.definitionOfDone.split('\n').filter(line => line.trim().length > 0) : [];
      
      // Extract user type, action, benefit from userStory field if available
      let userType = task.assignedTo || 'User';
      let action = '';
      let benefit = '';
      
      if (task.userStory) {
        // Attempt to parse "As a [userType], I want to [action] so that [benefit]" format
        const match = task.userStory.match(/As a (.*?), I want to (.*?) so that (.*)/i);
        if (match && match.length >= 4) {
          userType = match[1].trim();
          action = match[2].trim();
          benefit = match[3].trim();
        }
      }
      
      return {
        id: task.id.toString(),
        epicId: task.parent && task.parent.taskTypeId ? task.parent.id.toString() : null,
        jtbdId: task.parent && task.parent.jobToBeDone ? task.parent.id.toString() : null,
        title: task.title,
        userType,
        action,
        benefit,
        acceptanceCriteria,
        priority: task.priority === 'LOW' ? 3 : 
                 task.priority === 'MEDIUM' ? 5 : 
                 task.priority === 'HIGH' ? 7 : 
                 task.priority === 'URGENT' ? 10 : 5,
        points: task.estimatedHours ? Math.ceil(task.estimatedHours) : null,
        status: task.status === 'TO_DO' ? 'backlog' : 
                task.status === 'IN_PROGRESS' ? 'in_progress' : 
                task.status === 'DONE' ? 'done' : 
                task.status === 'IN_REVIEW' ? 'review' : 'backlog',
        technicalConsiderations: task.stepsToReproduce || '',
        designConsiderations: task.gitRepo || '', // Repurposing gitRepo field
        createdBy: task.createdBy || '',
        assignedTo: task.assignedTo || '',
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString()
      };
    });
    
    res.json(userStories);
  } catch (error) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new user story
router.post('/', async (req, res) => {
  try {
    const { 
      epicId, jtbdId, title, userType, action, benefit, 
      acceptanceCriteria = [], priority, points, status,
      technicalConsiderations, designConsiderations,
      createdBy, assignedTo
    } = req.body;
    
    // Validate required fields
    if (!userType || !action || !benefit) {
      return res.status(400).json({ error: 'userType, action, and benefit are required' });
    }
    
    // Find Story task type
    const storyType = await TaskType.findOne({ where: { name: 'Story' } });
    if (!storyType) {
      return res.status(404).json({ error: 'Story task type not found' });
    }
    
    // Determine parent based on epicId or jtbdId
    let parentId = null;
    
    if (epicId) {
      // Verify the epic exists
      const epic = await Task.findByPk(epicId);
      if (!epic) {
        return res.status(404).json({ error: 'Epic not found' });
      }
      parentId = epicId;
    } else if (jtbdId) {
      // Verify the JTBD exists
      const jtbd = await Task.findByPk(jtbdId);
      if (!jtbd || !jtbd.jobToBeDone) {
        return res.status(404).json({ error: 'Job to be done not found' });
      }
      parentId = jtbdId;
    }
    
    // Format userStory field
    const userStoryText = `As a ${userType}, I want to ${action} so that ${benefit}`;
    
    // Format acceptance criteria
    const definitionOfDone = acceptanceCriteria.join('\n');
    
    // Map status to our enum
    const taskStatus = status === 'backlog' ? 'TO_DO' : 
                      status === 'ready' ? 'TO_DO' : 
                      status === 'in_progress' ? 'IN_PROGRESS' : 
                      status === 'review' ? 'IN_REVIEW' : 
                      status === 'done' ? 'DONE' : 'TO_DO';
    
    // Map priority to our enum
    const taskPriority = priority <= 3 ? 'LOW' : 
                        priority <= 6 ? 'MEDIUM' : 
                        priority <= 8 ? 'HIGH' : 'URGENT';
    
    // Create the user story
    const story = await Task.create({
      title: title || `${userType} - ${action}`,
      description: benefit || '',
      userStory: userStoryText,
      definitionOfDone,
      taskTypeId: storyType.id,
      parentId,
      status: taskStatus,
      priority: taskPriority,
      estimatedHours: points || null,
      stepsToReproduce: technicalConsiderations || '',
      gitRepo: designConsiderations || '',
      assignedTo,
      createdBy
    });
    
    // Format response
    const formattedStory = {
      id: story.id.toString(),
      epicId: parentId && epicId ? parentId.toString() : null,
      jtbdId: parentId && jtbdId ? parentId.toString() : null,
      title: story.title,
      userType,
      action,
      benefit,
      acceptanceCriteria,
      priority: priority || 5,
      points: points || null,
      status: status || 'backlog',
      technicalConsiderations: story.stepsToReproduce || '',
      designConsiderations: story.gitRepo || '',
      createdBy: story.createdBy || '',
      assignedTo: story.assignedTo || '',
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString()
    };
    
    res.status(201).json(formattedStory);
  } catch (error) {
    console.error('Error creating user story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user story by ID
router.get('/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    
    // Find the Story task type
    const storyType = await TaskType.findOne({ where: { name: 'Story' } });
    
    if (!storyType) {
      return res.status(404).json({ error: 'Story task type not found' });
    }
    
    // Get the story
    const story = await Task.findOne({
      where: { 
        id: storyId,
        taskTypeId: storyType.id
      },
      include: [
        {
          model: Task,
          as: 'parent',
          attributes: ['id', 'title', 'taskTypeId', 'jobToBeDone']
        }
      ]
    });
    
    if (!story) {
      return res.status(404).json({ error: 'User story not found' });
    }
    
    // Extract user type, action, benefit from userStory field if available
    let userType = story.assignedTo || 'User';
    let action = '';
    let benefit = '';
    
    if (story.userStory) {
      // Attempt to parse "As a [userType], I want to [action] so that [benefit]" format
      const match = story.userStory.match(/As a (.*?), I want to (.*?) so that (.*)/i);
      if (match && match.length >= 4) {
        userType = match[1].trim();
        action = match[2].trim();
        benefit = match[3].trim();
      }
    }
    
    // Parse acceptance criteria
    const acceptanceCriteria = story.definitionOfDone ? 
      story.definitionOfDone.split('\n').filter(line => line.trim().length > 0) : [];
    
    // Format response
    const formattedStory = {
      id: story.id.toString(),
      epicId: story.parent && story.parent.taskTypeId ? story.parent.id.toString() : null, 
      jtbdId: story.parent && story.parent.jobToBeDone ? story.parent.id.toString() : null,
      title: story.title,
      userType,
      action,
      benefit,
      acceptanceCriteria,
      priority: story.priority === 'LOW' ? 3 : 
               story.priority === 'MEDIUM' ? 5 : 
               story.priority === 'HIGH' ? 7 : 
               story.priority === 'URGENT' ? 10 : 5,
      points: story.estimatedHours ? Math.ceil(story.estimatedHours) : null,
      status: story.status === 'TO_DO' ? 'backlog' : 
             story.status === 'IN_PROGRESS' ? 'in_progress' : 
             story.status === 'DONE' ? 'done' : 
             story.status === 'IN_REVIEW' ? 'review' : 'backlog',
      technicalConsiderations: story.stepsToReproduce || '',
      designConsiderations: story.gitRepo || '',
      createdBy: story.createdBy || '',
      assignedTo: story.assignedTo || '',
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString()
    };
    
    res.json(formattedStory);
  } catch (error) {
    console.error('Error fetching user story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user story
router.put('/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    const { 
      epicId, jtbdId, title, userType, action, benefit, 
      acceptanceCriteria = [], priority, points, status,
      technicalConsiderations, designConsiderations,
      createdBy, assignedTo
    } = req.body;
    
    // Find the story
    const story = await Task.findByPk(storyId);
    
    if (!story) {
      return res.status(404).json({ error: 'User story not found' });
    }
    
    // Determine parent based on epicId or jtbdId
    let parentId = story.parentId;
    
    if (epicId && (!story.parentId || epicId.toString() !== story.parentId.toString())) {
      // Verify the epic exists
      const epic = await Task.findByPk(epicId);
      if (!epic) {
        return res.status(404).json({ error: 'Epic not found' });
      }
      parentId = epicId;
    } else if (jtbdId && (!story.parentId || jtbdId.toString() !== story.parentId.toString())) {
      // Verify the JTBD exists
      const jtbd = await Task.findByPk(jtbdId);
      if (!jtbd || !jtbd.jobToBeDone) {
        return res.status(404).json({ error: 'Job to be done not found' });
      }
      parentId = jtbdId;
    }
    
    // Format userStory field if userType, action, and benefit are all provided
    let userStoryText = story.userStory;
    if (userType && action && benefit) {
      userStoryText = `As a ${userType}, I want to ${action} so that ${benefit}`;
    }
    
    // Format acceptance criteria
    const definitionOfDone = acceptanceCriteria && acceptanceCriteria.length > 0 ? 
      acceptanceCriteria.join('\n') : story.definitionOfDone;
    
    // Map status to our enum
    const taskStatus = status === 'backlog' ? 'TO_DO' : 
                      status === 'ready' ? 'TO_DO' : 
                      status === 'in_progress' ? 'IN_PROGRESS' : 
                      status === 'review' ? 'IN_REVIEW' : 
                      status === 'done' ? 'DONE' : story.status;
    
    // Map priority to our enum
    const taskPriority = priority <= 3 ? 'LOW' : 
                        priority <= 6 ? 'MEDIUM' : 
                        priority <= 8 ? 'HIGH' : 
                        priority > 8 ? 'URGENT' : story.priority;
    
    // Update the story
    await story.update({
      title: title || story.title,
      userStory: userStoryText,
      definitionOfDone,
      parentId,
      status: taskStatus,
      priority: taskPriority,
      estimatedHours: points !== undefined ? points : story.estimatedHours,
      stepsToReproduce: technicalConsiderations !== undefined ? technicalConsiderations : story.stepsToReproduce,
      gitRepo: designConsiderations !== undefined ? designConsiderations : story.gitRepo,
      assignedTo: assignedTo || story.assignedTo,
      createdBy: createdBy || story.createdBy
    });
    
    // Extract user type, action, benefit from updated userStory
    let updatedUserType = story.assignedTo || 'User';
    let updatedAction = '';
    let updatedBenefit = '';
    
    if (story.userStory) {
      const match = story.userStory.match(/As a (.*?), I want to (.*?) so that (.*)/i);
      if (match && match.length >= 4) {
        updatedUserType = match[1].trim();
        updatedAction = match[2].trim();
        updatedBenefit = match[3].trim();
      }
    }
    
    // Parse acceptance criteria
    const updatedAcceptanceCriteria = story.definitionOfDone ? 
      story.definitionOfDone.split('\n').filter(line => line.trim().length > 0) : [];
    
    // Format response
    const formattedStory = {
      id: story.id.toString(),
      epicId: parentId && epicId ? parentId.toString() : null,
      jtbdId: parentId && jtbdId ? parentId.toString() : null,
      title: story.title,
      userType: updatedUserType,
      action: updatedAction,
      benefit: updatedBenefit,
      acceptanceCriteria: updatedAcceptanceCriteria,
      priority: priority || (story.priority === 'LOW' ? 3 : 
               story.priority === 'MEDIUM' ? 5 : 
               story.priority === 'HIGH' ? 7 : 
               story.priority === 'URGENT' ? 10 : 5),
      points: story.estimatedHours ? Math.ceil(story.estimatedHours) : null,
      status: status || (story.status === 'TO_DO' ? 'backlog' : 
             story.status === 'IN_PROGRESS' ? 'in_progress' : 
             story.status === 'DONE' ? 'done' : 
             story.status === 'IN_REVIEW' ? 'review' : 'backlog'),
      technicalConsiderations: story.stepsToReproduce || '',
      designConsiderations: story.gitRepo || '',
      createdBy: story.createdBy || '',
      assignedTo: story.assignedTo || '',
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString()
    };
    
    res.json(formattedStory);
  } catch (error) {
    console.error('Error updating user story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user story
router.delete('/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    
    // Find the story
    const story = await Task.findByPk(storyId);
    
    if (!story) {
      return res.status(404).json({ error: 'User story not found' });
    }
    
    // Delete the story
    await story.destroy();
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 