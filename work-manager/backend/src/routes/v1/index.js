const express = require('express');
const router = express.Router();
const accountRoutes = require('./accountRoutes');
const projectRoutes = require('./projectRoutes');
const conversationRoutes = require('./conversationRoutes');

router.use('/accounts', accountRoutes);
router.use('/projects', projectRoutes);
router.use('/conversations', conversationRoutes);

module.exports = router; 