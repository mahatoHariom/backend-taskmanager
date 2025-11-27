import { Router } from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController';
import { registerValidator, loginValidator } from '../validators/authValidator';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

// Protected routes
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
