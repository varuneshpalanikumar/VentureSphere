const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Startup"
  },

  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  comment: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Review", reviewSchema);