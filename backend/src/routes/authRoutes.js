const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUserByAdmin,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

// Admin Only
router.get("/users", protect, admin, getUsers);
router.get("/users/:id", protect, admin, getUserById);
router.put("/users/:id", protect, admin, updateUser);
router.delete("/users/:id", protect, admin, deleteUser);
router.post("/users", protect, admin, createUserByAdmin);

module.exports = router;