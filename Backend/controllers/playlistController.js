const Playlist = require("../models/playlistModel");
const UserToPlaylists = require("../models/userToPlaylistsModel");
const Track = require("../models/trackModel");

module.exports.createUserToPlaylists = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const existingUserToPlaylists = await UserToPlaylists.findOne({
            username,
        });

        if (existingUserToPlaylists) {
            return res.json({
                message: "Playlists for this user already exists",
                success: false,
            });
        }

        const userToPlaylists = await UserToPlaylists.create({
            username: username,
            playlists: [],
        });

        res.status(201).json({
            message: "User to playlists is created successfully",
            success: true,
            userToPlaylists,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "User to Playlists Creation Failed!" });
    }
};

// Get all playlists of a user
module.exports.getUserPlaylists = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get userToPlaylists
        let userToPlaylists = await UserToPlaylists.findOne({ username });
        if (!userToPlaylists) {
            return res.json({
                message: "User to Playlists Not Found for the user",
                username,
                success: false,
            });
        }

        // Return userToPlaylists
        const populatedPlaylists = await userToPlaylists.populate("playlists");
        return res.status(201).json({
            message: "User Playlists Returned Successfully",
            username,
            userToPlaylists: populatedPlaylists,
            success: true,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Get User Playlists Failed!" });
    }
};

// Creates a new playlist and adds it to the user's playlists
/*
    body: {
        playlistName: String,
    }
*/
module.exports.createPlaylist = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;
        const { playlistName } = req.body;

        // Get userToPlaylists
        let userToPlaylists = await UserToPlaylists.findOne({ username });
        if (!userToPlaylists) {
            return res.json({
                message: "User to Playlists Not Found for the user",
                username,
                success: false,
            });
        }

        // Check if the user has a playlist with the same name provided
        const existingPlaylist = (
            await userToPlaylists.populate("playlists")
        ).playlists.find((playlist) => {
            return playlist.name === playlistName;
        });

        if (existingPlaylist) {
            return res.json({
                message: "User already has a playlist with the same name",
                success: false,
            });
        }

        // Create a new playlist
        const newPlaylist = await Playlist.create({
            name: playlistName,
            owner: username,
            trackList: [],
        });

        // Add it to user's playlists
        userToPlaylists.playlists.push(newPlaylist._id);
        await userToPlaylists.save();

        return res.status(201).json({
            message: "Playlist created successfully",
            username,
            playlistName,
            success: true,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Create Playlist Failed!" });
    }
};
