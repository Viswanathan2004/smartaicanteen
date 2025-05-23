import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const foodItems = pgTable("food_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in cents
  image: text("image").notNull(),
  category: text("category").notNull(),
  isPopular: boolean("is_popular").default(false),
  isHealthy: boolean("is_healthy").default(false),
  calories: integer("calories"),
  protein: integer("protein"), // in grams
  carbs: integer("carbs"), // in grams
  fats: integer("fats"), // in grams
  rating: integer("rating").default(45), // Rating from 0-50
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull(), // "pending", "preparing", "ready", "completed"
  totalAmount: integer("total_amount").notNull(), // Total in cents
  createdAt: timestamp("created_at").defaultNow().notNull(),
  estimatedReadyTime: timestamp("estimated_ready_time"),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  foodItemId: integer("food_item_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // Price at time of order in cents
});

export const dietAnalysis = pgTable("diet_analysis", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  totalCalories: integer("total_calories").notNull(),
  totalProtein: integer("total_protein").notNull(),
  totalCarbs: integer("total_carbs").notNull(),
  totalFats: integer("total_fats").notNull(),
  aiRecommendation: text("ai_recommendation"),
});

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discountPercent: integer("discount_percent"),
  image: text("image").notNull(),
  tag: text("tag").notNull(), // "NEW", "HEALTHY", etc.
  expiryDate: timestamp("expiry_date"),
  active: boolean("active").default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export const insertFoodItemSchema = createInsertSchema(foodItems).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertDietAnalysisSchema = createInsertSchema(dietAnalysis).omit({
  id: true,
  date: true,
});

export const insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
});