const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create User (POST)
router.post("/", userController.createUser);

// Verify OTP (POST)
router.post("/verify-otp", userController.verifyOtp);

// List Users (GET)
router.get("/", userController.listUsers);

// Update User (PUT)
router.put("/:id", userController.updateUser);

// Delete User (DELETE)
router.delete("/:id", userController.deleteUser);

module.exports = router;
