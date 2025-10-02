const paymentRepository = require("../repositories/paymentRepository");

const createPayment = async (data) => {
  return await paymentRepository.createPayment(data);
};

const getPaymentsByProject = async (projectId) => {
  return await paymentRepository.getPaymentsByProject(projectId);
};

const uploadReceipt = async (id, { amountPaid, receiptUrl }) => {
  const payment = await paymentRepository.getPaymentById(id);
  if (!payment) throw new Error("Payment not found");

  payment.receipts = payment.receipts || [];
  payment.receipts.push({
    amountPaid: Number(amountPaid),
    receiptUrl,
    paidAt: new Date(),
  });

  // Calculate total paid from all receipts
  const totalPaid = payment.receipts.reduce((sum, r) => sum + r.amountPaid, 0);

  // Update status
  if (totalPaid >= payment.amount) {
    payment.status = "paid";
  } else if (totalPaid > 0) {
    payment.status = "partial";
  } else {
    payment.status = "pending";
  }

  return await payment.save();
};

module.exports = {
  createPayment,
  getPaymentsByProject,
  uploadReceipt,
};
