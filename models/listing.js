const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    required: true,
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/silhouette-of-person-standing-on-rock-surrounded-by-body-of-water-odxB5oIG_iA"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
