import './loadEnv.js';
import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';

configureCloudinary();

try {
  await connectDB();
} catch (err) {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
}

const port = parseInt(process.env.PORT || '5000', 10);
http.createServer(app).listen(port, () => {
  console.log(`AssetFlow API listening on port ${port}`);
});
