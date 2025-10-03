const User = require("../models/User");

exports.createUser = (userData) => new User(userData).save();
exports.findUserByEmail = (email) => User.findOne({ email });
exports.findUserById = (id) => User.findById(id);
exports.findClients = () => User.find({ role: "client" });
