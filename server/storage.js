import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User, FoodItem, Order, DietAnalysis, Offer } from "./models/index.js";
import { connectDatabase } from "./db.js";

// Setup MongoDB session store
export const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/canteen",
  collectionName: "sessions",
  ttl: 60 * 60 * 24, // 1 day in seconds
});

class MongoDBStorage {
  constructor() {
    this.init();
  }

  async init() {
    try {
      await connectDatabase();
      console.log("MongoDB connected from storage");
      await this.seedDataIfEmpty();
    } catch (error) {
      console.error("MongoDB connection error from storage:", error);
    }
  }

  // User methods
  async getUser(id) {
    return await User.findById(id).catch(err => {
      console.error("Error getting user:", err);
      return undefined;
    });
  }

  async getUserByUsername(username) {
    return await User.findOne({ username }).catch(err => {
      console.error("Error getting user by username:", err);
      return undefined;
    });
  }

  async getUserByEmail(email) {
    return await User.findOne({ email }).catch(err => {
      console.error("Error getting user by email:", err);
      return undefined;
    });
  }

  async createUser(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  }

  // Food methods
  async getFoodItems() {
    return await FoodItem.find({}).catch(err => {
      console.error("Error getting food items:", err);
      return [];
    });
  }

  async getFoodItemsByCategory(category) {
    return await FoodItem.find({ category }).catch(err => {
      console.error("Error getting food items by category:", err);
      return [];
    });
  }

  async getFoodItem(id) {
    return await FoodItem.findById(id).catch(err => {
      console.error("Error getting food item:", err);
      return undefined;
    });
  }

  async createFoodItem(itemData) {
    try {
      const foodItem = new FoodItem(itemData);
      return await foodItem.save();
    } catch (err) {
      console.error("Error creating food item:", err);
      throw err;
    }
  }

  // Order methods
  async createOrder(orderData) {
    try {
      const order = new Order(orderData);
      return await order.save();
    } catch (err) {
      console.error("Error creating order:", err);
      throw err;
    }
  }

  async getOrder(id) {
    return await Order.findById(id).populate('items.foodItemId').catch(err => {
      console.error("Error getting order:", err);
      return undefined;
    });
  }

  async getUserOrders(userId) {
    return await Order.find({ userId }).sort({ createdAt: -1 }).catch(err => {
      console.error("Error getting user orders:", err);
      return [];
    });
  }

  async updateOrderStatus(id, status) {
    return await Order.findByIdAndUpdate(id, { status }, { new: true }).catch(err => {
      console.error("Error updating order status:", err);
      return undefined;
    });
  }

  async updateOrderEstimatedTime(id, time) {
    return await Order.findByIdAndUpdate(id, { estimatedReadyTime: time }, { new: true }).catch(err => {
      console.error("Error updating estimated time:", err);
      return undefined;
    });
  }

  async addOrderItem(item) {
    try {
      const order = await Order.findById(item.orderId);
      if (!order) throw new Error("Order not found");
      order.items.push({
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        price: item.price,
      });
      await order.save();
      return order.items[order.items.length - 1];
    } catch (err) {
      console.error("Error adding order item:", err);
      throw err;
    }
  }

  async getOrderItems(orderId) {
    const order = await Order.findById(orderId).catch(err => {
      console.error("Error getting order items:", err);
      return undefined;
    });
    return order ? order.items : [];
  }

  // Diet Analysis methods
  async createDietAnalysis(analysisData) {
    try {
      const dietAnalysis = new DietAnalysis(analysisData);
      return await dietAnalysis.save();
    } catch (err) {
      console.error("Error creating diet analysis:", err);
      throw err;
    }
  }

  async getUserDietAnalysis(userId) {
    return await DietAnalysis.find({ userId }).sort({ createdAt: -1 }).catch(err => {
      console.error("Error getting diet analysis:", err);
      return [];
    });
  }

  async getLatestUserDietAnalysis(userId) {
    return await DietAnalysis.findOne({ userId }).sort({ createdAt: -1 }).catch(err => {
      console.error("Error getting latest diet analysis:", err);
      return undefined;
    });
  }

  // Offers methods
  async getOffers() {
    return await Offer.find({}).catch(err => {
      console.error("Error getting offers:", err);
      return [];
    });
  }

  async getActiveOffers() {
    const now = new Date();
    return await Offer.find({
      active: true,
      $or: [{ expiryDate: { $exists: false } }, { expiryDate: { $gt: now } }]
    }).catch(err => {
      console.error("Error getting active offers:", err);
      return [];
    });
  }

  async getOffer(id) {
    return await Offer.findById(id).catch(err => {
      console.error("Error getting offer:", err);
      return undefined;
    });
  }

  async createOffer(offerData) {
    try {
      const offer = new Offer(offerData);
      return await offer.save();
    } catch (err) {
      console.error("Error creating offer:", err);
      throw err;
    }
  }

  // Seed Methods
  async seedDataIfEmpty() {
    try {
      const foodCount = await FoodItem.countDocuments();
      if (foodCount === 0) await this.seedFoodItems();

      const offerCount = await Offer.countDocuments();
      if (offerCount === 0) await this.seedOffers();

      const userCount = await User.countDocuments();
      if (userCount === 0) {
        const hashedPassword = await bcrypt.hash("Viswa@2004", 10);
        await this.createUser({
          username: "Viswa",
          name: "Viswa",
          email: "viswanathan@gmail.com",
          password: hashedPassword
        });
      }
    } catch (err) {
      console.error("Error seeding data:", err);
    }
  }

  async seedFoodItems() {
    const items = [
      // Example food items can be inserted here
    ];
    try {
      await FoodItem.insertMany(items);
      console.log("Seeded food items successfully");
    } catch (err) {
      console.error("Error seeding food items:", err);
    }
  }

  async seedOffers() {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const offers = [
      // Example offers can be inserted here
    ];
    try {
      await Offer.insertMany(offers);
      console.log("Seeded offers successfully");
    } catch (err) {
      console.error("Error seeding offers:", err);
    }
  }
}

// Export the class only
export default MongoDBStorage;
