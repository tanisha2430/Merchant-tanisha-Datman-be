const mongoose = require("mongoose");

const InteractionSchema = new mongoose.Schema({
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  businessType: { type: String, enum: ["retail", "wholesale", "service", "others"], required: true },
  interactionType: { type: String, enum: ["phone", "email", "chat", "others"], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
  followUpDate: Date,
  status: { type: String, enum: ["open", "inprogress", "closed"], required: true },
});

module.exports = mongoose.model("Interaction", InteractionSchema);
