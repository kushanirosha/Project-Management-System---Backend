const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const kanbanController = require("../controllers/kanbanController");

// 📦 Multer file storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// ✅ Create a task (with optional files)
router.post(
  "/:projectId/tasks",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "documents", maxCount: 10 },
  ]),
  kanbanController.createTask
);

// ✅ Get all tasks for a specific project
router.get("/:projectId/tasks", kanbanController.getTasksByProject);

// ✅ Update a task
router.put("/tasks/:taskId", kanbanController.updateTask);

// ✅ Add a comment to a task
router.post("/tasks/:taskId/comments", kanbanController.addComment);

module.exports = router;
