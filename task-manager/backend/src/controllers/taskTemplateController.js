const { TaskTemplate, Task, TaskType } = require('../models');

// Get all task templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await TaskTemplate.findAll();
    return res.status(200).json(templates);
  } catch (error) {
    console.error('Error getting task templates:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get task template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await TaskTemplate.findByPk(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Task template not found' });
    }
    
    return res.status(200).json(template);
  } catch (error) {
    console.error('Error getting task template:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Create new task template
exports.createTemplate = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      templateStructure, 
      variables,
      defaultValues,
      createdBy 
    } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    if (!templateStructure) {
      return res.status(400).json({ message: 'Template structure is required' });
    }
    
    const newTemplate = await TaskTemplate.create({
      name,
      description,
      templateStructure,
      variables,
      defaultValues,
      createdBy
    });
    
    return res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error creating task template:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update task template
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      templateStructure, 
      variables,
      defaultValues
    } = req.body;
    
    const template = await TaskTemplate.findByPk(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Task template not found' });
    }
    
    await template.update({
      name: name || template.name,
      description: description !== undefined ? description : template.description,
      templateStructure: templateStructure || template.templateStructure,
      variables: variables !== undefined ? variables : template.variables,
      defaultValues: defaultValues !== undefined ? defaultValues : template.defaultValues
    });
    
    return res.status(200).json(template);
  } catch (error) {
    console.error('Error updating task template:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete task template
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await TaskTemplate.findByPk(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Task template not found' });
    }
    
    await template.destroy();
    
    return res.status(200).json({ message: 'Task template deleted successfully' });
  } catch (error) {
    console.error('Error deleting task template:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Generate tasks from template
exports.generateTasksFromTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { variables } = req.body;
    
    // Get the template
    const template = await TaskTemplate.findByPk(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Task template not found' });
    }
    
    // Merge provided variables with default values
    const mergedVariables = { ...template.defaultValues, ...variables };
    
    // Get task structure and replace variables
    const taskStructure = template.templateStructure;
    
    // Process task structure and create tasks
    const createdTasks = await processTaskStructure(taskStructure, mergedVariables);
    
    return res.status(201).json({
      message: 'Tasks generated successfully',
      tasks: createdTasks
    });
  } catch (error) {
    console.error('Error generating tasks from template:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Helper function to process task structure and create tasks
const processTaskStructure = async (taskStructure, variables) => {
  const createdTasks = [];
  
  // Process each task in the structure
  for (const taskTemplate of taskStructure) {
    // Replace variables in task fields
    const processedTask = replaceVariables(taskTemplate, variables);
    
    // Create the task
    const taskData = {
      title: processedTask.title,
      description: processedTask.description,
      taskTypeId: processedTask.taskTypeId,
      status: processedTask.status || 'TO_DO',
      priority: processedTask.priority || 'MEDIUM',
      dueDate: processedTask.dueDate,
      estimatedHours: processedTask.estimatedHours,
      assignedTo: processedTask.assignedTo,
      createdBy: processedTask.createdBy,
      gitRepo: processedTask.gitRepo,
      product: processedTask.product,
      feature: processedTask.feature,
      jobToBeDone: processedTask.jobToBeDone,
      userStory: processedTask.userStory,
      stepsToReproduce: processedTask.stepsToReproduce,
      definitionOfDone: processedTask.definitionOfDone
    };
    
    // Create the task
    const createdTask = await Task.create(taskData);
    
    // Store the task with its original ID from the template for subtask relationships
    const taskWithTemplateId = {
      ...createdTask.toJSON(),
      templateId: taskTemplate.id
    };
    
    createdTasks.push(taskWithTemplateId);
    
    // Process subtasks if any
    if (taskTemplate.subtasks && taskTemplate.subtasks.length > 0) {
      // Create the subtasks with parent set to the current task
      for (const subtaskTemplate of taskTemplate.subtasks) {
        // Replace variables in subtask fields
        const processedSubtask = replaceVariables(subtaskTemplate, variables);
        
        // Create the subtask
        const subtaskData = {
          title: processedSubtask.title,
          description: processedSubtask.description,
          taskTypeId: processedSubtask.taskTypeId,
          status: processedSubtask.status || 'TO_DO',
          priority: processedSubtask.priority || 'MEDIUM',
          dueDate: processedSubtask.dueDate,
          estimatedHours: processedSubtask.estimatedHours,
          assignedTo: processedSubtask.assignedTo,
          createdBy: processedSubtask.createdBy,
          parentId: createdTask.id, // Link to parent task
          gitRepo: processedSubtask.gitRepo,
          product: processedSubtask.product,
          feature: processedSubtask.feature,
          jobToBeDone: processedSubtask.jobToBeDone,
          userStory: processedSubtask.userStory,
          stepsToReproduce: processedSubtask.stepsToReproduce,
          definitionOfDone: processedSubtask.definitionOfDone
        };
        
        // Create the subtask
        const createdSubtask = await Task.create(subtaskData);
        
        // Store the subtask with its template ID
        createdTasks.push({
          ...createdSubtask.toJSON(),
          templateId: subtaskTemplate.id
        });
      }
    }
  }
  
  // Process related tasks by linking them
  await processRelatedTasks(taskStructure, createdTasks);
  
  return createdTasks;
};

// Helper function to process related tasks from template
const processRelatedTasks = async (taskStructure, createdTasks) => {
  // Create a map for easy lookup of template ID to actual task ID
  const taskIdMap = {};
  createdTasks.forEach(task => {
    taskIdMap[task.templateId] = task.id;
  });
  
  // Process related tasks
  for (const taskTemplate of taskStructure) {
    if (taskTemplate.relatedTasks && taskTemplate.relatedTasks.length > 0) {
      // Get the created task ID from the template ID
      const taskId = taskIdMap[taskTemplate.id];
      if (!taskId) continue;
      
      // Get the actual task
      const task = await Task.findByPk(taskId);
      if (!task) continue;
      
      // Map template related task IDs to actual task IDs
      const relatedTaskIds = taskTemplate.relatedTasks
        .map(templateId => taskIdMap[templateId])
        .filter(id => id !== undefined);
      
      // Update related tasks
      if (relatedTaskIds.length > 0) {
        await task.update({ relatedTasks: relatedTaskIds });
      }
    }
  }
};

// Helper function to replace variables in template fields
const replaceVariables = (template, variables) => {
  const result = { ...template };
  
  // Process string fields with variable replacements
  for (const key in result) {
    if (typeof result[key] === 'string') {
      // Replace {{variableName}} with its value
      result[key] = result[key].replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
        return variables[variableName] !== undefined ? variables[variableName] : match;
      });
    }
  }
  
  return result;
}; 