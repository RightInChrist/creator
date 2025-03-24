const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskType = require('../models/TaskType');
const { Op } = require('sequelize');

// Get all jobs to be done
router.get('/', async (req, res) => {
  try {
    // Find all tasks with jobToBeDone field populated
    const jtbds = await Task.findAll({
      where: {
        jobToBeDone: {
          [Op.not]: null,
          [Op.ne]: ''
        }
      },
      include: [
        {
          model: TaskType,
          as: 'taskType',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Map to the JTBD format in the swagger schema
    const formattedJtbds = jtbds.map(jtbd => ({
      id: jtbd.id.toString(),
      epicId: jtbd.taskType && jtbd.taskType.name === 'Epic' ? jtbd.id.toString() : null, // If it's an Epic, it's its own epicId
      statement: jtbd.title,
      userType: jtbd.assignedTo || 'User', // Default to User if not specified
      contextualDetails: jtbd.description || '',
      motivations: jtbd.feature || '', // Reuse feature field
      expectedOutcome: jtbd.definitionOfDone || '',
      priority: jtbd.priority === 'LOW' ? 3 : 
               jtbd.priority === 'MEDIUM' ? 5 : 
               jtbd.priority === 'HIGH' ? 7 : 
               jtbd.priority === 'URGENT' ? 10 : 5,
      status: jtbd.status === 'TO_DO' ? 'identified' : 
             jtbd.status === 'IN_PROGRESS' ? 'in_progress' : 
             jtbd.status === 'DONE' ? 'completed' : 
             jtbd.status === 'IN_REVIEW' ? 'validated' : 'identified',
      createdBy: jtbd.createdBy || '',
      createdAt: jtbd.createdAt.toISOString(),
      updatedAt: jtbd.updatedAt.toISOString()
    }));
    
    res.json(formattedJtbds);
  } catch (error) {
    console.error('Error fetching jobs to be done:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new job to be done
router.post('/', async (req, res) => {
  try {
    const { 
      epicId, statement, userType, contextualDetails, 
      motivations, expectedOutcome, priority, status, createdBy 
    } = req.body;
    
    // Validate required fields
    if (!statement || !userType || !expectedOutcome) {
      return res.status(400).json({ error: 'Statement, userType, and expectedOutcome are required' });
    }
    
    // Find the taskTypeId to use - if epicId is provided, it'll be a child of an Epic
    let taskTypeId;
    let parentId = null;
    
    if (epicId) {
      // Find the Epic type
      const epicType = await TaskType.findOne({ where: { name: 'Epic' } });
      if (!epicType) {
        return res.status(404).json({ error: 'Epic task type not found' });
      }
      
      // Verify the epic exists
      const epic = await Task.findOne({
        where: { 
          id: epicId,
          taskTypeId: epicType.id
        }
      });
      
      if (!epic) {
        return res.status(404).json({ error: 'Epic not found' });
      }
      
      // Use Story type and set parent to epic
      const storyType = await TaskType.findOne({ where: { name: 'Story' } });
      if (!storyType) {
        return res.status(404).json({ error: 'Story task type not found' });
      }
      
      taskTypeId = storyType.id;
      parentId = epicId;
    } else {
      // No epic specified, make it an independent JTBD
      // We'll use the Story type
      const storyType = await TaskType.findOne({ where: { name: 'Story' } });
      if (!storyType) {
        return res.status(404).json({ error: 'Story task type not found' });
      }
      
      taskTypeId = storyType.id;
    }
    
    // Map status and priority to our existing enum values
    const taskStatus = status === 'identified' ? 'TO_DO' : 
                      status === 'validated' ? 'IN_REVIEW' : 
                      status === 'in_progress' ? 'IN_PROGRESS' : 
                      status === 'completed' ? 'DONE' : 'TO_DO';
    
    const taskPriority = priority <= 3 ? 'LOW' : 
                        priority <= 6 ? 'MEDIUM' : 
                        priority <= 8 ? 'HIGH' : 'URGENT';
    
    // Create new JTBD as a Task
    const jtbd = await Task.create({
      title: statement,
      description: contextualDetails || '',
      jobToBeDone: statement, // The statement is the JTBD
      feature: motivations || '', // Reuse feature field for motivations
      definitionOfDone: expectedOutcome || '',
      taskTypeId,
      parentId,
      status: taskStatus,
      priority: taskPriority,
      assignedTo: userType, // Use assignedTo for userType
      createdBy
    });
    
    // Format response to match JTBD schema
    const formattedJtbd = {
      id: jtbd.id.toString(),
      epicId: parentId ? parentId.toString() : null,
      statement: jtbd.title,
      userType: jtbd.assignedTo || 'User',
      contextualDetails: jtbd.description || '',
      motivations: jtbd.feature || '',
      expectedOutcome: jtbd.definitionOfDone || '',
      priority: priority || 5,
      status: status || 'identified',
      createdBy: jtbd.createdBy || '',
      createdAt: jtbd.createdAt.toISOString(),
      updatedAt: jtbd.updatedAt.toISOString()
    };
    
    res.status(201).json(formattedJtbd);
  } catch (error) {
    console.error('Error creating job to be done:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get job to be done by ID
router.get('/:jtbdId', async (req, res) => {
  try {
    const { jtbdId } = req.params;
    
    // Get the JTBD
    const jtbd = await Task.findByPk(jtbdId, {
      include: [
        {
          model: Task, 
          as: 'parent',
          attributes: ['id', 'title', 'taskTypeId'],
          include: [
            {
              model: TaskType,
              as: 'taskType',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: TaskType,
          as: 'taskType',
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!jtbd || !jtbd.jobToBeDone) {
      return res.status(404).json({ error: 'Job to be done not found' });
    }
    
    // Determine epicId based on parentage
    let epicId = null;
    if (jtbd.parent && jtbd.parent.taskType && jtbd.parent.taskType.name === 'Epic') {
      epicId = jtbd.parent.id.toString();
    }
    // If this task itself is an Epic, it's its own epicId
    else if (jtbd.taskType && jtbd.taskType.name === 'Epic') {
      epicId = jtbd.id.toString();
    }
    
    // Format response to match JTBD schema
    const formattedJtbd = {
      id: jtbd.id.toString(),
      epicId,
      statement: jtbd.title,
      userType: jtbd.assignedTo || 'User',
      contextualDetails: jtbd.description || '',
      motivations: jtbd.feature || '',
      expectedOutcome: jtbd.definitionOfDone || '',
      priority: jtbd.priority === 'LOW' ? 3 : 
               jtbd.priority === 'MEDIUM' ? 5 : 
               jtbd.priority === 'HIGH' ? 7 : 
               jtbd.priority === 'URGENT' ? 10 : 5,
      status: jtbd.status === 'TO_DO' ? 'identified' : 
             jtbd.status === 'IN_PROGRESS' ? 'in_progress' : 
             jtbd.status === 'DONE' ? 'completed' : 
             jtbd.status === 'IN_REVIEW' ? 'validated' : 'identified',
      createdBy: jtbd.createdBy || '',
      createdAt: jtbd.createdAt.toISOString(),
      updatedAt: jtbd.updatedAt.toISOString()
    };
    
    res.json(formattedJtbd);
  } catch (error) {
    console.error('Error fetching job to be done:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update job to be done
router.put('/:jtbdId', async (req, res) => {
  try {
    const { jtbdId } = req.params;
    const { 
      epicId, statement, userType, contextualDetails, 
      motivations, expectedOutcome, priority, status, createdBy 
    } = req.body;
    
    // Find the JTBD
    const jtbd = await Task.findByPk(jtbdId);
    
    if (!jtbd || !jtbd.jobToBeDone) {
      return res.status(404).json({ error: 'Job to be done not found' });
    }
    
    // If epicId provided and changed, update parent
    let parentId = jtbd.parentId;
    
    if (epicId && (!jtbd.parentId || epicId.toString() !== jtbd.parentId.toString())) {
      // Find the Epic
      const epic = await Task.findOne({
        where: { id: epicId },
        include: [
          {
            model: TaskType,
            as: 'taskType',
            attributes: ['id', 'name']
          }
        ]
      });
      
      if (!epic || !epic.taskType || epic.taskType.name !== 'Epic') {
        return res.status(404).json({ error: 'Epic not found' });
      }
      
      parentId = epic.id;
    }
    
    // Map status and priority to our existing enum values
    const taskStatus = status === 'identified' ? 'TO_DO' : 
                      status === 'validated' ? 'IN_REVIEW' : 
                      status === 'in_progress' ? 'IN_PROGRESS' : 
                      status === 'completed' ? 'DONE' : jtbd.status;
    
    const taskPriority = priority <= 3 ? 'LOW' : 
                        priority <= 6 ? 'MEDIUM' : 
                        priority <= 8 ? 'HIGH' : 
                        priority > 8 ? 'URGENT' : jtbd.priority;
    
    // Update JTBD
    await jtbd.update({
      title: statement || jtbd.title,
      jobToBeDone: statement || jtbd.jobToBeDone,
      description: contextualDetails !== undefined ? contextualDetails : jtbd.description,
      feature: motivations !== undefined ? motivations : jtbd.feature,
      definitionOfDone: expectedOutcome !== undefined ? expectedOutcome : jtbd.definitionOfDone,
      parentId,
      status: taskStatus,
      priority: taskPriority,
      assignedTo: userType || jtbd.assignedTo,
      createdBy: createdBy || jtbd.createdBy
    });
    
    // Format response to match JTBD schema
    const formattedJtbd = {
      id: jtbd.id.toString(),
      epicId: parentId ? parentId.toString() : null,
      statement: jtbd.title,
      userType: jtbd.assignedTo || 'User',
      contextualDetails: jtbd.description || '',
      motivations: jtbd.feature || '',
      expectedOutcome: jtbd.definitionOfDone || '',
      priority: priority || (jtbd.priority === 'LOW' ? 3 : 
               jtbd.priority === 'MEDIUM' ? 5 : 
               jtbd.priority === 'HIGH' ? 7 : 
               jtbd.priority === 'URGENT' ? 10 : 5),
      status: status || (jtbd.status === 'TO_DO' ? 'identified' : 
             jtbd.status === 'IN_PROGRESS' ? 'in_progress' : 
             jtbd.status === 'DONE' ? 'completed' : 
             jtbd.status === 'IN_REVIEW' ? 'validated' : 'identified'),
      createdBy: jtbd.createdBy || '',
      createdAt: jtbd.createdAt.toISOString(),
      updatedAt: jtbd.updatedAt.toISOString()
    };
    
    res.json(formattedJtbd);
  } catch (error) {
    console.error('Error updating job to be done:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete job to be done
router.delete('/:jtbdId', async (req, res) => {
  try {
    const { jtbdId } = req.params;
    
    // Find the JTBD
    const jtbd = await Task.findByPk(jtbdId);
    
    if (!jtbd || !jtbd.jobToBeDone) {
      return res.status(404).json({ error: 'Job to be done not found' });
    }
    
    // Delete the JTBD
    await jtbd.destroy();
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting job to be done:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 