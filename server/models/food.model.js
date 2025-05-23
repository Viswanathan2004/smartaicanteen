// server/models/food.model.js
const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  imageUrl: String,
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Food", foodSchema);
