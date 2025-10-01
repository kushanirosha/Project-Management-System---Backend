const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  category: { type: String, enum: ["web", "graphic"] },
  deadline: Date,
  status: { type: String, enum: ["ongoing", "completed"], default: "ongoing" },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  client: { name: String, email: String },
  createdAt: { type: Date, default: Date.now },
  description: String,
  resources: { images: [String], documents: [String], links: [String] },
});

module.exports = mongoose.model("Project", projectSchema);
