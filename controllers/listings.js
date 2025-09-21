const Listing = require("../models/listing");

// Index - All Listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// New Form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show - Single Listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  res.render("listings/show.ejs", { listing });
};

// Create - Add Listing
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing added successfully!");
  res.redirect("/listings");
};

// Edit Form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).send("Listing not found");
  res.render("listings/edit.ejs", { listing });
};

// Update
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save(); // ✅ Corrected
  }

  req.flash("success", "✅ Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// Delete
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
};
