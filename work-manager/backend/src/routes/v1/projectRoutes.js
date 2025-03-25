const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/projectController');

// GET /api/v1/projects
router.get('/', projectController.getAllProjects);

// GET /api/v1/projects/:id
router.get('/:id', projectController.getProjectById);

// POST /api/v1/projects
router.post('/', projectController.createProject);

// PUT /api/v1/projects/:id
router.put('/:id', projectController.updateProject);

// DELETE /api/v1/projects/:id
router.delete('/:id', projectController.deleteProject);

module.exports = router; 