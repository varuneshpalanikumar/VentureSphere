const mongoose = require("mongoose");

const mentorRequestSchema = new mongoose.Schema({
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

  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  requestType: {
    type: String,
    enum: ["review", "mentorship"],
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
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("MentorRequest", mentorRequestSchema);