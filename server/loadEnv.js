import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repo root: AssetFlow/.env (works when npm run dev is started from server/) */
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
/** Optional: server/.env overrides same keys */
dotenv.config({ path: path.resolve(__dirname, '.env') });
