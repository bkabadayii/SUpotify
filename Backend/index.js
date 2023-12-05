const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const { MONGO_URL, PORT } = process.env;

// import 'verifyToken' middleware
const { verifyToken } = require("./middlewares/verifyToken");

// ----- Routes -----
const defaultRouter = require("./routes/defaultRouter");
const authRoute = require("./routes/authRoute"); // route for the authentication
const likedContentRoute = require("./routes/likedContentRoute");
const spotifyApiRoute = require("./routes/spotifyApiRoute");
const addAlbumRoute = require("./routes/addAlbumRoute");
const followedUsersRoute = require("./routes/followedUsersRoute");
const playlistRoute = require("./routes/playlistRoute");
const ratingRoute = require("./routes/ratingRoute");
// ----- Routes -----

console.log("Starting SUpotify...");

// Initialize express application
const app = express();

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

// In order to see requests in console
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});
// ----- Middlewares -----

async function startServer() {
    try {
        // Get and set a new Spotify access token
        const { getAccessToken } = require("./util/SpotifyAccessToken");
        const accessToken = await getAccessToken();
        console.log("Spotify connection is successful.");

        // Connect to MongoDB database
        await mongoose
            .connect(MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => console.log("MongoDB connection is successful."))
            .catch((err) => console.error(err));

        // ----- Controllers -----
        app.use("/auth", authRoute);

        app.use("/api", verifyToken); // Set verifyToken middleware for all endpoints belonging to /api
        app.use("/api/likedSongs", likedContentRoute);
        app.use("/api/default", defaultRouter);
        app.use("/api/album", addAlbumRoute);
        app.use("/api/followedUsers", followedUsersRoute);
        app.use("/api/playlists", playlistRoute);
        app.use("/api/ratings", ratingRoute);

        app.use("/api/getFromSpotify", spotifyApiRoute);

        // ----- Controllers -----

        // Start the server
        const server = app.listen(PORT || 4000, () => {
            console.log("Welcome to SUpotify!");
        });
    } catch (error) {
        console.error("Error getting Spotify access token:", error.message);
    }
}

// Run the example
startServer();
