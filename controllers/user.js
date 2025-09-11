const User = require("../models/user.js");

// === Render Signup Form ===
module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

// === Handle Signup ===
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "🎉 Welcome to WonderRooms, " + username + "!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// === Render Login Form ===
module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

// === Handle Login ===
module.exports.login = (req, res) => {
  req.flash("success", "👋 Welcome back, " + req.user.username + "!");
  const redirectUrl = res.locals.redirectUrl || "/listings"; // fallback
  delete req.session.redirectUrl; // cleanup
  res.redirect(redirectUrl);
};

// === Handle Logout ===
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "👋 You’ve been logged out successfully!");
    res.redirect("/listings");
  });
};
