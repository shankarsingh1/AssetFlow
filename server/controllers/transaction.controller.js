import Transaction from '../models/Transaction.js';

export async function getMyTransactions(req, res, next) {
  try {
    const userId = req.user.userId;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = {
      $or: [{ buyer_id: userId }, { seller_id: userId }],
    };

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('asset_id', 'title thumbnail_url category')
        .populate('buyer_id', 'username avatar_url')
        .populate('seller_id', 'username avatar_url')
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    return res.json({
      transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return next(err);
  }
}
