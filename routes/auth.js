// routes/auth.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/User"); // make sure path is correct

let otpStore = {}; // temporary store

// Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP required" });
  }

  const record = otpStore[email];
  if (!record) {
    return res.status(400).json({ success: false, message: "No OTP found for this email" });
  }

  if (record.expires < Date.now()) {
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  return res.json({ success: true, message: "OTP verified successfully" });
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const record = otpStore[email];
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 🚨 Directly saving plain password (no hashing)
    user.password = newPassword;
    await user.save();

    delete otpStore[email]; // clear OTP
    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
