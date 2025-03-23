const express = require('express');
const taskTypeRoutes = require('./taskTypeRoutes');
const taskRoutes = require('./taskRoutes');
const taskTemplateRoutes = require('./taskTemplateRoutes');

const router = express.Router();

// API routes
router.use('/task-types', taskTypeRoutes);
router.use('/tasks', taskRoutes);
router.use('/task-templates', taskTemplateRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Debug routes
router.get('/debug', (req, res) => {
  res.status(200).json({ message: 'Debug endpoint is working', success: true });
});

// Root route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Task Manager API' });
});

module.exports = router; 