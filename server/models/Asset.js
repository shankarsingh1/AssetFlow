import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['art', 'music', 'collectible'],
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    file_url: {
      type: String,
      required: true,
    },
    thumbnail_url: {
      type: String,
      default: null,
    },
    ai_card_url: {
      type: String,
      default: null,
    },
    ai_card_generation_count: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['unlisted', 'listed', 'sold'],
      default: 'unlisted',
    },
  },
  { timestamps: true }
);

assetSchema.index({ owner_id: 1, status: 1 });

export default mongoose.model('Asset', assetSchema);
