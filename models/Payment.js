const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  amountPaid: { type: Number, required: true },
  receiptUrl: { type: String, required: true },
  paidAt: { type: Date, default: Date.now },
});

const paymentSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'partial', 'paid', 'overdue'], default: 'pending' },
  quotationUrl: { type: String },
  receipts: [receiptSchema], // Array of multiple receipts
  dueDate: { type: Date, default: () => new Date(Date.now() + 30*24*60*60*1000) },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
