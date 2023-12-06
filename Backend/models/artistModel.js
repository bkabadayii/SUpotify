const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const artistSchema = new Schema({
    // General information
    name: {
        type: String,
        required: true,
    },
    genres: [
        {
            type: String,
            required: true,
        },
    ],
    popularity: {
        type: Number,
        required: true,
    },
    albums: [
        {
            ref: "Album",
            type: mongoose.Schema.Types.ObjectId,
            required: true,
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

module.exports = mongoose.model("Artist", artistSchema);
