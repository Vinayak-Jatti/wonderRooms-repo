if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrspAsync");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const passport = require("passport");
const helmet = require("helmet");
const compression = require("compression");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/auth.js");

const app = express();
app.set("trust proxy", 1); // Required for express-rate-limit on Render/proxies
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.ATLASDB_URL;
const SESSION_SECRET = process.env.SECRET;

/* ========== Security ========== */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com", "cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "blob:", "*.unsplash.com", "images.unsplash.com", "res.cloudinary.com"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(compression());

/* ========== App Configuration ========== */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files extremely early to prevent MIME blocks
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

/* ========== Session Store ========== */
const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: { secret: SESSION_SECRET },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.error("Session store error:", err);
});

const sessionOptions = {
  store,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

/* ========== Auth Middleware ========== */
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.messages = req.session.messages || {};
  req.session.messages = {};
  res.locals.currUser = req.user || null;
  next();
});

app.use((req, res, next) => {
  req.flash = (type, message) => {
    if (!req.session.messages) req.session.messages = {};
    req.session.messages[type] = message;
  };
  next();
});

/* ========== Database Connection ========== */
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to Database: MongoDB");
  } catch (connectionError) {
    console.error("MongoDB connection failed:", connectionError.message);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB runtime error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Attempting reconnection...");
});

/* ========== Routes ========== */
app.get("/", (req, res) => {
  res.render("landing");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.get("/privacy", (req, res) => {
  res.render("pages/police");
});

app.get("/terms", (req, res) => {
  res.render("pages/terms");
});

/* ========== 404 Catch-All ========== */
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

/* ========== Global Error Handler ========== */
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[${statusCode}] ${err.message}`);
  }

  res.status(statusCode).render("error.ejs", { err });
});

/* ========== Graceful Shutdown ========== */
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  mongoose.connection.close(false).then(() => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  gracefulShutdown("UNHANDLED_REJECTION");
});

/* ========== Start Server ========== */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
});
