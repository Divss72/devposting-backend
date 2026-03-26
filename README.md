# DevPosting Backend (Express + MongoDB)

Production-ready backend for auth, blogging, project showcase, comments, and likes.

## Folder Structure

```
backend/
  src/
    config/
      db.js
      env.js
    controllers/
      authController.js
      postController.js
      commentController.js
      likeController.js
    middleware/
      auth.js
      error.js
      rateLimiter.js
      validate.js
    models/
      User.js
      Post.js
      Comment.js
      Like.js
    routes/
      authRoutes.js
      postRoutes.js
      commentRoutes.js
      likeRoutes.js
      healthRoutes.js
    utils/
      asyncHandler.js
      generateToken.js
    validators/
      authValidators.js
      postValidators.js
      commentValidators.js
    app.js
    server.js
  .env.example
  package.json
```

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create `.env` from `.env.example` and fill real values.

3. Start server:

```bash
npm run dev
```

API base URL: `http://localhost:5000/api`

## Implemented API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Posts
- `GET /api/posts?page=1&limit=10&status=published&tag=react&category=web&postType=blog`
- `POST /api/posts` (auth required)
- `PUT /api/posts/:id` (auth required, owner only)
- `DELETE /api/posts/:id` (auth required, owner only)

### Comments
- `POST /api/comments` (auth required)
- `GET /api/comments/:postId?page=1&limit=20`

### Likes
- `POST /api/like/:postId` (auth required, toggle like/unlike)

### Health
- `GET /api/health`

## Data Model Summary

### Users
- `id`, `username`, `email`, `password(hash)`, `bio`, `avatar`, `createdAt`

### Posts
- `id`, `title`, `content`, `authorId`, `tags`, `category`, `status`, `postType`, `project`, `createdAt`
- Project fields:
  - `project.techStack[]`
  - `project.demoLink`
  - `project.githubLink`

### Comments
- `id`, `postId`, `userId`, `content`, `createdAt`

### Likes
- `userId`, `postId` (unique pair), `createdAt`

## Security

- JWT auth with `Authorization: Bearer <token>`
- Password hashing with bcrypt (`bcryptjs`)
- Input validation with Zod
- Rate limiting (`express-rate-limit`)
- Security headers (`helmet`)
- NoSQL injection sanitization (`express-mongo-sanitize`)
- XSS cleaning (`express-xss-sanitizer`)
- CORS allow-list via `CLIENT_URL`

## Performance Features

- Pagination on posts/comments
- Indexed fields for filtering and sorting
- Aggregated like counts in post listing
- Compressed responses (`compression`)

## Frontend Integration (Cloudflare Pages)

In your frontend (`devpulse`) add:

```env
VITE_API_BASE_URL=https://<your-backend-domain>/api
```

Example API call:

```js
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const res = await fetch(`${API_BASE}/posts?page=1&limit=10`);
```

Authenticated call:

```js
await fetch(`${API_BASE}/posts`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(payload),
});
```

## Deployment (Render / Railway / Vercel)

### Render (recommended)
1. Push `backend` folder to your Git repo.
2. Create new **Web Service**.
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add env vars from `.env.example`.
7. Add MongoDB Atlas connection string in `MONGODB_URI`.

### Railway
1. New Project -> Deploy from GitHub.
2. Set root to `backend`.
3. Add env vars.
4. Deploy and copy generated URL.

### Vercel
Use `@vercel/node` serverless setup only if needed. For this Express app, Render/Railway is simpler for persistent API workloads.

## Recommended Next Steps

1. Add refresh-token strategy.
2. Add RBAC/admin moderation endpoints.
3. Add Redis cache for hot feed pages.
4. Add API tests (Jest + Supertest).
5. Add OpenAPI/Swagger docs.
