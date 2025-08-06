const express = require("express");
const app = express();
const mongoose = require("mongoose");
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
