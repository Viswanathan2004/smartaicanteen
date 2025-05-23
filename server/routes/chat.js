// routes/chat.js
import express from "express";
import ChatMessage from "../models/chatmessage.js";

const router = express.Router();

const getAutoReply = (type, message) => {
  if (type === "complaint") return "We're sorry! A support member will respond shortly.";
  if (type === "feedback") return "Thanks for your feedback! We appreciate it.";
  if (message.toLowerCase().includes("menu")) return "Here is today’s menu: 🍱 Pizza, Rice Bowl, Juice.";
  return "Thank you! We’ll get back to you soon.";
};

// POST - Create message
router.post("/", async (req, res) => {
  const { userId, type = "query", message } = req.body;
  try {
    const reply = getAutoReply(type, message);
    const saved = await ChatMessage.create({ userId, type, message, reply });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Message failed" });
  }
});

// GET - User chat history
router.get("/:userId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.params.userId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

export default router;
