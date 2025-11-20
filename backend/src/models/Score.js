import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    Basic_verification: { type: Number, required: true, enum: [0, 1] },
    Background_check: { type: Number, required: true, enum: [0, 1] },
    Experience: { type: Number, required: true, enum: [0, 1] },
    Positive_behavior: { type: Number, required: true, enum: [0, 1] },
    breakdown: {
      Basic_verification: Number,
      Background_check: Number,
      Experience: Number,
      Positive_behavior: Number
    },
    finalScore: { type: Number, required: true }
  },
  { timestamps: true }
);

const Score = mongoose.model('Score', scoreSchema);

export default Score;
