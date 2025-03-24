const express = require('express');
const taskTypeRoutes = require('./taskTypeRoutes');
const taskRoutes = require('./taskRoutes');
const taskTemplateRoutes = require('./taskTemplateRoutes');
const epicRoutes = require('./epics');
const jtbdRoutes = require('./jtbd');
const storyRoutes = require('./stories');
const requirementsRoutes = require('./requirements');

const router = express.Router();

// API routes
router.use('/task-types', taskTypeRoutes);
router.use('/tasks', taskRoutes);
router.use('/task-templates', taskTemplateRoutes);

// New API v1 routes
const v1Router = express.Router();
router.use('/v1', v1Router);

v1Router.use('/epics', epicRoutes);
v1Router.use('/jtbd', jtbdRoutes);
v1Router.use('/stories', storyRoutes);
v1Router.use('/requirements', requirementsRoutes);

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