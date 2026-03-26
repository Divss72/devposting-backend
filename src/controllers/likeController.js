import { Like } from '../models/Like.js';
import { Post } from '../models/Post.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.validated.params;
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const existing = await Like.findOne({ postId, userId: req.user._id });
  if (existing) {
    await Like.deleteOne({ _id: existing._id });
  } else {
    await Like.create({ postId, userId: req.user._id });
  }

  const likeCount = await Like.countDocuments({ postId });
  return res.json({
    liked: !existing,
    likeCount,
  });
});
