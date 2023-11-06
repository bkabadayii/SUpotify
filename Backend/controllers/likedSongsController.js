const LikedSongs = require("../models/likedSongsModel");

module.exports.createLikedSongsForUser = async (req, res) => {
    try {
        const { username } = req.body;

        const existingUser = await LikedSongs.findOne({ username });

        if (existingUser) {
            return res.json({ message: "User already exists" });
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
