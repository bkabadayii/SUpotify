const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
        ref: "User",
    },
    tracks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Track",
            default: "",
        },
    ],
});

module.exports = mongoose.model("Playlist", playlistSchema);
