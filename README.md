# K-Scents — Heritage of Kannauj

A full-stack e-commerce platform for premium attars and natural fragrances, rooted in the ancient perfumery traditions of Kannauj.

## Project Structure

```
K-Scents/
├── backend/                 # Express.js API server (MVC)
│   ├── config/              # Database connection
│   ├── controllers/         # Route handlers (business logic)
│   ├── middleware/           # Auth, error handling
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express route definitions
│   ├── seeder.js            # Database seed script
│   ├── server.js            # Entry point
│   ├── .env                 # Environment variables (not committed)
│   └── package.json
├── frontend/                # React + Vite SPA
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context providers
│   │   ├── pages/           # Route-level page components
│   │   ├── services/        # API service layer
│   │   ├── styles/          # Shared stylesheets
│   │   ├── App.jsx          # Root component with routing
│   │   ├── main.jsx         # Vite entry point
│   │   └── index.css        # Global styles & design tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── .env                 # Frontend env (VITE_API_URL)
│   └── package.json
├── package.json             # Root scripts (orchestration)
├── vercel.json              # Vercel deployment config
└── .gitignore
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Configure environment

**Backend** — copy `backend/.env.example` to `backend/.env` and fill in values:
```env
MONGO_URI=mongodb://localhost:27017/kscents
JWT_SECRET=your_secret_key
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed database (optional)
```bash
npm run seed
```

### 4. Run development servers
In **two terminals**:
```bash
# Terminal 1 — Backend (port 5000)
npm run dev:backend

# Terminal 2 — Frontend (port 3000)
npm run dev:frontend
```

Or just run both with: `npm run dev` (if using bash/zsh).

## Tech Stack

| Layer    | Technology                            |
|----------|---------------------------------------|
| Frontend | React 19, Vite 7, React Router 7     |
| Backend  | Express 5, Mongoose 8, JWT           |
| Database | MongoDB                               |
| Styling  | CSS custom properties (Kannauj theme) |

## Features
- Product catalog with search, filters, sorting
- User auth (register/login/profile)
- Shopping cart with coupon support
- Multi-step checkout (Cash on Delivery)
- Order history & tracking
- Wishlist
- Product reviews
- Admin dashboard (products, orders, customers)
- Rate limiting & error handling
- Responsive luxury Kannauj heritage design
