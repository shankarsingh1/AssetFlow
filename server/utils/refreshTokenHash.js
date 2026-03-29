import crypto from 'crypto';
import bcrypt from 'bcrypt';

export async function hashRefreshToken(refreshToken) {
  const digest = crypto.createHash('sha256').update(refreshToken).digest('hex');
  return bcrypt.hash(digest, 10);
}

export async function verifyRefreshToken(refreshToken, storedHash) {
  if (!storedHash || !refreshToken) return false;
  const digest = crypto.createHash('sha256').update(refreshToken).digest('hex');
  return bcrypt.compare(digest, storedHash);
}
