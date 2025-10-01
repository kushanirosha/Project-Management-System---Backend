const paymentRepository = require("../repositories/paymentRepository");

const createPayment = async (data) => {
  return await paymentRepository.createPayment(data);
};

const getPaymentsByProject = async (projectId) => {
  return await paymentRepository.getPaymentsByProject(projectId);
};

const uploadReceipt = async (id, { amount, receiptUrl }) => {
  const payment = await paymentRepository.getPaymentById(id);
  if (!payment) throw new Error("Payment not found");

  if (amount) payment.amount = Number(amount);
  if (receiptUrl) {
    payment.receiptUrl = receiptUrl;
    payment.status = "paid";
    payment.paidAt = new Date();
  }

  return await payment.save();
};

module.exports = {
  createPayment,
  getPaymentsByProject,
  uploadReceipt,
};
