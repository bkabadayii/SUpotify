const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const albumSchema = new Schema({
    // General information
    name: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    totalTracks: {
        type: Number,
        required: true,
    },
    genres: [
        {
            type: String,
            required: true,
        },
    ],

    // Reference information
    artists: [
        // Artist ID's
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Artist",
        },
    ],
    tracks: [
        // Track ID's
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Track",
        },
    ],

    // Spotify linked information
    spotifyID: {
        type: String,
        required: true,
    },
    spotifyURL: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Album", albumSchema);
