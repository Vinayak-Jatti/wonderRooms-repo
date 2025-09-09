const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrspAsync");
const { isLoggedIn, savedirectUrl } = require("../middleware.js");

// === Signup Form ===
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// === Signup Logic ===
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      // console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "🎉 Welcome to WonderRooms, " + username + "!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

// === Login Form ===
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// === Login Logic ===
router.post(
  "/login",
  savedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "👋 Welcome back, " + req.user.username + "!");
    const redirectUrl = res.locals.redirectUrl || "/listings"; // fallback
    delete req.session.redirectUrl; // cleanup
    res.redirect(redirectUrl);
  }
);

// === Logout ===
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "👋 You’ve been logged out successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;
