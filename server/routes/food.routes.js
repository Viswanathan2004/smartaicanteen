// routes/food.routes.js
import express from "express";

const router = express.Router();

// Define your routes
router.get("/", (req, res) => {
  res.json({ message: "List of foods" });
});

export default router; // 👈 Default export
