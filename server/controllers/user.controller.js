import User from '../models/User.js';
import Asset from '../models/Asset.js';

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.userId).select('-password -refresh_token');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const { bio, avatar_url } = req.body;
    const updates = {};
    if (typeof bio === 'string') updates.bio = bio;
    if (typeof avatar_url === 'string') updates.avatar_url = avatar_url;

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password -refresh_token');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}

export async function getPublicProfile(req, res, next) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('username avatar_url bio createdAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const created = await Asset.find({ creator_id: user._id })
      .select('title thumbnail_url category status createdAt')
      .sort({ createdAt: -1 })
      .limit(48)
      .lean();

    const owned = await Asset.find({ owner_id: user._id })
      .select('title thumbnail_url category status createdAt')
      .sort({ createdAt: -1 })
      .limit(48)
      .lean();

    return res.json({ user, created, owned });
  } catch (err) {
    return next(err);
  }
}
