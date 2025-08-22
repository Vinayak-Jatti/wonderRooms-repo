const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing");
const wrapAsync = require("./utils/wrspAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review");
// const listingSchema = require("./schema.js");

// ==== Connetions ====
const app = express();
const port = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

// ===== App Config =====
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ===== MongoDB Connection & Server Start =====
wrapAsync(async () => {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DataBase : MongoDB");

  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
})();

// ===== midleware validetion =====
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    // Extract the error message from Joi
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    // Extract the error message from Joi
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// ===== Routes =====

// Root Route
app.get("/", (req, res) => {
  res.send("Hi, I am root!");
});

// Index Route - All Listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

// New Route - Form to create listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route - Single listing
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

// Create Route - Add listing
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Edit Route - Form to edit listing
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).send("Listing not found");
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route - Apply changes
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route - Remove listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

//reviews
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved!");
    res.redirect(`/listings/${listing._id}`);
  })
);

app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

//Custom error:
app.get("/test-error", (req, res) => {
  throw new Error("This is a test error!");
});

// Error Handler
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  // res.status(statusCode || 500).send(message || "Something went wrong");
  res.render("error.ejs");
});
