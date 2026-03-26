import { Router } from 'express';
import { toggleLike } from '../controllers/likeController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { likeSchema } from '../validators/commentValidators.js';

const router = Router();

router.post('/like/:postId', protect, validate(likeSchema), toggleLike);

export default router;
