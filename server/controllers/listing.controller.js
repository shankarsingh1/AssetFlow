import mongoose from 'mongoose';
import Listing from '../models/Listing.js';
import Asset from '../models/Asset.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { transferCredits } from '../services/creditService.js';

const POPULATE_ASSET = {
  path: 'asset_id',
  select: 'title thumbnail_url category',
};
const POPULATE_SELLER = {
  path: 'seller_id',
  select: 'username avatar_url',
};

export async function createListing(req, res, next) {
  try {
    const { asset_id, price_credits, description } = req.body;

    const asset = await Asset.findById(asset_id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    if (asset.owner_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not own this asset' });
    }

    const existing = await Listing.findOne({ asset_id, status: 'active' });
    if (existing) {
      return res.status(400).json({ message: 'Asset already has an active listing' });
    }

    const listing = await Listing.create({
      asset_id,
      seller_id: req.user.userId,
      price_credits,
      description: description || '',
      status: 'active',
      category: asset.category,
    });

    asset.status = 'listed';
    await asset.save();

    const populated = await Listing.findById(listing._id)
      .populate(POPULATE_ASSET)
      .populate(POPULATE_SELLER);

    return res.status(201).json({ listing: populated });
  } catch (err) {
    return next(err);
  }
}

export async function getMyListings(req, res, next) {
  try {
    const listings = await Listing.find({
      seller_id: req.user.userId,
      status: 'active',
    })
      .populate(POPULATE_ASSET)
      .populate(POPULATE_SELLER)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ listings });
  } catch (err) {
    return next(err);
  }
}

export async function getListings(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(24, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;
    const { search, category, sort = 'newest' } = req.query;

    const filter = { status: 'active' };
    if (category && ['art', 'music', 'collectible'].includes(category)) {
      filter.category = category;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim();
      const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const matchingAssets = await Asset.find({ title: rx }).select('_id').lean();
      const assetIds = matchingAssets.map((a) => a._id);
      filter.$or = [{ description: rx }, { asset_id: { $in: assetIds } }];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price_credits: 1 };
    if (sort === 'price_desc') sortObj = { price_credits: -1 };

    const [listings, totalCount] = await Promise.all([
      Listing.find(filter)
        .populate(POPULATE_ASSET)
        .populate(POPULATE_SELLER)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Listing.countDocuments(filter),
    ]);

    return res.json({
      listings,
      pagination: { page, limit, total: totalCount, pages: Math.ceil(totalCount / limit) },
    });
  } catch (err) {
    return next(err);
  }
}

export async function getListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate(POPULATE_ASSET)
      .populate(POPULATE_SELLER);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    return res.json({ listing });
  } catch (err) {
    return next(err);
  }
}

export async function buyListing(req, res, next) {
  const session = await mongoose.startSession();

  try {
    let result;
    await session.withTransaction(async () => {
      const listing = await Listing.findOne({
        _id: req.params.id,
        status: 'active',
      }).session(session);

      if (!listing) {
        const err = new Error('Listing not available');
        err.statusCode = 404;
        throw err;
      }

      const buyerId = req.user.userId;
      if (listing.seller_id.toString() === buyerId) {
        const err = new Error('Cannot buy your own listing');
        err.statusCode = 400;
        throw err;
      }

      const buyer = await User.findById(buyerId).session(session);
      const seller = await User.findById(listing.seller_id).session(session);
      const asset = await Asset.findById(listing.asset_id).session(session);

      if (!buyer || !seller || !asset) {
        const err = new Error('Invalid listing state');
        err.statusCode = 400;
        throw err;
      }

      const price = listing.price_credits;
      if (buyer.credits_balance < price) {
        const err = new Error('Insufficient credits');
        err.statusCode = 400;
        throw err;
      }

      const fee = Math.floor(price * 0.05);

      const { buyer: buyerAfter } = await transferCredits({
        buyerId,
        sellerId: listing.seller_id.toString(),
        priceCredits: price,
        feeCredits: fee,
        session,
      });

      asset.owner_id = buyerAfter._id;
      asset.status = 'sold';

      listing.status = 'sold';
      listing.sold_at = new Date();

      await asset.save({ session });
      await listing.save({ session });

      await Transaction.create(
        [
          {
            asset_id: asset._id,
            listing_id: listing._id,
            buyer_id: buyerAfter._id,
            seller_id: listing.seller_id,
            price_credits: price,
            fee_credits: fee,
          },
        ],
        { session }
      );

      result = {
        asset,
        buyer_new_balance: buyerAfter.credits_balance,
      };
    });

    return res.json(result);
  } catch (err) {
    return next(err);
  } finally {
    session.endSession();
  }
}

export async function cancelListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.seller_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (listing.status !== 'active') {
      return res.status(400).json({ message: 'Listing is not active' });
    }

    listing.status = 'cancelled';
    await listing.save();

    await Asset.findByIdAndUpdate(listing.asset_id, { status: 'unlisted' });

    const populated = await Listing.findById(listing._id)
      .populate(POPULATE_ASSET)
      .populate(POPULATE_SELLER);

    return res.json({ listing: populated });
  } catch (err) {
    return next(err);
  }
}
