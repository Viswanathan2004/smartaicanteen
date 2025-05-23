// server/seed/seedFoods.js
const mongoose = require("mongoose");
const Food = require("../models/food.model");
const faker = require("faker");

// MongoDB connection string (update if needed)
const MONGO_URI = "mongodb://localhost:27017/your-db-name";

const categories = ["Burgers", "Wraps", "Drinks", "Desserts", "South Indian", "North Indian"];

const generateFoodItems = (count = 200) => {
  const items = [];

  for (let i = 0; i < count; i++) {
    items.push({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: parseFloat(faker.commerce.price(20, 300)),
      category: faker.random.arrayElement(categories),
      imageUrl: `https://source.unsplash.com/400x300/?food,${i}`,
      isAvailable: faker.datatype.boolean(),
    });
  }

  return items;
};

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Optional: clear existing data
    await Food.deleteMany({});
    console.log("Cleared existing food data.");

    // Insert new data
    const foodItems = generateFoodItems(200);
    await Food.insertMany(foodItems);
    console.log("Seeded 200 food items!");

    process.exit();
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
