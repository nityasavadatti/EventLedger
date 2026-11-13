const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  enabled: { type: Boolean, default: true },
  action: { type: String, enum: ["BLOCK", "WARN"], required: true },
  description: { type: String, default: "" },
  parameters: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true, collection: "rules" });
module.exports = mongoose.models.Rule || mongoose.model("Rule", schema);
