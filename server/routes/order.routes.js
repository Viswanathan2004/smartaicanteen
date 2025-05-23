import express from "express";
import Order from "../models/Order.js";

const router = express.Router(); // ✅ Declare only once

// POST /api/orders/upi-order
router.post("/upi-order", async (req, res) => {
  const { items, total, user, paymentId } = req.body;

  try {
    const order = new Order({
      items,
      total,
      user,
      paymentId,
      paymentMode: "UPI",
      paymentStatus: "pending", // Manual confirmation later
    });

    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error("UPI Order Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
