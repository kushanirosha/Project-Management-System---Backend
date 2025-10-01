const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  content: { type: String },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ["admin", "client"], required: true },
  type: { type: String, enum: ["text", "image", "document"], default: "text" },
  attachmentUrl: { type: String },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
