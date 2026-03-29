import mongoose from 'mongoose';

const RETRY_MS = 5000;
const MAX_ATTEMPTS = 10;

export async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  let attempt = 0;

  while (attempt < MAX_ATTEMPTS) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log('MongoDB connected');
      return;
    } catch (err) {
      attempt += 1;
      console.error(`MongoDB connect attempt ${attempt}/${MAX_ATTEMPTS} failed:`, err.message);
      if (attempt >= MAX_ATTEMPTS) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, RETRY_MS));
    }
  }
}
