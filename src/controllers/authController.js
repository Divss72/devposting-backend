import { asyncHandler } from '../utils/asyncHandler.js';

export const getMe = asyncHandler(async (req, res) => {
  return res.json({
    user: {
      id: req.user._id,
      firebaseUid: req.user.firebaseUid,
      username: req.user.username,
      email: req.user.email,
      bio: req.user.bio,
      avatar: req.user.avatar,
      authProvider: req.user.authProvider,
      createdAt: req.user.createdAt,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { bio, avatar, username } = req.body;
  
  if (bio !== undefined) req.user.bio = bio;
  if (avatar !== undefined) req.user.avatar = avatar;
  if (username !== undefined) req.user.username = username;
  
  await req.user.save();
  
  return res.json({
    user: {
      id: req.user._id,
      firebaseUid: req.user.firebaseUid,
      username: req.user.username,
      email: req.user.email,
      bio: req.user.bio,
      avatar: req.user.avatar,
      authProvider: req.user.authProvider,
      createdAt: req.user.createdAt,
    },
  });
});
