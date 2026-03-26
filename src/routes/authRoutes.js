import { Router } from 'express';
import { getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);

export default router;
