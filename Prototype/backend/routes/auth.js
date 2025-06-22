const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ROUTE 1: Login (POST /api/auth/login)
// Allows admin or supervisor to login with username and password
router.post('/login', authController.login);

module.exports = router;
