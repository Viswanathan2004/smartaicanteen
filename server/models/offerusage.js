import mongoose from 'mongoose';

const offerUsageSchema = new mongoose.Schema({
  offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  usedAt: { type: Date, default: Date.now }
});

const OfferUsage = mongoose.model('OfferUsage', offerUsageSchema);

export default OfferUsage;
