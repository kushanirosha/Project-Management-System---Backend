const express = require("express");
const multer = require("multer");
const path = require("path");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
router.post("/", paymentController.createPayment);
router.get("/", paymentController.getPaymentsByProject);
router.put("/:id/receipt", upload.single("receipt"), paymentController.uploadReceipt);

module.exports = router;
