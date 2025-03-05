const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  interactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Interaction", required: true },
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  businessType: { type: String, enum: ["retail", "wholesale", "service", "others"], required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
  followUpDate: Date,
  status: { type: String, enum: ["open", "inprogress", "complete"], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  reminderTime: String,
  reminderDate: Date,
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", TaskSchema);
