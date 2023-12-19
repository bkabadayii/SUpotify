const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    commentContent: {
        type: String,
        required: [true, "Comment content is required"],
    },
    commentedAt: {
        type: Date,
        required: [true, "Commented at is required"],
    },
    likes: [String], // Usernames of users who liked the comment
});

module.exports = mongoose.model("Comment", commentSchema);
