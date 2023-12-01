const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userToPlaylistsSchema = new Schema({
    username: {
        type: String,
        required: [true, "Your username is required."],
    },
    // Array that keeps playlist ID's of a user
    playlists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Playlist",
        },
    ],
});

module.exports = mongoose.model("UserToPlaylists", userToPlaylistsSchema);
