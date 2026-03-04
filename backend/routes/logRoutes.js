const express = require("express");
const router = express.Router();
const { createLog, getLogs } = require("../controllers/logController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/log", verifyToken, createLog);
router.get("/logs", verifyToken, getLogs);

module.exports = router;