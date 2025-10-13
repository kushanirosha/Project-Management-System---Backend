const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  category: { type: String, enum: ["web", "graphic"] },
  deadline: Date,
  status: { type: String, enum: ["ongoing", "completed"], default: "ongoing" },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // <--- added updatedAt
  description: String,
  resources: { images: [String], documents: [String], links: [String] },
});

// Middleware to automatically update `updatedAt` on every save/update
projectSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model("Project", projectSchema);
