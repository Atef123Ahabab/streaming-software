# 🎬 StreamHub

A global streaming platform for movies and anime, built with React, Node.js, and MongoDB.

![StreamHub](https://img.shields.io/badge/status-in%20development-ff00aa)
![License](https://img.shields.io/badge/license-MIT-00f0ff)

## 🌟 Features

### 🔐 Authentication
- User registration and login
- JWT-based sessions
- Protected routes

### 🎬 Content Library
- Upload movies, anime, artwork (up to 100MB)
- Personal library with poster-style grid
- Filter by type (video / image)
- Stream or download content

### 💾 Storage
- 10GB per user
- Real-time usage tracking
- Neon cyberpunk theme

## 🛠 Tech Stack

**Frontend:** React · Tailwind CSS · React Router · Axios  
**Backend:** Node.js · Express · MongoDB · JWT · Multer

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally or on Atlas

### Install

\`\`\`bash
cd backend && npm install
cd ../frontend && npm install
\`\`\`

### Configure

Create \`backend/.env\`:

\`\`\`env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/streamhub
JWT_SECRET=change_this_to_a_long_random_string
\`\`\`

### Run

**Terminal 1 — Backend:**
\`\`\`bash
cd backend && npm run dev
\`\`\`

**Terminal 2 — Frontend:**
\`\`\`bash
cd frontend && npm start
\`\`\`

Open http://localhost:3000

## 📖 Usage

1. **Register** at `/register`
2. **Sign in** at `/login`
3. **Upload** movies or anime from the dashboard
4. **Browse** your library in the grid
5. **Watch** or **delete** any item

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/files` | List your content |
| POST | `/api/files/upload` | Upload new content |
| GET | `/api/files/download/:id` | Get download URL |
| DELETE | `/api/files/:id` | Remove content |

## 🗺 Roadmap

- [x] Phase 1: Rebrand to StreamHub
- [ ] Phase 2: Video player with HLS streaming
- [ ] Phase 3: Categories (Action, Romance, Shonen...)
- [ ] Phase 4: Azure deployment + CDN
- [ ] Phase 5: User recommendations

## 📄 License

MIT — see LICENSE

---

**Built with ❤️ and neon lights**