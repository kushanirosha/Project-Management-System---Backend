const userService = require("../services/userService");

exports.register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await userService.loginUser(req.body.email, req.body.password);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
