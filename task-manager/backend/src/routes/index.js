const express = require('express');
const taskTypeRoutes = require('./taskTypeRoutes');
const taskRoutes = require('./taskRoutes');

const router = express.Router();

// API routes
router.use('/api/task-types', taskTypeRoutes);
router.use('/api/tasks', taskRoutes);

// Debug routes
router.get('/debug', (req, res) => {
  res.status(200).json({ message: 'Debug endpoint is working', success: true });
});

// Root route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Task Manager API' });
});

module.exports = router; 