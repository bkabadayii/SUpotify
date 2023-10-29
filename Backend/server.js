const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
const { MONGO_URL } = process.env;

// Initialize express application
const app = express();

// Connect to MongoDB database
mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connection is successful."))
    .catch((err) => console.error(err));

app.get("/", (req, res) => {
    res.json({ msg: "Welcome to SUpotify!!" });
});

app.listen(4000, () => {
    console.log("Welcome to SUpotify");
});
