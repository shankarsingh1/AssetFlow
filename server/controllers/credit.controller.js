import User from '../models/User.js';
import { claimDailyCredits } from '../services/creditService.js';

function tomorrowMidnightUtc() {
  const t = new Date();
  t.setUTCHours(0, 0, 0, 0);
  t.setUTCDate(t.getUTCDate() + 1);
  return t;
}

export async function claimDaily(req, res, next) {
  try {
    try {
      const result = await claimDailyCredits(req.user.userId);
      return res.json(result);
    } catch (err) {
      if (err.statusCode === 400 && err.message === 'Already claimed') {
        return res.status(400).json({
          message: err.message,
          next_claim_at: err.details?.next_claim_at ?? tomorrowMidnightUtc(),
        });
      }
      throw err;
    }
  } catch (err) {
    return next(err);
  }
}

export async function getBalance(req, res, next) {
  try {
    const user = await User.findById(req.user.userId).select('credits_balance last_claim_at');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      balance: user.credits_balance,
      last_claim_at: user.last_claim_at,
    });
  } catch (err) {
    return next(err);
  }
}

export async function getHistory(req, res, next) {
  try {
    const user = await User.findById(req.user.userId).select('total_earned total_spent credits_balance');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      totals: {
        total_earned: user.total_earned,
        total_spent: user.total_spent,
        credits_balance: user.credits_balance,
      },
      note: 'Detailed ledger is available via /api/transactions',
    });
  } catch (err) {
    return next(err);
  }
}
