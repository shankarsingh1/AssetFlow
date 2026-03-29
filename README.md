<div align="center">

```
 █████╗ ███████╗███████╗███████╗████████╗███████╗██╗      ██████╗ ██╗    ██╗
██╔══██╗██╔════╝██╔════╝██╔════╝╚══██╔══╝██╔════╝██║     ██╔═══██╗██║    ██║
███████║███████╗███████╗█████╗     ██║   █████╗  ██║     ██║   ██║██║ █╗ ██║
██╔══██║╚════██║╚════██║██╔══╝     ██║   ██╔══╝  ██║     ██║   ██║██║███╗██║
██║  ██║███████║███████║███████╗   ██║   ██║     ███████╗╚██████╔╝╚███╔███╔╝
╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝   ╚═╝   ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
```

**A Web2 Digital Asset Marketplace — Trade Art & Music with Credits, Not Crypto.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-asset--flow--lyart.vercel.app-6C3FC5?style=for-the-badge&logo=vercel)](https://asset-flow-lyart.vercel.app/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

</div>

---

## 🌐 Live Demo

> **[https://asset-flow-lyart.vercel.app/](https://asset-flow-lyart.vercel.app/)**

---

## 📖 What is AssetFlow?

AssetFlow is a full-stack digital asset marketplace where creators sell digital art and music, and collectors buy them — all using a **free credit-based economy**. No crypto wallets. No real money. No friction.

Every user gets **100 welcome credits** on signup and **50 free credits every 24 hours**. Sellers list assets at a credit price. Buyers purchase them. Ownership transfers instantly and atomically. Every transaction is logged as an immutable audit record.

As a bonus, any uploaded image can be transformed into a **fantasy trading card** using AI — for free, with no API key required.

---

## ✨ Features

### 👤 Auth & Users
- JWT-based authentication with **access tokens (15 min)** + **refresh tokens (7 days)**
- Refresh tokens stored in **httpOnly cookies** — never exposed to JavaScript
- Silent token refresh via **Axios interceptor** — users never get logged out mid-session
- Login rate-limited to **5 attempts per 15 minutes** per IP (brute-force protection)
- Public user profiles showing created and owned assets

### ⚡ Credit Economy
- **100 credits** gifted on registration
- **50 free credits** claimable every 24 hours — server-validated, no double-claiming
- Platform takes a **5% fee** on every sale; seller receives 95%
- Credit balance **can never go negative** — purchases blocked if insufficient funds
- Full credit earn/spend history available per user

### 🛒 Marketplace
- Browse all active listings — filter by category (art / music / collectible), sort by price or date
- Create a listing with a custom credit price (minimum 5 credits)
- Buy any listing — triggers a **MongoDB atomic transaction** covering:
  - Credit deduction from buyer
  - Credit crediting to seller (95%) and platform (5%)
  - Asset ownership transfer
  - Listing marked as sold
  - Immutable transaction log created
- Cancel your own listing at any time
- Full **ownership history** visible on every asset — see every previous owner

### 🤖 AI Card Generation
- Upload any image → click "Generate Card"
- Server builds a fantasy TCG-style prompt using the asset title
- **Pollinations.ai** returns a unique 512×768 trading card image — free, instant, no API key
- Up to **3 regenerations** per asset
- Card URL saved directly — renders in the browser immediately

### 📁 Asset Management
- Upload digital art (PNG, JPG, GIF, WebP — max 20MB) or music (MP3, WAV — max 50MB)
- Files stored on **Cloudinary** with CDN delivery
- Add title, description, category, and tags
- View all assets you own and all assets you originally created

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + Vite | UI, routing, component architecture |
| State | Zustand | Global auth state, credit balance |
| Styling | Tailwind CSS | Utility-first responsive design |
| HTTP Client | Axios | API calls + silent token refresh interceptor |
| Backend | Node.js + Express.js | REST API server |
| Database | MongoDB + Mongoose | Data persistence, atomic transactions |
| Auth | JWT (HS256) | Stateless authentication |
| File Storage | Cloudinary | Image and audio CDN hosting |
| AI Cards | Pollinations.ai | Free image generation — no API key needed |
| Security | Helmet, CORS, express-rate-limit | Headers, origin control, brute-force protection |
| Validation | express-validator | Server-side input validation on all routes |

---

## 📁 Project Structure

```
assetflow/
├── client/                        # React + Vite frontend
│   └── src/
│       ├── api/                   # Axios API functions per resource
│       ├── components/            # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── CreditBadge.jsx
│       │   ├── AssetCard.jsx
│       │   ├── AICardViewer.jsx
│       │   ├── BuyModal.jsx
│       │   ├── ClaimCreditsButton.jsx
│       │   └── OwnershipHistory.jsx
│       ├── pages/                 # Route-level page components
│       │   ├── Home.jsx
│       │   ├── Marketplace.jsx
│       │   ├── ListingDetail.jsx
│       │   ├── Upload.jsx
│       │   ├── AssetDetail.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Profile.jsx
│       │   ├── Transactions.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       └── store/                 # Zustand stores
│           ├── authStore.js
│           └── creditStore.js
│
└── server/                        # Node.js + Express backend
    ├── config/
    │   ├── db.js                  # MongoDB connection
    │   └── cloudinary.js          # Cloudinary SDK setup
    ├── models/
    │   ├── User.js
    │   ├── Asset.js
    │   ├── Listing.js
    │   └── Transaction.js
    ├── middleware/
    │   ├── authenticateJWT.js     # Token verification
    │   ├── errorHandler.js        # Global error handler
    │   └── upload.js              # Multer file validation
    ├── routes/                    # Express route definitions
    ├── controllers/               # Business logic handlers
    ├── services/
    │   ├── creditService.js       # Credit operations
    │   ├── cloudinaryService.js   # File upload/delete
    │   └── aiService.js           # Pollinations card generation
    ├── app.js
    └── server.js
```

---

## 🗄️ Database Schema Overview

### User
```
credits_balance   Number   (default: 100)
last_claim_at     Date     (null until first daily claim)
total_earned      Number   (lifetime credits earned from sales)
total_spent       Number   (lifetime credits spent on purchases)
refresh_token     String   (hashed — never stored plaintext)
```

### Asset
```
owner_id          ObjectId → User   (current owner — changes on purchase)
creator_id        ObjectId → User   (original creator — never changes)
status            'unlisted' | 'listed' | 'sold'
ai_card_url       String   (null until AI card generated)
ai_card_generation_count  Number (max 3)
```

### Listing
```
asset_id          ObjectId → Asset
seller_id         ObjectId → User
price_credits     Number (min: 5)
status            'active' | 'sold' | 'cancelled'
```

### Transaction (immutable audit log)
```
buyer_id / seller_id / asset_id / listing_id
price_credits     Number
fee_credits       Number   (5% platform cut)
created_at        Date     (never updated)
```

---

## 🔌 API Reference

### Auth — `/api/auth`
| Method | Path | Description |
|---|---|---|
| POST | `/register` | Register, receive JWT, get 100 welcome credits |
| POST | `/login` | Login, get access token + refresh cookie |
| POST | `/logout` | Clear refresh token |
| POST | `/refresh` | Silently issue new access token |

### Credits — `/api/credits`
| Method | Path | Description |
|---|---|---|
| POST | `/claim` | Claim 50 daily credits (once per 24h) |
| GET | `/history` | Credit earn/spend history |

### Assets — `/api/assets`
| Method | Path | Description |
|---|---|---|
| POST | `/` | Upload new asset |
| GET | `/:id` | Get asset detail |
| POST | `/:id/generate-card` | Generate AI trading card |
| GET | `/me/owned` | All assets you own |
| GET | `/me/created` | All assets you created |

### Listings — `/api/listings`
| Method | Path | Description |
|---|---|---|
| GET | `/` | Browse marketplace (paginated, filtered) |
| POST | `/` | Create listing |
| GET | `/:id` | Single listing detail |
| DELETE | `/:id` | Cancel listing |
| POST | `/:id/buy` | Purchase listing (atomic transaction) |

### Transactions — `/api/transactions`
| Method | Path | Description |
|---|---|---|
| GET | `/me` | Your buy/sell history |
| GET | `/:assetId/history` | Ownership history for an asset |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/assetflow.git
cd assetflow
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Open .env and fill in your values
```

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/assetflow
JWT_ACCESS_SECRET=generate_with_crypto_randomBytes_32
JWT_REFRESH_SECRET=generate_a_different_one_here
DAILY_CREDITS=50
PLATFORM_FEE_PERCENT=5
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
# No Redis, no Replicate — AI generation uses Pollinations.ai (free, no key needed)
```

Generate secure JWT secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Run twice — use one for ACCESS_SECRET, one for REFRESH_SECRET
```

### 3. Install dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 4. Run both servers
```bash
# Terminal 1 — API server
cd server
npm run dev
# → Running on http://localhost:5000

# Terminal 2 — React app
cd client
npm run dev
# → Running on http://localhost:5173
```

> **MongoDB Atlas tip:** Go to Network Access → Add IP Address → `0.0.0.0/0` to allow connections from your local machine.

---

## 🔐 Security Decisions

| Decision | Why |
|---|---|
| httpOnly refresh token cookie | Prevents XSS from stealing the refresh token |
| Short-lived access tokens (15 min) | Limits blast radius if an access token leaks |
| Hashed refresh token in DB | If DB is leaked, tokens can't be replayed |
| MongoDB session for purchases | Prevents partial updates — all-or-nothing credit transfer |
| Server-side price validation | Buyer cannot manipulate the purchase price from the client |
| bcrypt with 12 salt rounds | Industry-standard password hashing |
| express-rate-limit on login | Prevents brute-force credential attacks |

---

## 🗺️ Roadmap

- [x] JWT auth with refresh token rotation
- [x] Daily free credit claim
- [x] Asset upload to Cloudinary
- [x] AI card generation (Pollinations.ai)
- [x] Marketplace listing + purchase flow
- [x] Atomic ownership transfer (MongoDB transactions)
- [x] Ownership history per asset
- [ ] TradingView-style price history graphs
- [ ] Auction system with credit bidding
- [ ] Creator royalties on secondary sales (2.5%)
- [ ] Google OAuth login
- [ ] Collections & series grouping
- [ ] Trending algorithm

---

## 👨‍💻 Author

Built by **Shank** as a full-stack portfolio project demonstrating MERN stack, REST API design, JWT authentication, transactional database operations, and AI integration.

[![Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://asset-flow-lyart.vercel.app/)

---

<div align="center">
  <sub>AssetFlow — Built for portfolio & internship excellence</sub>
</div>
