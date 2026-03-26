import { Router } from 'express';
import {
  createPost,
  deletePost,
  getPosts,
  getPostBySlug,
  getUserPosts,
  updatePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createPostSchema,
  listPostsSchema,
  postIdSchema,
  postSlugSchema,
  userIdSchema,
  updatePostSchema,
} from '../validators/postValidators.js';

const router = Router();

router.get('/posts', validate(listPostsSchema), getPosts);
router.get('/posts/slug/:slug', validate(postSlugSchema), getPostBySlug);
router.get('/posts/user/:userId', validate(userIdSchema), getUserPosts); 
router.post('/posts', protect, validate(createPostSchema), createPost);
router.put('/posts/:id', protect, validate(updatePostSchema), updatePost);
router.delete('/posts/:id', protect, validate(postIdSchema), deletePost);

export default router;
