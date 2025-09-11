const Review = require("./models/review");

// Protect routes, save the page the user wanted
// Protect routes, save the page the user wanted
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Only save if the request was a GET
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    }
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
  const { reviewId, id } = req.params; // also grab listingId for redirects

  if (!req.user) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to do that");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
