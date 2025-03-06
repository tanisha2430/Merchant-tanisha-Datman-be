const express = require("express");
const Interaction = require("../models/Interaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Interaction
router.post("/", authMiddleware, async (req, res) => {
  const { merchantId, businessType, interactionType, title, description, assignedTo, followUpDate, status } = req.body;
  try {
    const newInteraction = new Interaction({
      merchantId,
      businessType,
      interactionType,
      title,
      description,
      assignedTo,
      createdBy: req.agent._id,
      followUpDate,
      status,
    });

    await newInteraction.save();
    res.json({ message: "Interaction created successfully", interaction: newInteraction });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Failed to create interaction" });
  }
});

// Get Interaction by ID 
router.get("/:interactionId", authMiddleware, async (req, res) => {
  try {
    const interaction = await Interaction.findById(req.params.interactionId)
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email")
      .populate("merchantId", "name description");

    if (!interaction) return res.status(404).json({ error: "Interaction not found" });

    if (interaction.createdBy._id.toString() !== req.agent._id.toString() &&
        interaction.assignedTo._id.toString() !== req.agent._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(interaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch interaction" });
  }
});

// Get All Interactions by Merchant ID 
router.get("/merchant/:merchantId", authMiddleware, async (req, res) => {
  try {
    const interactions = await Interaction.find({ merchantId: req.params.merchantId })
      .populate("assignedTo", "username")
      .populate("createdBy", "username");

    const filteredInteractions = interactions.filter(interaction =>
      interaction.createdBy._id.toString() === req.agent._id.toString() ||
      interaction.assignedTo._id.toString() === req.agent._id.toString()
    );

    res.json(filteredInteractions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch interactions" });
  }
});

// Update Interaction by ID
router.put("/:interactionId", authMiddleware, async (req, res) => {
  try {
    const { businessType, interactionType, title, description, assignedTo, followUpDate, status } = req.body;

    const interaction = await Interaction.findById(req.params.interactionId);
    if (!interaction) return res.status(404).json({ error: "Interaction not found" });

    if (interaction.createdBy.toString() !== req.agent._id.toString() &&
        interaction.assignedTo.toString() !== req.agent._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    interaction.businessType = businessType;
    interaction.interactionType = interactionType;
    interaction.title = title;
    interaction.description = description;
    interaction.assignedTo = assignedTo;
    interaction.followUpDate = followUpDate;
    interaction.status = status;

    await interaction.save();

    res.json({ message: "Interaction updated successfully", interaction });
  } catch (err) {
    res.status(500).json({ error: "Failed to update interaction" });
  }
});

// Delete Interaction by ID 
router.delete("/:interactionId", authMiddleware, async (req, res) => {
  try {
    const interaction = await Interaction.findById(req.params.interactionId);
    if (!interaction) return res.status(404).json({ error: "Interaction not found" });

    if (interaction.createdBy.toString() !== req.agent._id.toString() &&
        interaction.assignedTo.toString() !== req.agent._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    await Interaction.findByIdAndDelete(req.params.interactionId);
    res.json({ message: "Interaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete interaction" });
  }
});

module.exports = router;
