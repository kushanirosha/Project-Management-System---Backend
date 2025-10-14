const mongoose = require("mongoose");

const kanbanSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    stage: {
      type: String,
      enum: ["to do", "in progress", "review", "done"],
      default: "to do",
    },
    resources: {
      images: [String],
      documents: [String],
      links: [String],
    },
    comments: [
      {
        id: String,
        content: String,
        author: String,
        type: {
          type: String,
          enum: ["comment", "approval", "change_request"],
          default: "comment",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kanban", kanbanSchema, "kanbans");
