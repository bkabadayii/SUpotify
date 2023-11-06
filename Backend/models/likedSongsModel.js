const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likedSongsSchema = new Schema({
    username: {
        type: String,
        required: [true, "Your username is required."],
    },
    likedSongsList: {
        type: Array,
        default: [],
        required: [true, "Liked songs list is required."],
    },
});

module.exports = mongoose.model("LikedSongs", likedSongsSchema);
