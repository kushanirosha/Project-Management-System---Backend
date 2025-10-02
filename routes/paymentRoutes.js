const express = require("express");
const multer = require("multer");
const { createPayment, getPaymentsByProject, uploadReceipt } = require("../controllers/paymentController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === "quotation" ? "uploads/quotations" : "uploads/receipts";
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", getPaymentsByProject);
router.post("/", upload.single("quotation"), createPayment);
router.put("/:id/receipt", upload.single("receipt"), uploadReceipt);

module.exports = router;
