// models/chatmessage.js
import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ["query", "complaint", "feedback"], default: "query" },
  message: { type: String, required: true },
  reply: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
