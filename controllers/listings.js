const Listing = require("../models/listing");

const ITEMS_PER_PAGE = 12;

module.exports.index = async (req, res) => {
  const { q } = req.query;
  const currentPage = Math.max(1, parseInt(req.query.page, 10) || 1);

  let filter = {};
  if (q) {
    const regex = new RegExp(q, "i");
    filter = {
      $or: [
        { title: regex },
        { location: regex },
        { country: regex },
      ],
    };
  }

  const totalListings = await Listing.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalListings / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const allListings = await Listing.find(filter)
    .skip((safePage - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .sort({ _id: -1 });

  res.render("listings/index", {
    allListings,
    searchQuery: q,
    currentPage: safePage,
    totalPages,
    totalListings,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

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

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  let ogUrl = listing.image?.url || null;
  if (ogUrl) {
    ogUrl = ogUrl.replace("/upload", "/upload/h_300,w_250");
  }
  res.render("listings/edit.ejs", { listing, ogUrl });
};

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
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
