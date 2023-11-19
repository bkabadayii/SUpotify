const FollowedUsers = require("../models/followedUsersModel");

module.exports.createFollowedUsersForUser = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const existingUserFollowedUsers = await FollowedUsers.findOne({ username });

        if (existingUserFollowedUsers) {
            return res.json({
                message: "Followed users list for this user already exists",
                success: false,
            });
        }

        const userFollowedUsers = await FollowedUsers.create({
            username: username,
            followedUsersList: [],
        });

        res.status(201).json({
            message: "User followed users list is created successfully",
            success: true,
            userFollowedUsers,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.addToUserFollowedUsers = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get followedUsername from request body
        const { followedUsername } = req.body;
        let existingUserFollowedUsers = await FollowedUsers.findOne({ username });

        // If followed users list is not initialized for user, throw error
        if (!existingUserFollowedUsers) {
            return res.json({
                message: "User followed users list does not exist!",
                success: false,
            });
        }

        // If user already followed the other user, throw error
        const duplicate = existingUserFollowedUsers.followedUsersList.find(
            (existingFollowedUsername) => followedUsername === existingFollowedUsername
        );

        if (duplicate) {
            return res.json({
                message: "Followed username already exists in user followed users list!",
                success: false,
            });
        }

        // If there are no errors, add username of followedUser to user's followed users list
        existingUserFollowedUsers.followedUsersList.push(followedUsername);
        await existingUserFollowedUsers.save();

        res.status(201).json({
            message: `Added followed username: ${followedUsername}, to followed users list of user: ${username}`,
            success: true,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};

module.exports.removeFromUserFollowedUsers = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get followedUsername from request body
        const { followedUsername } = req.body;
        let existingUserFollowedUsers = await FollowedUsers.findOne({ username });

        // If followed users list is not initialized for user, throw error
        if (!existingUserFollowedUsers) {
            return res.json({
                message: "User followed users list does not exist!",
                success: false,
            });
        }

        // If user have not followed the user, throw error
        const existingFollowedUsername = existingUserFollowedUsers.followedUsersList.find(
            (existingFollowedUsername) => followedUsername === String(existingFollowedUsername)
        );

        if (!existingFollowedUsername) {
            return res.status(404).json({
                message:
                    "Cannot remove from followed users because user has not followed the user!",
                success: false,
            });
        }

        // If there are no errors, remove the user from followed users list
        const updatedFollowedUsers = await FollowedUsers.findOneAndUpdate(
            { username: username },
            { $pull: { followedUsersList: followedUsername } }, // Pulling item from the followed users list
            { new: true }
        );

        res.status(200).json({
            message: "User is removed from followed users successfully",
            updatedFollowedUsers,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};
