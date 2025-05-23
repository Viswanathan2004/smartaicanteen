import express from 'express';
import Offer from '../models/Offer.js';
import OfferUsage from '../models/offerusage.js';

const router = express.Router();

// Create new offer
router.post('/offers', async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all active offers
router.get('/offers/active', async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      active: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply coupon code
router.post('/offers/apply', async (req, res) => {
  const { code, cartValue, userId } = req.body;
  try {
    const now = new Date();
    const offer = await Offer.findOne({
      code: code.toUpperCase(),
      active: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
    if (!offer) return res.status(404).json({ error: 'Invalid or expired offer code' });

    if (offer.maxUses > 0 && offer.uses >= offer.maxUses) {
      return res.status(400).json({ error: 'Offer usage limit reached' });
    }

    if (cartValue < (offer.minOrderValue || 0)) {
      return res.status(400).json({ error: `Minimum order value is ₹${offer.minOrderValue}` });
    }

    let discountAmount = 0;
    if (offer.discountType === 'percentage') {
      discountAmount = (cartValue * offer.discountValue) / 100;
    } else {
      discountAmount = offer.discountValue;
    }
    discountAmount = Math.min(discountAmount, cartValue);

    res.json({
      code: offer.code,
      description: offer.description,
      discountAmount,
      newTotal: cartValue - discountAmount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Track offer usage after order placed
router.post('/offers/usage', async (req, res) => {
  const { offerCode, userId, orderId } = req.body;
  try {
    const offer = await Offer.findOne({ code: offerCode.toUpperCase() });
    if (!offer) return res.status(404).json({ error: 'Offer not found' });

    offer.uses = (offer.uses || 0) + 1;
    if (offer.maxUses > 0 && offer.uses > offer.maxUses) {
      offer.active = false;
    }
    await offer.save();

    const usage = new OfferUsage({ offer: offer._id, user: userId, order: orderId });
    await usage.save();

    res.json({ message: 'Offer usage recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
