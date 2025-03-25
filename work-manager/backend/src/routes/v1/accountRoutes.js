const express = require('express');
const router = express.Router();
const accountController = require('../../controllers/accountController');

// GET /api/v1/accounts
router.get('/', accountController.getAllAccounts);

// GET /api/v1/accounts/:id
router.get('/:id', accountController.getAccountById);

// POST /api/v1/accounts
router.post('/', accountController.createAccount);

// PUT /api/v1/accounts/:id
router.put('/:id', accountController.updateAccount);

// DELETE /api/v1/accounts/:id
router.delete('/:id', accountController.deleteAccount);

module.exports = router; 