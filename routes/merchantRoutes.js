const express = require("express");
const Merchant = require("../models/Merchant");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get All Merchants
router.get("/", authMiddleware, async (req, res) => {
  try {
    const merchants = await Merchant.find();
    res.json(merchants);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch merchants" });
  }
});

//  Get Merchant by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).json({ error: "Merchant not found" });
    }
    res.json(merchant);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch merchant" });
  }
});

//  Create Merchant
router.post("/", authMiddleware, async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }

  try {
    const newMerchant = new Merchant({ name, description });
    await newMerchant.save();
    res.json({ message: "Merchant created successfully", merchant: newMerchant });
  } catch (err) {
    res.status(500).json({ error: "Failed to create merchant" });
  }
});

module.exports = router;
