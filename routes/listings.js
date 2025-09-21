const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrspAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const listings = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ===== middleware validation =====
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// ===== Routes =====

// Index + Create
router
  .route("/")
  .get(wrapAsync(listings.index)) // Index
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listings.createListing)
  ); // Create

// New form (separate, because it's just GET)
router.get("/new", isLoggedIn, listings.renderNewForm);

// Show + Update + Delete
router
  .route("/:id")
  .get(wrapAsync(listings.showListing)) // Show
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listings.updateListing)
  ) // Update
  .delete(isLoggedIn, wrapAsync(listings.deleteListing)); // Delete

// Edit form
router.get("/:id/edit", isLoggedIn, wrapAsync(listings.renderEditForm));

module.exports = router;
