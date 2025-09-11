const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrspAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/review");

// ===== Validation Middleware =====
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// ===== Routes =====

// Create Review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.createReview));

// Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.deleteReview)
);

module.exports = router;
