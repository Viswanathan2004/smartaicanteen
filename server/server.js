// server.js
import express from "express";
import http from "http";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import offerRoutes from './routes/offerRoutes.js';
import foodRoutes from "./routes/food.routes.js";
import chatRoutes from "./routes/chat.js"; // ✅ FIXED variable name
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { connectDatabase } from "./db.js"; // Optional
import aboutRoutes from "./routes/aboutRoutes.js";
dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/about", aboutRoutes);
app.use('/api/offers', offerRoutes);

// MongoDB connection
const mongoUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/canteen";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});

// Session store
const sessionStore = MongoStore.create({
  mongoUrl,
  collectionName: "sessions",
  ttl: 86400,
});

app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));

// Logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json.bind(res);
  res.json = (bodyJson, ...args) => {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 120) {
        logLine = logLine.slice(0, 119) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// Routes
app.use("/api/foods", foodRoutes);
app.use("/api/chat", chatRoutes); // ✅ CHATBOT ROUTE FIXED

// Additional app-level routes
await registerRoutes(app, server);

// Global error handler
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error("❌", err);
});

// Serve frontend
if (app.get("env") === "development") {
  await setupVite(app, server);
} else {
  serveStatic(app);
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  log(`🚀 Server running on http://localhost:${PORT}`);
});
