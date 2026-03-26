import slugify from 'slugify';
import { Like } from '../models/Like.js';
import { Post } from '../models/Post.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getPosts = asyncHandler(async (req, res) => {
  const { page, limit, status, tag, category, postType } = req.validated.query;

  const filter = {};
  if (status) filter.status = status;
  if (tag) filter.tags = tag;
  if (category) filter.category = category;
  if (postType) filter.postType = postType;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'username bio avatar'),
    Post.countDocuments(filter),
  ]);

  const postIds = items.map((p) => p._id);
  const likes = await Like.aggregate([
    { $match: { postId: { $in: postIds } } },
    { $group: { _id: '$postId', count: { $sum: 1 } } },
  ]);
  const likeMap = new Map(likes.map((l) => [l._id.toString(), l.count]));

  return res.json({
    data: items.map((post) => ({
      ...post.toObject(),
      likeCount: likeMap.get(post._id.toString()) || 0,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const createPost = asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const publishedAt = payload.status === 'published' ? new Date() : null;

  // Generate unique slug
  let baseSlug = slugify(payload.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (await Post.exists({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const post = await Post.create({
    ...payload,
    slug,
    authorId: req.user._id,
    publishedAt,
  });
  return res.status(201).json(post);
});

export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const updates = req.validated.body;

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.authorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden: not your post' });
  }

  Object.assign(post, updates);
  if (updates.status === 'published' && !post.publishedAt) {
    post.publishedAt = new Date();
  }

  await post.save();
  return res.json(post);
});

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.authorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden: not your post' });
  }

  await Post.deleteOne({ _id: id });
  return res.json({ message: 'Post deleted' });
});

export const getPostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.validated.params;

  const post = await Post.findOneAndUpdate(
    { slug },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate('authorId', 'username bio avatar');

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const likeCount = await Like.countDocuments({ postId: post._id });

  return res.json({
    ...post.toObject(),
    likeCount,
  });
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const { userId } = req.validated.params;
  const { page, limit } = req.validated.query;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Post.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'username avatar'),
    Post.countDocuments({ authorId: userId }),
  ]);

  const postIds = items.map((p) => p._id);
  const likes = await Like.aggregate([
    { $match: { postId: { $in: postIds } } },
    { $group: { _id: '$postId', count: { $sum: 1 } } },
  ]);
  const likeMap = new Map(likes.map((l) => [l._id.toString(), l.count]));

  return res.json({
    data: items.map((post) => ({
      ...post.toObject(),
      likeCount: likeMap.get(post._id.toString()) || 0,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
