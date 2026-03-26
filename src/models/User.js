import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 280,
      default: '',
    },
    avatar: {
      type: String,
      trim: true,
      default: '',
    },
    authProvider: {
      type: String,
      enum: ['email', 'github', 'google'],
      default: 'email',
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
