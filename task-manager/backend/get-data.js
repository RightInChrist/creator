const sequelize = require('./src/config/database');
const { TaskType, Task } = require('./src/models');

async function getData() {
  try {
    // Initialize database connection
    await sequelize.authenticate();
    console.log('Connected to database successfully');
    
    // Get all task types
    const taskTypes = await TaskType.findAll();
    console.log('Task Types:');
    console.log(JSON.stringify(taskTypes, null, 2));
    
    // Get all tasks
    const tasks = await Task.findAll();
    console.log('\nTasks:');
    console.log(JSON.stringify(tasks, null, 2));
    
    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error('Error accessing database:', error);
  }
}

getData(); 