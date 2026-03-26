import { Comment } from '../models/Comment.js';
import { Post } from '../models/Post.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createComment = asyncHandler(async (req, res) => {
  const { postId, content } = req.validated.body;
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = await Comment.create({
    postId,
    userId: req.user._id,
    content,
  });

  const populated = await comment.populate('userId', 'username avatar');
  return res.status(201).json(populated);
});

export const getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.validated.params;
  const { page, limit } = req.validated.query;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Comment.find({ postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username avatar'),
    Comment.countDocuments({ postId }),
  ]);

  return res.json({
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
