import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  description: { type: String },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxUses: { type: Number, default: 0 },
  uses: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;
