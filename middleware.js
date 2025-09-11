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
  const { reviewId } = req.params;

  if (!res.locals.currUser) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect("/listings");
  }

  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to do that");
    return res.redirect("/listings");
  }

  next();
};
