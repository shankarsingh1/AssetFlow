import User from '../models/User.js';

export async function getBalance(userId) {
  const user = await User.findById(userId).select('credits_balance').lean();
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user.credits_balance;
}

function tomorrowMidnightUtc() {
  const t = new Date();
  t.setUTCHours(0, 0, 0, 0);
  t.setUTCDate(t.getUTCDate() + 1);
  return t;
}

/**
 * Credit daily claim. Mutates user document.
 */
export async function claimDailyCredits(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (user.last_claim_at && user.last_claim_at >= today) {
    const err = new Error('Already claimed');
    err.statusCode = 400;
    err.details = { next_claim_at: tomorrowMidnightUtc() };
    throw err;
  }

  const daily = parseInt(process.env.DAILY_CREDITS ?? '50', 10) || 50;
  user.credits_balance += daily;
  user.last_claim_at = new Date();
  await user.save();

  return { new_balance: user.credits_balance, daily_credits_added: daily };
}

/**
 * Atomic buyer/seller ledger updates (used inside Mongo session by purchase flow).
 */
export async function transferCredits({
  buyerId,
  sellerId,
  priceCredits,
  feeCredits,
  session,
}) {
  const sellerCut = priceCredits - feeCredits;

  const buyer = await User.findById(buyerId).session(session);
  const seller = await User.findById(sellerId).session(session);

  if (!buyer || !seller) {
    const err = new Error('Buyer or seller not found');
    err.statusCode = 404;
    throw err;
  }

  if (buyer.credits_balance < priceCredits) {
    const err = new Error('Insufficient credits');
    err.statusCode = 400;
    throw err;
  }

  buyer.credits_balance -= priceCredits;
  buyer.total_spent += priceCredits;

  seller.credits_balance += sellerCut;
  seller.total_earned += sellerCut;

  await buyer.save({ session });
  await seller.save({ session });

  return { buyer, seller, sellerCut };
}
