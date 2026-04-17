const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrspAsync");
const { isLoggedIn, savedirectUrl } = require("../middleware.js");
const users = require("../controllers/user");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many attempts. Please try again after a minute.",
});

router
  .route("/signup")
  .get(users.renderSignup)
  .post(authLimiter, wrapAsync(users.signup));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    authLimiter,
    savedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    users.login
  );

router.get("/logout", isLoggedIn, users.logout);

module.exports = router;
