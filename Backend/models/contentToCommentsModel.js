const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contentToCommentsSchema = new Schema({
    // Whether it is track, album or artist
    contentType: {
        type: String,
        enum: ["TRACK", "ALBUM", "ARTIST"],
        required: [true, "Comment type is required"],
    },
    // Related track's / album's / artist's id
    relatedID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Related ID is required"],
    },
    // All comments coming from users
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
});

module.exports = mongoose.model("ContentToComments", contentToCommentsSchema);
