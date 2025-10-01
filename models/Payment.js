const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  projectId: { type: String, required: true }, // ✅ accept string project IDs
  amount: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  quotationUrl: { type: String },
  receiptUrl: { type: String },
  dueDate: { type: Date, default: () => new Date(Date.now() + 30*24*60*60*1000) },
  paidAt: { type: Date }
}, { timestamps: true });


module.exports = mongoose.model("Payment", paymentSchema);
