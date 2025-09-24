const User = require("../models/User");

exports.validateUser = async (req, res, next) => {
  const { name, email, phone, addr } = req.body;

  if (!name || !email || !phone || !addr) {
    return res.status(400).send("All fields are required.");
  }

  // Check duplicate email or phone
  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    return res.status(409).send("Email or Phone already exists.");
  }

  next();
};
