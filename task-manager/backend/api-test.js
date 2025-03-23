const express = require('express');
const sequelize = require('./src/config/database');
const { TaskType, Task } = require('./src/models');

const app = express();
const PORT = 4000;

// Basic middleware
app.use(express.json());

// Task types endpoint
app.get('/api/task-types', async (req, res) => {
  try {
    const taskTypes = await TaskType.findAll();
    res.json(taskTypes);
  } catch (error) {
    console.error('Error fetching task types:', error);
    res.status(500).json({ message: 'Error fetching task types' });
  }
});

// Tasks endpoint
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create task endpoint
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API Test Server' });
});

// Start the server
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`API test server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer(); 