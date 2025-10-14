const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const kanbanController = require("../controllers/kanbanController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// POST create task (with files)
router.post(
  "/:projectId/tasks",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "documents", maxCount: 10 },
  ]),
  kanbanController.createTask
);

// GET tasks by project
router.get("/project/:projectId", kanbanController.getTasksByProject);

// PUT update task
router.put("/:taskId", kanbanController.updateTask);

// POST add comment
router.post("/:taskId/comments", kanbanController.addComment);

module.exports = router;
