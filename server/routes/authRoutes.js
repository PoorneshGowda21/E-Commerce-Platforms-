import express from 'express';
import {
  registerUser,
  loginUser,
  adminLogin,
  getUserProfile,
  getAllUsers,
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);
router.get('/profile', protect, getUserProfile);
router.get('/users', protect, adminOnly, getAllUsers);

export default router;

