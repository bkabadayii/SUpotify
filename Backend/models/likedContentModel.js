const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likedContentSchema = new Schema({
    username: {
        type: String,
        required: [true, "Your username is required."],
    },
    likedTracks: [
        {
            track: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Track",
            },
            likedAt: {
                type: Date,
            },
        },
    ],
    likedAlbums: [
        {
            album: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Album",
            },
            likedAt: {
                type: Date,
            },
        },
    ],
    likedArtists: [
        {
            artist: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Artist",
            },
            likedAt: {
                type: Date,
            },
        },
    ],
});

module.exports = mongoose.model("LikedContent", likedContentSchema);
