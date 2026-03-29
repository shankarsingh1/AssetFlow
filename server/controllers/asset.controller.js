import Asset from '../models/Asset.js';
import Listing from '../models/Listing.js';
import Transaction from '../models/Transaction.js';
import { uploadFile } from '../services/cloudinaryService.js';
import { generateCard } from '../services/aiService.js';

export async function uploadAsset(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File required' });
    }

    const { title, description, category, tags } = req.body;
    const tagList =
      typeof tags === 'string'
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : Array.isArray(tags)
          ? tags
          : [];

    const main = await uploadFile(req.file.buffer, {
      folder: 'assetflow/assets',
      resource_type: 'auto',
    });

    let thumbnail_url = main.secure_url;
    if (req.file.mimetype.startsWith('image/')) {
      thumbnail_url = main.secure_url;
    } else {
      thumbnail_url = null;
    }

    const userId = req.user.userId;
    const asset = await Asset.create({
      owner_id: userId,
      creator_id: userId,
      title,
      description: description || '',
      category,
      tags: tagList,
      file_url: main.secure_url,
      thumbnail_url,
      status: 'unlisted',
    });

    return res.status(201).json({ asset });
  } catch (err) {
    return next(err);
  }
}

export async function getAsset(req, res, next) {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('owner_id', 'username avatar_url')
      .populate('creator_id', 'username avatar_url');

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    return res.json({ asset });
  } catch (err) {
    return next(err);
  }
}

export async function getMyAssets(req, res, next) {
  try {
    const assets = await Asset.find({ owner_id: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ assets });
  } catch (err) {
    return next(err);
  }
}

export async function deleteAsset(req, res, next) {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    if (asset.owner_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (asset.status === 'listed') {
      return res.status(400).json({ message: 'Cancel listing before deleting' });
    }

    await Listing.updateMany(
      { asset_id: asset._id, status: 'active' },
      { status: 'cancelled' }
    );

    await Asset.findByIdAndDelete(asset._id);
    return res.json({ message: 'Asset deleted' });
  } catch (err) {
    return next(err);
  }
}

export async function updateAsset(req, res, next) {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    if (asset.owner_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { title, description, tags } = req.body;
    if (title) asset.title = title;
    if (typeof description === 'string') asset.description = description;
    if (tags !== undefined) {
      asset.tags =
        typeof tags === 'string'
          ? tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : tags;
    }

    await asset.save();
    return res.json({ asset });
  } catch (err) {
    return next(err);
  }
}

export async function getOwnershipHistory(req, res, next) {
  try {
    const populatedAsset = await Asset.findById(req.params.id)
      .populate('creator_id', 'username avatar_url')
      .populate('owner_id', 'username avatar_url')
      .lean();

    if (!populatedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const txs = await Transaction.find({ asset_id: populatedAsset._id })
      .sort({ createdAt: 1 })
      .populate('buyer_id', 'username avatar_url')
      .populate('seller_id', 'username avatar_url')
      .lean();

    const timeline = [
      {
        type: 'created',
        at: populatedAsset.createdAt,
        user: populatedAsset.creator_id,
        label: 'Created',
      },
    ];

    for (const tx of txs) {
      timeline.push({
        type: 'sale',
        at: tx.createdAt,
        price_credits: tx.price_credits,
        fee_credits: tx.fee_credits,
        from: tx.seller_id,
        to: tx.buyer_id,
      });
    }

    return res.json({ timeline, current_owner: populatedAsset.owner_id });
  } catch (err) {
    return next(err);
  }
}

export async function generateCardJob(req, res, next) {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    if (asset.owner_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (asset.ai_card_generation_count >= 3) {
      return res.status(400).json({ message: 'Generation limit reached (max 3)' });
    }

    const cardUrl = generateCard(asset.file_url, asset.title);
    asset.ai_card_url = cardUrl;
    asset.ai_card_generation_count += 1;
    await asset.save();

    return res.status(200).json({ asset });
  } catch (err) {
    return next(err);
  }
}
