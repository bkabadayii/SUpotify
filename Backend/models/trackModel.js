const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trackSchema = new Schema({
    // General information
    name: {
        type: String,
        required: true,
    },
    popularity: {
        type: Number,
        required: false,
    },
    durationMS: {
        type: Number,
        required: true,
    },

    // Reference Information
    album: {
        // Album ID
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Album",
    },
    artists: [
        // Artist ID's
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Artist",
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
    previewURL: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("Track", trackSchema);
