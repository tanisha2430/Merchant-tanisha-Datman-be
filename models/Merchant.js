const mongoose = require("mongoose");

const MerchantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

module.exports = mongoose.model("Merchant", MerchantSchema);
