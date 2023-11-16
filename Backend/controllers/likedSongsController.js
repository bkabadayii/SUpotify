const LikedSongs = require("../models/likedSongsModel");
const Track = require("../models/trackModel");
const { getAlbumWithSpotifyID } = require("../operations/addAlbum");

module.exports.createLikedSongsForUser = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

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
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get songID from request body
        const { songID } = req.body;
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

// Adds a song to user liked songs by track spotify id and album spotify id
module.exports.addToUserLikedSongsBySpotifyID = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get songID from request body
        const { spotifyID, albumSpotifyID } = req.body;
        let existingUserLikedSongs = await LikedSongs.findOne({ username });

        // If liked songs list is not initialized for user, throw error
        if (!existingUserLikedSongs) {
            return res.json({
                message: "User liked songs does not exist!",
                success: false,
            });
        }

        // If user already liked the song with songID, throw error
        const duplicate = (
            await existingUserLikedSongs.populate("likedSongsList")
        ).likedSongsList.find(
            (existingSong) => spotifyID === existingSong.spotifyID
        );

        if (duplicate) {
            return res.json({
                message: "Song already exists in user liked songs!",
                success: false,
            });
        }

        // Check if the song is in database
        let existingTrackID = await Track.findOne({ spotifyID });
        // If not, add its album to the database
        if (!existingTrackID) {
            const albumID = await getAlbumWithSpotifyID(albumSpotifyID, false);
            if (!albumID) {
                throw new Error("Error in spotify request!!");
            }
            // Set track ID again after it is added.
            existingTrackID = await Track.findOne({ spotifyID });
        }

        existingUserLikedSongs.likedSongsList.push(existingTrackID);
        await existingUserLikedSongs.save();

        res.status(201).json({
            message: `Added track with spotify ID: ${spotifyID}, to liked songs of user: ${username}`,
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
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get songID from request body
        const { songID } = req.body;
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
        const user = req.user;
        const { username } = user;
        const existingUserLikedSongs = await LikedSongs.findOne({ username });

        // If user does not have liked songs, throw an error
        if (!existingUserLikedSongs) {
            res.status(500).json({
                message:
                    "Liked Songs does not exist for the specified username!",
                success: false,
            });
        }

        const populatedLikedSongs = await (
            await (
                await existingUserLikedSongs.populate("likedSongsList")
            ).populate("likedSongsList.artists")
        ).populate("likedSongsList.album");
        res.status(200).json({
            message: "Retrieved liked songs successfully",
            success: true,
            likedSongs: populatedLikedSongs,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// In order to add multiple songs in a single request
module.exports.addManyToUserLikedSongs = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get songIDList from request body
        const { songIDList } = req.body;
        let existingUserLikedSongs = await LikedSongs.findOne({ username });

        // If liked songs list is not initialized for user, throw error
        if (!existingUserLikedSongs) {
            return res.json({
                message: "User liked songs does not exist!",
                success: false,
            });
        }

        // Add all songs to liked songs if they already does not exist.
        // In order to store existing songs and newly added songs.
        var existingSongIDs = [];
        var addedSongIDs = [];
        for (var i = 0; i < songIDList.length; i++) {
            const songID = songIDList[i];
            const duplicate = existingUserLikedSongs.likedSongsList.find(
                (existingSongID) => songID === existingSongID
            );
            if (duplicate) {
                // If user already liked the song with songID, don't add
                existingSongIDs.push(songID);
            } else {
                // Else, add songID to user's liked songs list
                addedSongIDs.push(songID);
                existingUserLikedSongs.likedSongsList.push(songID);
            }
        }
        // Save database
        await existingUserLikedSongs.save();

        res.status(201).json({
            message: `Added non-duplicate songs successfully, to liked songs of user: ${username}`,
            success: true,
            existingSongIDs: existingSongIDs,
            addedSongIDs: addedSongIDs,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};
