import { Router } from 'express';
import {
  createComment,
  getCommentsByPost,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createCommentSchema,
  postCommentsSchema,
} from '../validators/commentValidators.js';

const router = Router();

router.post('/comments', protect, validate(createCommentSchema), createComment);
router.get('/comments/:postId', validate(postCommentsSchema), getCommentsByPost);

export default router;
