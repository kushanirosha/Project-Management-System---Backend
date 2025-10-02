const paymentService = require("../services/paymentService");

// ---------------- Create Payment ----------------
const createPayment = async (req, res, next) => {
  try {
    const { projectId, amount, description } = req.body;

    if (!projectId || !amount) {
      return res.status(400).json({ error: "projectId and amount are required" });
    }

    const paymentData = {
      projectId,
      amount: Number(amount),
      description,
      quotationUrl: req.file ? `/uploads/quotations/${req.file.filename}` : null,
      status: "pending",
      receipts: [],
    };

    const payment = await paymentService.createPayment(paymentData);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

// ---------------- Get Payments by Project ----------------
const getPaymentsByProject = async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentsByProject(req.query.projectId);
    res.json(Array.isArray(payments) ? payments : []);
  } catch (err) {
    next(err);
  }
};

// ---------------- Upload Receipt ----------------
const uploadReceipt = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const paidAmount = parseFloat(amount);

    if (!paidAmount || paidAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount paid" });
    }

    const payment = await paymentService.uploadReceipt(req.params.id, {
      amountPaid: paidAmount,
      receiptUrl: req.file ? `/uploads/receipts/${req.file.filename}` : undefined,
    });

    res.json(payment); // Returns payment with updated receipts array
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPayment,
  getPaymentsByProject,
  uploadReceipt,
};
