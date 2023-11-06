const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const { MONGO_URL, PORT } = process.env;

// ----- Routes -----
const defaultRouter = require("./routes/defaultRouter");
const authRoute = require("./routes/authRoute"); // route for the authentication
const likedSongsRoute = require("./routes/likedSongsRoute");
// ----- Routes -----

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

// ----- Middlewares -----
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(cookieParser());

app.use(express.json());
// ----- Middlewares -----

// ----- Controllers -----
app.use("/auth", authRoute);
app.use("/likedSongs", likedSongsRoute);
app.use("/api/default", defaultRouter);
// ----- Controllers -----

// Start the server
const server = app.listen(PORT || 4000, () => {
    console.log("Welcome to SUpotify");
});
