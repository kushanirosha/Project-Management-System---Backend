const paymentService = require("../services/paymentService");

const createPayment = async (req, res, next) => {
  try {
    console.log("📥 Payment create request:", req.body); // Debug log

    const { projectId, amount, description, status } = req.body;
    if (!projectId || !amount) {
      return res.status(400).json({ error: "projectId and amount are required" });
    }

    const payment = await paymentService.createPayment(req.body);
    res.status(201).json(payment);
  } catch (err) {
    console.error("❌ Error creating payment:", err);
    next(err);
  }
};


const getPaymentsByProject = async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentsByProject(req.query.projectId);
    res.json(Array.isArray(payments) ? payments : []);
  } catch (err) {
    next(err);
  }
};

const uploadReceipt = async (req, res, next) => {
  try {
    const payment = await paymentService.uploadReceipt(req.params.id, {
      amount: req.body.amount,
      receiptUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPayment,
  getPaymentsByProject,
  uploadReceipt,
};
