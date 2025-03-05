const express = require("express");
const Merchant = require("../models/Merchant");
const Agent=require("../models/Agent")
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const merchants = await Agent.find().select('-password');
    res.json(merchants);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch merchants" });
  }
});

module.exports = router