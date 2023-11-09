const LikedSongs = require("../models/likedSongsModel");

module.exports.createLikedSongsForUser = async (req, res) => {
    try {
        const { username } = req.body;

        const existingUserLikedSongs = await LikedSongs.findOne({ username });

        if (existingUserLikedSongs) {
            return res.json({
                message: "Liked songs for this user already exists",
                success: false,
            });
        }

        const userLikedSongs = await LikedSongs.create({
            username: username,
            likedSongsList: [],
        });

        res.status(201).json({
            message: "User liked songs is created successfully",
            success: true,
            userLikedSongs,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.addToUserLikedSongs = async (req, res) => {
    try {
        // Get username and songID from request body
        const { username, songID } = req.body;
        let existingUserLikedSongs = await LikedSongs.findOne({ username });

        // If liked songs list is not initialized for user, throw error
        if (!existingUserLikedSongs) {
            return res.json({
                message: "User liked songs does not exist!",
                success: false,
            });
        }

        // If user already liked the song with songID, throw error
        const duplicate = existingUserLikedSongs.likedSongsList.find(
            (existingSongID) => songID === existingSongID
        );

        if (duplicate) {
            return res.json({
                message: "Song ID already exists in user liked songs!",
                success: false,
            });
        }

        // If there are no errors, add songID to user's liked songs list
        existingUserLikedSongs.likedSongsList.push(songID);
        await existingUserLikedSongs.save();

        res.status(201).json({
            message: `Added songID: ${songID}, to liked songs of user: ${username}`,
            success: true,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};

module.exports.removeFromUserLikedSongs = async (req, res) => {
    try {
        const { username, songID } = req.body;
        let existingUserLikedSongs = await LikedSongs.findOne({ username });

        // If liked songs list is not initialized for user, throw error
        if (!existingUserLikedSongs) {
            return res.json({
                message: "User liked songs does not exist!",
                success: false,
            });
        }

        // If user have not liked the song with songID, throw error
        const existingSongID = existingUserLikedSongs.likedSongsList.find(
            (existingSongID) => songID === existingSongID
        );

        if (!existingSongID) {
            return res.status(404).json({
                message:
                    "Cannot remove from liked songs because user has not liked the song!",
                success: false,
            });
        }

        // If there are no errors, remove the song from liked songs list
        const updatedLikedSongs = await LikedSongs.findOneAndUpdate(
            { username: username },
            { $pull: { likedSongsList: songID } }, // Pulling item from the liked songs list
            { new: true }
        );

        res.status(200).json({
            message: "Song is removed from liked songs successfully",
            updatedLikedSongs,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

module.exports.getLikedSongsForUser = async (req, res) => {
    try {
        const { username } = req.body;
        const existingUserLikedSongs = await LikedSongs.findOne({ username });

        // If user does not have liked songs, throw an error
        if (!existingUserLikedSongs) {
            res.status(500).json({
                message:
                    "Liked Songs does not exist for the specified username!",
                success: false,
            });
        }

        res.status(200).json({
            message: "Retrieved liked songs successfully",
            success: true,
            likedSongs: existingUserLikedSongs,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};
