import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { hashRefreshToken, verifyRefreshToken as compareStoredRefresh } from '../utils/refreshTokenHash.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken as verifyJwtRefresh } from '../utils/jwtTokens.js';

const COOKIE_NAME = 'refreshToken';

/**
 * Production: SPA (e.g. Vercel) and API (e.g. Render) are different sites — the browser
 * only sends cookies on cross-origin XHR if SameSite=None and Secure=true.
 * Strict/Lax would block refresh cookies, breaking login/session after deploy.
 */
function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

function clearCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    path: '/',
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  };
}

function buildTokenPair(user) {
  const payload = { userId: user._id.toString(), username: user.username };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ userId: user._id.toString() });
  return { accessToken, refreshToken, payload };
}

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'Email or username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = buildTokenPair(user);
    user.refresh_token = await hashRefreshToken(refreshToken);
    await user.save();

    res.cookie(COOKIE_NAME, refreshToken, cookieOptions());
    return res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        credits_balance: user.credits_balance,
        avatar_url: user.avatar_url,
        bio: user.bio,
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = buildTokenPair(user);
    user.refresh_token = await hashRefreshToken(refreshToken);
    await user.save();

    res.cookie(COOKIE_NAME, refreshToken, cookieOptions());
    return res.json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        credits_balance: user.credits_balance,
        avatar_url: user.avatar_url,
        bio: user.bio,
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies?.[COOKIE_NAME];
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    let decoded;
    try {
      decoded = verifyJwtRefresh(refreshToken);
    } catch {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.refresh_token) {
      return res.status(401).json({ message: 'Invalid refresh session' });
    }

    const valid = await compareStoredRefresh(refreshToken, user.refresh_token);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid refresh session' });
    }

    const accessToken = signAccessToken({
      userId: user._id.toString(),
      username: user.username,
    });

    return res.json({ accessToken });
  } catch (err) {
    return next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies?.[COOKIE_NAME];
    res.clearCookie(COOKIE_NAME, clearCookieOptions());

    if (refreshToken) {
      try {
        const decoded = verifyJwtRefresh(refreshToken);
        await User.findByIdAndUpdate(decoded.userId, { refresh_token: null });
      } catch {
        /* ignore invalid token on logout */
      }
    }

    return res.json({ message: 'Logged out' });
  } catch (err) {
    return next(err);
  }
}
