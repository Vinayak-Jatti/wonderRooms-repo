const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    filename: String,
    url: {
      type: String,
      default: "", // ✅ default to empty string instead of required
    },
  },
  price: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Create and export the model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
