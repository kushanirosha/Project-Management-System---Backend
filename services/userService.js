const userRepo = require("../repositories/userRepository");

exports.registerUser = async (userData) => {
  const existing = await userRepo.findUserByEmail(userData.email);
  if (existing) throw new Error("User already exists");
  return await userRepo.createUser(userData);
};

exports.loginUser = async (email, password) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user || user.password !== password) throw new Error("Invalid credentials");
  return user;
};
