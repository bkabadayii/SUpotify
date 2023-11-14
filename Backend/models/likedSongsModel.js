const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likedSongsSchema = new Schema({
    username: {
        type: String,
        required: [true, "Your username is required."],
    },
    likedSongsList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Track",
            default: "",
        },
    ],
});

module.exports = mongoose.model("LikedSongs", likedSongsSchema);
