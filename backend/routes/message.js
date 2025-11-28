const express = require('express');
const router = express.Router();

const {getMessage} = require('../controllers/message');

router.get('/', getMessage);

module.exports = router;