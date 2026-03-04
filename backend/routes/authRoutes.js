const express = require("express");
const router = express.Router();

// Controllers
const authController = require("../controllers/authController");

// JWT Middleware
const { verifyToken } = require("../middleware/authMiddleware");


// ================= REGISTER =================
router.post("/register", authController.register);


// ================= LOGIN =================
router.post("/login", authController.login);


// ================= PROTECTED ROUTE =================
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to your Biological Dashboard 🧬",
    user: req.user
  });
});


module.exports = router;