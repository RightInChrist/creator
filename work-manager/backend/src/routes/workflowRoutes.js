const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');

// GET all workflows
router.get('/', workflowController.getAllWorkflows);

// GET workflow by ID
router.get('/:id', workflowController.getWorkflowById);

// POST create new workflow
router.post('/', workflowController.createWorkflow);

// PUT update workflow
router.put('/:id', workflowController.updateWorkflow);

// DELETE workflow
router.delete('/:id', workflowController.deleteWorkflow);

// PATCH update workflow status
router.patch('/:id/status', workflowController.changeWorkflowStatus);

module.exports = router; 