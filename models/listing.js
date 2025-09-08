const { ref } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review");
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
      default: "",
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

// middleware for deleting associated reviews
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

// Create and export the model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
