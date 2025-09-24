const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"] 
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\d{10}$/, "Phone must be 10 digits"] 
  },
  addr: { type: String, required: true },
  otp: { type: String, default: null },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
