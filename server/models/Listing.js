import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price_credits: {
      type: Number,
      required: true,
      min: 5,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'cancelled'],
      default: 'active',
    },
    sold_at: {
      type: Date,
      default: null,
    },
    /** Denormalized from asset for queries and compound index (status, category). */
    category: {
      type: String,
      enum: ['art', 'music', 'collectible'],
      required: true,
    },
  },
  { timestamps: true }
);

listingSchema.index({ status: 1, category: 1 });

export default mongoose.model('Listing', listingSchema);
