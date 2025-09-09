const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("connected to mongodb.");
}

const initDB = async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});

  // create a default user
  const user = new User({ email: "test@example.com", username: "vinayak" });
  await User.register(user, "password123");

  // assign this user as owner
  const seedData = initData.data.map((obj) => ({
    ...obj,
    owner: user._id,
  }));

  await Listing.insertMany(seedData);
  console.log("data was inserted!");
  mongoose.connection.close();
};

main()
  .then(initDB)
  .catch((err) => console.log(err));
