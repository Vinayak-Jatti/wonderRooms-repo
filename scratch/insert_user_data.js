require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");

const dbUrl = process.env.ATLASDB_URL;

const userData = [
  {
    _id: "68e88c5da6100b80ff115628",
    title: "1BHK Fully Furnished Flat",
    description: "1BHK flat with modular kitchen, AC, and Wi-Fi included, ideal for single occupancy.",
    price: 10000,
    location: "Bangaloru, Karnataka",
    country: "INDIA",
    image: {
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    owner: "68d0ce0e915a950284988914"
  },
  {
    _id: "68e88cbaa6100b80ff115630",
    title: "Family-Friendly 2BHK",
    description: "Spacious 2BHK in a residential society with a park and security.",
    price: 13000,
    location: "Ahmedabad, Gujarat",
    country: "INDIA",
    image: {
      url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    owner: "68d0ce0e915a950284988914"
  },
  {
    _id: "68e88cf3a6100b80ff115638",
    title: "Budget Studio Apartment",
    description: "Affordable studio with attached bathroom and kitchen, close to public transport.",
    price: 8000,
    location: "Patna, Bihar",
    country: "INDIA",
    image: {
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    owner: "68d0ce0e915a950284988914"
  },
  {
    _id: "68e88d3ba6100b80ff115640",
    title: "Compact Flat with Balcony",
    description: "1BHK flat with a small balcony and natural sunlight, fully furnished.",
    price: 6000,
    location: "Lucknow, Uttar Pradesh",
    country: "INDIA",
    image: {
      url: "https://images.unsplash.com/photo-1536376074432-bf121770b4b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    owner: "68d0ce0e915a950284988914"
  }
];

async function insertData() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to Atlas DB.");

    for (let data of userData) {
      // Use findOneAndUpdate with upsert to avoid duplicates and handle manual _id
      await Listing.findOneAndUpdate(
        { _id: data._id },
        data,
        { upsert: true, new: true }
      );
      console.log(`Successfully processed: ${data.title}`);
    }

    console.log("All data inserted properly.");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error inserting data:", err);
    process.exit(1);
  }
}

insertData();
