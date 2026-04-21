# 🚀 BlogX: Modern Blogging Platform

---

## 🛠️ Setup & Installation

### 1. Backend Setup
```bash
cd server
npm install
# Copy .env.example to .env and configure variables
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
# Copy .env.example to .env and configure variables
npm run dev
```

### 3. Initialize Admin
Run this in the `/server` directory to create the default administrator:
```bash
npm run seed:admin
```
**Admin Credentials:**
- **Email**: `admin@blogx.com`
- **Password**: `Admin@123`

---

## 🛣️ API Routes Overview

### 🔐 Authentication (`/api/v1/auth`)
- `POST /register`: Create new author
- `POST /login`: Authenticate & receive tokens
- `POST /refresh-token`: Refresh expired access token
- `POST /logout`: Revoke session
- `GET /me`: Get current user profile

### 📝 Posts (`/api/v1/posts`)
- `GET /`: Get all published posts (Public)
- `GET /my`: Get posts for dashboard (Role-based)
- `GET /stats`: Get post statistics (Role-based)
- `GET /:id`: Get single post details
- `POST /`: Create new post (Image upload supported)
- `PUT /:id`: Update post
- `PATCH /:id/status`: Update post status (Draft/Published)
- `DELETE /:id`: Delete post

### 💬 Comments (`/api/v1/comments`)
- `GET /post/:postId`: Get comments for a specific post
- `POST /`: Add a new comment
- `PATCH /:id`: Update own comment
- `DELETE /:id`: Delete own comment

---

## 💻 Tech Stack
- **Frontend**: React (Vite), TanStack Query, TailwindCSS, Shadcn/UI
- **Backend**: Node.js, Express, MongoDB (Mongoose),Typescript
- **Auth**: JWT + Cookie Storage

---

Developed with ❤️ by **Kelash Kumar** for the **Full Stack Developer**.
