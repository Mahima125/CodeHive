const express = require('express');
const router = express.Router();
const {code} = require('../controllers/codeController');


router.post('/', code);


module.exports = router;