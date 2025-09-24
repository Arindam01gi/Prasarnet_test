const mongoose = require("mongoose");
const User = require("../models/User");
const { generateOtp } = require("../services/otpService");


// Create User 
exports.createUser = async (req, res) => {
    try {
        const { name, email, phone, addr } = req.body;
        const otp = generateOtp();

        const user = new User({ name, email, phone, addr, otp });
        await user.save();

        res.status(201).json({
            message: "User created successfully",
            email: user.email,
            otp,
        });
    } catch (err) {
        if (err && err.code === 11000) {
            const field =
                (err.keyPattern && Object.keys(err.keyPattern)[0]) ||
                (err.keyValue && Object.keys(err.keyValue)[0]) ||
                "field";
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
            return res.status(409).json({ error: `${fieldName} already exists` });
        }
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.otp === otp) {
            user.verified = true;
            user.otp = null;
            await user.save();
            res.json({ message: "User verified successfully" });
        } else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// List Users
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updated);
    } catch (err) {
        if (err.code === 11000) {
            const field =
                (err.keyPattern && Object.keys(err.keyPattern)[0]) ||
                (err.keyValue && Object.keys(err.keyValue)[0]) ||
                "field";
            return res
                .status(409)
                .json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` });
        }

        if (err.name === "ValidationError") {
            const errors = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ error: errors });
        }

        res.status(500).json({ error: "Something went wrong" });
    }
};


// Delete User
exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) return res.status(400).json({ error: "User ID is required" });
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid User ID format" });
      }
  
      const existingUser = await User.findById(id);
      if (!existingUser) return res.status(404).json({ error: "User not found" });

      await User.findByIdAndDelete(id);
  
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };