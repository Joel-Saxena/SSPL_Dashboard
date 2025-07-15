import express from 'express';
import { login } from '../controllers/authController.js';

const router = express.Router();

// ROUTE 1: Login (POST /api/auth/login)
// Allows admin or supervisor to login with username and password
router.post('/login', login);

export default router;
