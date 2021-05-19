'use strict';

const express = require('express');
const router = express.Router();

const { getAdminData } = require('../controllers/AdminController');

/* GET home page. */
router.get('/', getAdminData);

module.exports = router;