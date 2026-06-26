const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  role: {
    type: String,
    enum: ["founder", "professional", "mentor", "investor"],
    default: "founder"
  },

  skills: [
    {
      type: String
    }
  ],

  verified: {
    type: Boolean,
    default: false
  },

  bio: {
    type: String,
    default: ""
  },

  joinedProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup"
    }
  ],

  portfolio: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("User", userSchema);