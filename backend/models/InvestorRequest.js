const mongoose = require("mongoose");

const investorRequestSchema = new mongoose.Schema(
  {
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true
    },
    founder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    requestType: {
      type: String,
      default: "funding"
    },
    initiatedBy: {
      type: String,
      enum: ["founder", "investor"],
      required: true
    },
    message: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("InvestorRequest", investorRequestSchema);