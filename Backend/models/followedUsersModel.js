const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followedUsersSchema = new Schema({
    username: {
        type: String,
        required: [true, "Your username is required."],
    },
    followedUsersList: [
        {
            type: mongoose.Schema.Types.String,
            ref: "User",
            default: "",
        },
    ],
});

module.exports = mongoose.model("FollowedUsers", followedUsersSchema);
