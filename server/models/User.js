import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar_url: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
    credits_balance: {
      type: Number,
      default: 100,
    },
    last_claim_at: {
      type: Date,
      default: null,
    },
    total_earned: {
      type: Number,
      default: 0,
    },
    total_spent: {
      type: Number,
      default: 0,
    },
    refresh_token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    delete ret.refresh_token;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
