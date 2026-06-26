const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  founder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  fundingRequired: {
    type: Number,
    default: 0
  },

  techSupportRequired: {
    type: Boolean,
    default: false
  },

  mentorshipRequired: {
    type: Boolean,
    default: false
  },
  mentorReviewRequested: {
  type: Boolean,
  default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  latestUpdate: {
    type: String,
    default: ""
  },

  professionalsJoined: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  mentorsJoined: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  investorsInterested: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  startupScore: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Startup", startupSchema);