const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrspAsync");
const ExpressError = require("./utils/ExpressError");

// Routers
const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");

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

//Custom error:
app.get("/test-error", (req, res) => {
  throw new Error("This is a test error!");
});

// Error Handler
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  // res.status(statusCode || 500).send(message || "Something went wrong");
  res.render("error.ejs");
});
