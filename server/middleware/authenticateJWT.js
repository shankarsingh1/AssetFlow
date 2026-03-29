import jwt from 'jsonwebtoken';

export function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const payload = jwt.verify(token, secret);
    req.user = {
      userId: payload.userId,
      username: payload.username,
    };
    return next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    }
    return next(err);
  }
}
