const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrspAsync");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Routers
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const passport = require("passport");
const userRouter = require("./routes/auth.js");

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

const sessionOptions = {
  secret: "secretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

// ======== Passport ==========
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.messages = req.session.messages || {};
  req.session.messages = {}; // clear after use
  next();
});

app.use((req, res, next) => {
  req.flash = (type, message) => {
    if (!req.session.messages) req.session.messages = {};
    req.session.messages[type] = message;
  };
  next();
});

// ===== MongoDB Connection & Server Start =====
wrapAsync(async () => {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DataBase : MongoDB");

  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
})();

// ===== Routes =====
app.get("/", (req, res) => {
  res.send("Hi, I am root!");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

//Custom error:
app.get("/test-error", (req, res) => {
  throw new Error("This is a test error!");
});

// Error Handler
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error.ejs", { err });
});
