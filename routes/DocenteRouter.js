'use strict';

const express = require('express');
const router = express.Router();

const { getDocentesData } = require('../controllers/DocenteController');

/* GET users listing. */
router.get('/', getDocentesData);

module.exports = router;