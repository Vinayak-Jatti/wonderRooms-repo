const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrspAsync");
const { isLoggedIn, savedirectUrl } = require("../middleware.js");
const users = require("../controllers/user");

// === Signup (form + logic) ===
router
  .route("/signup")
  .get(users.renderSignup) // GET form
  .post(wrapAsync(users.signup)); // POST logic

// === Login (form + logic) ===
router
  .route("/login")
  .get(users.renderLogin) // GET form
  .post(
    savedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    users.login
  );

// === Logout ===
router.get("/logout", isLoggedIn, users.logout);

module.exports = router;
