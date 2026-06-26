const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema({

  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Startup"
  },

  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  message: {
    type: String
  },

  upVotes: {
    type: Number,
    default: 0
  },

  downVotes: {
    type: Number,
    default: 0
  },

  votes: [
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    voteType: {
      type: String,
      enum: ["up", "down"]
    }
  }
  ],
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

module.exports = mongoose.model("JoinRequest", joinRequestSchema);