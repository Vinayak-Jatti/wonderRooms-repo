const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const port = 3000;

app.listen(port, () => {
  console.log("server started successfully!");
});

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("connected to mongodb.");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("hi am root");
});

app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "mylife",
    description: "demo-image",
    price: 1000,
    location: "my town",
    country: "india",
  });

  await sampleListing.save();
  console.log("sample was saved!");
  res.send("testing done!");
});
