const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.get("/:projectId/messages", chatController.getMessages);
router.post("/:projectId/messages", upload.single("file"), chatController.createMessage);

module.exports = router;
