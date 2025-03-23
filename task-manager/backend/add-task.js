const sequelize = require('./src/config/database');
const { Task, TaskType } = require('./src/models');

async function addTask() {
  try {
    // Initialize database connection
    await sequelize.authenticate();
    console.log('Connected to database successfully');
    
    // Create a test task
    const newTask = await Task.create({
      title: 'Test Task',
      description: 'This is a test task created via script',
      taskTypeId: 3, // Using the 'Task' type
      status: 'TO_DO',
      priority: 'MEDIUM',
      estimatedHours: 2,
      createdBy: 'script'
    });
    
    console.log('Task created successfully:');
    console.log(JSON.stringify(newTask, null, 2));
    
    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error('Error creating task:', error);
  }
}

addTask(); 