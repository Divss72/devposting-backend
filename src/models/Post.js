import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    content: { type: String, required: true },
    excerpt: { type: String, default: '', maxlength: 300 },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: { type: [String], default: [] },
    category: { type: String, default: 'general' },
    slug: { type: String, required: true, unique: true, index: true },
    voteCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    postType: {
      type: String,
      enum: ['blog', 'project'],
      default: 'blog',
      index: true,
    },
    project: {
      techStack: { type: [String], default: [] },
      demoLink: { type: String, default: '' },
      githubLink: { type: String, default: '' },
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1, status: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ category: 1 });

export const Post = mongoose.model('Post', postSchema);
