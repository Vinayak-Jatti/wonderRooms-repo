const Review = require("./models/review");

// Protect routes, save the page the user wanted
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

// Make saved URL available for the login route
module.exports.savedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    // Check if user is logged in
    if (!res.locals.currUser) throw new Error("You must be logged in");

    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Review not found");

    if (!review.author.equals(res.locals.currUser._id))
      throw new Error("You are not authorized");

    next(); // ✅ proceed to route handler if all is good
  } catch (err) {
    next(err); // pass error to global handler
  }
};
