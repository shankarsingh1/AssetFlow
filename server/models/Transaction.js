import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
    },
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    },
    fee_credits: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
