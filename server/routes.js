import { setupAuth } from "./auth.js";
import { WebSocketServer } from "ws";
import OpenAI from "openai";

// ✅ Import data
import { foodItems } from "../client/src/app-data/food-items.js";
import { offers } from "../client/src/app-data/offers.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-demo-key" });

function ensureAuthenticated(req, res) {
  if (!req.isAuthenticated?.()) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }
  return true;
}

export async function registerRoutes(app, server) {
  setupAuth(app);

  const wss = new WebSocketServer({ server, path: "/ws" });
  const clients = new Map();

  wss.on("connection", (ws) => {
    let userId = null;

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "auth" && data.userId) {
          userId = parseInt(data.userId, 10);
          if (!clients.has(userId)) clients.set(userId, new Set());
          clients.get(userId)?.add(ws);
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    });

    ws.on("close", () => {
      if (userId && clients.has(userId)) {
        const userClients = clients.get(userId);
        userClients?.delete(ws);
        if (userClients?.size === 0) clients.delete(userId);
      }
    });
  });

  // ✅ Add routes to serve food items and offers
  app.get("/api/food-items", (req, res) => {
    res.json(foodItems);
  });

  app.get("/api/offers", (req, res) => {
    res.json(offers);
  });
}
