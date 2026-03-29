# AssetFlow

AssetFlow is a full-stack **digital asset marketplace** with a **credit-based economy**, **JWT authentication** (access + refresh cookies), optional **Cloudinary** uploads, **BullMQ** workers for **Replicate**-powered AI trading cards, and a **React + Vite** client with **Zustand** and **Tailwind**.

## Local setup

1. **Prerequisites**
   - Node.js 18+
   - MongoDB (Atlas URI or local)
   - Redis (for BullMQ — default `redis://localhost:6379`)

2. **Clone / open the repo** and copy environment files:

   ```bash
   cp .env.example .env
   ```

   Fill in secrets (see table below). For the client, optional: create `client/.env` with `VITE_API_URL=` empty when using the Vite dev proxy, or set `VITE_API_URL=http://localhost:5000` if calling the API directly.

3. **Install dependencies**

   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

4. **Run Redis** (Docker example):

   ```bash
   docker run -d -p 6379:6379 redis:7-alpine
   ```

5. **Start the API** (from `server/`):

   ```bash
   npm run dev
   ```

6. **Start the client** (from `client/`):

   ```bash
   npm run dev
   ```

   Open `http://localhost:5173`. API requests to `/api/*` are proxied to `http://localhost:5000` per `vite.config.js`.

## Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port for Express (default `5000`). |
| `MONGODB_URI` | MongoDB connection string. |
| `JWT_ACCESS_SECRET` | Secret for short-lived access JWTs (~15m). |
| `JWT_REFRESH_SECRET` | Secret for 7-day refresh JWTs (sent as httpOnly cookie). |
| `DAILY_CREDITS` | Credits added on successful daily claim (default `50`). |
| `PLATFORM_FEE_PERCENT` | Documented platform fee percent (purchase logic uses **5%** floor as specified). |
| `CLOUDINARY_*` | Cloud name, API key, and secret for media + AI card uploads. |
| `REPLICATE_API_TOKEN` | Token for [Replicate](https://replicate.com) SDXL card generation. |
| `REDIS_URL` | Redis connection URL for BullMQ. |
| `CLIENT_URL` | Allowed CORS origin (e.g. `http://localhost:5173`). |
| `NODE_ENV` | `development` or `production` (affects cookie `Secure`, logging). |

## Architecture notes

- **Refresh tokens** are stored as a **bcrypt hash of SHA-256** of the JWT (avoids bcrypt’s 72-byte limit while staying “hashed” in DB).
- **Purchases** use a MongoDB **multi-document transaction** (`session.withTransaction`); credits, asset ownership, listing status, and an audit **Transaction** record update atomically.
- **Listings** include a denormalized **`category`** field (copied from the asset) to support the compound index `(status, category)` and efficient marketplace filters.
- The **card generation worker** runs in the same process as the API (`server.js`). For heavy scale, run workers in a separate deployment consuming the same Redis queue.

## API routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register; sets refresh cookie + returns access token. |
| POST | `/api/auth/login` | — | Login; rate-limited **5 / 15 min / IP**. |
| POST | `/api/auth/refresh` | Cookie | New access token. |
| POST | `/api/auth/logout` | — | Clears cookie; invalidates stored refresh hash. |
| GET | `/api/users/me` | JWT | Current user profile. |
| PATCH | `/api/users/me` | JWT | Update bio / avatar URL. |
| GET | `/api/users/profile/:username` | — | Public profile + created/owned assets. |
| GET | `/api/assets/mine` | JWT | Current user’s owned assets. |
| POST | `/api/assets` | JWT | Multipart upload; creates asset. |
| GET | `/api/assets/:id` | — | Asset detail. |
| PATCH | `/api/assets/:id` | JWT | Update metadata (owner). |
| DELETE | `/api/assets/:id` | JWT | Delete asset (not if listed). |
| GET | `/api/assets/:id/history` | — | Ownership timeline (mint + sales). |
| POST | `/api/assets/:id/generate-card` | JWT | Enqueue AI card job (max 3 / asset). |
| GET | `/api/listings` | — | List active listings; `search`, `category`, `sort`, `page`, `limit`. |
| GET | `/api/listings/:id` | — | Single listing (populated asset + seller). |
| POST | `/api/listings` | JWT | Create listing (owner only). |
| POST | `/api/listings/:id/buy` | JWT | Purchase (transactional). |
| POST | `/api/listings/:id/cancel` | JWT | Seller cancels listing. |
| POST | `/api/credits/claim` | JWT | Daily credit claim (UTC midnight boundary). |
| GET | `/api/credits/balance` | JWT | Balance + last claim time. |
| GET | `/api/credits/history` | JWT | Aggregate totals + pointer to transactions. |
| GET | `/api/transactions` | JWT | Paginated buy/sell history for user. |
| GET | `/api/health` | — | Liveness check. |

## License

Use and modify for your product as needed.
