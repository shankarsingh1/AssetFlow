import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import assetRoutes from './routes/asset.routes.js';
import listingRoutes from './routes/listing.routes.js';
import creditRoutes from './routes/credit.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

/** Required behind Render / Vercel / other proxies for correct secure cookies & IPs */
app.set('trust proxy', 1);

app.use(helmet());
const clientOrigin = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/transactions', transactionRoutes);

app.use(errorHandler);

export default app;
