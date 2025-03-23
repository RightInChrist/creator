const fs = require('fs');
const path = require('path');
const sequelize = require('./src/config/database');
const { TaskType, Task } = require('./src/models');

async function dumpData() {
  try {
    // Initialize database connection
    await sequelize.authenticate();
    console.log('Connected to database successfully');
    
    // Get all task types
    const taskTypes = await TaskType.findAll();
    fs.writeFileSync(
      path.join(__dirname, 'task-types.json'),
      JSON.stringify(taskTypes, null, 2)
    );
    console.log('Task types dumped to task-types.json');
    
    // Get all tasks
    const tasks = await Task.findAll();
    fs.writeFileSync(
      path.join(__dirname, 'tasks.json'),
      JSON.stringify(tasks, null, 2)
    );
    console.log('Tasks dumped to tasks.json');
    
    // Close the connection
    await sequelize.close();
    console.log('Database dump completed successfully');
  } catch (error) {
    console.error('Error dumping database:', error);
  }
}

dumpData(); 