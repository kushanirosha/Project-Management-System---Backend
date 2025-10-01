const Payment = require("../models/Payment");

const createPayment = async (paymentData) => {
  const payment = new Payment(paymentData);
  return await payment.save();
};

const getPaymentsByProject = async (projectId) => {
  return await Payment.find({ projectId });
};

const getPaymentById = async (id) => {
  return await Payment.findById(id);
};

const updatePayment = async (id, updateData) => {
  return await Payment.findByIdAndUpdate(id, updateData, { new: true });
};

module.exports = {
  createPayment,
  getPaymentsByProject,
  getPaymentById,
  updatePayment,
};
