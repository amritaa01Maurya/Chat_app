const express = require('express');
const router = express.Router();

const {getMessage, deleteMessage} = require('../controllers/message');

// Get all messages
router.get('/', getMessage);

// Delete a message by ID
router.delete('/:id', deleteMessage);

module.exports = router;