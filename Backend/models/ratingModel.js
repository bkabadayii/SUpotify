const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    // Whether it is track, album or artist
    ratingType: {
        type: String,
        enum: ["TRACK", "ALBUM", "ARTIST"],
        required: [true, "Rating type is required"],
    },
    // Related track's / album's / artist's id
    relatedID: {
        type: mongoose.Schema.Types.ObjectId,
    },
    // All ratings coming from users
    ratings: [
        {
            username: String,
            rating: Number,
            ratedAt: Date,
        },
    ],
});

module.exports = mongoose.model("Ratings", ratingSchema);
