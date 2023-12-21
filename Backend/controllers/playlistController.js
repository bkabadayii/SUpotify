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
                message: "User to Playlists Not Found for the user!",
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
                message: "User already has a playlist with the same name!",
                success: false,
            });
        }

        // Create a new playlist
        const newPlaylist = await Playlist.create({
            name: playlistName,
            owner: username,
            tracks: [],
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

// Deletes a playlist from the playlist collection and user's playlists
/*
    body: {
        playlistID: ObjectID,
    }
*/
module.exports.deletePlaylist = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;
        const { playlistID } = req.body;

        // Get userToPlaylists
        let userToPlaylists = await UserToPlaylists.findOne({ username });
        if (!userToPlaylists) {
            return res.json({
                message: "User to Playlists not found for the user!",
                username,
                success: false,
            });
        }

        // Check if user has the playlist with correct id
        let existingPlaylist = userToPlaylists.playlists.find((id) => {
            return String(id) === playlistID;
        });

        // If not return error
        if (!existingPlaylist) {
            return res.status(404).json({
                message:
                    "Cannot find the playlist with provided id in user's playlists!",
                success: false,
            });
        }

        existingPlaylist = await Playlist.findById(playlistID);
        if (!existingPlaylist) {
            return res.status(404).json({
                message:
                    "Cannot find the playlist with provided id in all playlists!",
                success: false,
            });
        }

        // Remove from user's playlists
        const updatedUserToPlaylists = await UserToPlaylists.findOneAndUpdate(
            { username: username },
            { $pull: { playlists: playlistID } },
            { new: true }
        );
        // Remove from all playlists
        const deletedPlaylist = await Playlist.findByIdAndDelete(playlistID);

        res.status(201).json({
            message: "Deleted playlist successfully",
            success: true,
            updatedUserToPlaylists,
            deletedPlaylist,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Delete Playlist Failed!" });
    }
};

// Gets a user's playlist
/*
    params: {
        playlistID: ObjectID,
    }
*/
module.exports.getPlaylist = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;
        const { playlistID } = req.params;

        // Get userToPlaylists
        let userToPlaylists = await UserToPlaylists.findOne({ username });
        if (!userToPlaylists) {
            return res.json({
                message: "User to Playlists not found for the user!",
                username,
                success: false,
            });
        }

        // Check if user has the playlist with correct id
        let existingPlaylist = userToPlaylists.playlists.find((id) => {
            return String(id) === playlistID;
        });

        // If not return error
        if (!existingPlaylist) {
            return res.status(404).json({
                message:
                    "Cannot find the playlist with provided id in user's playlists!",
                success: false,
            });
        }

        existingPlaylist = await (
            await (
                await (
                    await Playlist.findById(existingPlaylist)
                ).populate("tracks")
            ).populate("tracks.artists", "name")
        ).populate("tracks.album", ["name", "imageURL"]);

        res.status(201).json({
            message: "Returned playlist successfully",
            success: true,
            playlist: existingPlaylist,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Get Playlist Failed!" });
    }
};

// Adds a track to a playlist
/*
    body: {
        playlistID: ObjectID,
        trackID: ObjectID
    }
*/
module.exports.addTrackToPlaylist = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;
        const { playlistID, trackID } = req.body;

        // Get userToPlaylists
        let userToPlaylists = await UserToPlaylists.findOne({ username });
        if (!userToPlaylists) {
            return res.json({
                message: "User to Playlists not found for the user!",
                username,
                success: false,
            });
        }

        // Check if user has the playlist with correct id
        let existingPlaylist = userToPlaylists.playlists.find((id) => {
            return String(id) === playlistID;
        });

        // If not return error
        if (!existingPlaylist) {
            return res.status(404).json({
                message:
                    "Cannot find the playlist with provided id in user's playlists!",
                success: false,
            });
        }
        // Check if the track exists in all tracks
        let existingTrack = await Track.findById(trackID);
        if (!existingTrack) {
            return res.status(404).json({
                message: "Cannot find the track with provided id!",
                success: false,
            });
        }

        // Check if the playlist already has the track
        existingPlaylist = await Playlist.findById(playlistID);
        existingTrack = existingPlaylist.tracks.find((id) => {
            return String(id) === trackID;
        });
        if (existingTrack) {
            return res.status(404).json({
                message: "Track already exists in this playlist!",
                success: false,
            });
        }

        existingPlaylist.tracks.push(trackID);
        await existingPlaylist.save();

        res.status(201).json({
            message: "Added track to the playlist successfully",
            success: true,
            existingPlaylist,
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Add Track to Playlist Failed!" });
    }
};

// Removes a track from a playlist
/*
    body: {
        playlistID: ObjectID,
        trackID: ObjectID
    }
*/
module.exports.removeTrackFromPlaylist = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;
        const { playlistID, trackID } = req.body;

        // Get userToPlaylists
        let userToPlaylists = await UserToPlaylists.findOne({ username });
        if (!userToPlaylists) {
            return res.json({
                message: "User to Playlists not found for the user!",
                username,
                success: false,
            });
        }

        // Check if user has the playlist with correct id
        let existingPlaylist = userToPlaylists.playlists.find((id) => {
            return String(id) === playlistID;
        });

        // If not return error
        if (!existingPlaylist) {
            return res.status(404).json({
                message:
                    "Cannot find the playlist with provided id in user's playlists!",
                success: false,
            });
        }

        // Check if the playlist has the track
        existingPlaylist = await Playlist.findById(playlistID);
        existingTrack = existingPlaylist.tracks.find((id) => {
            return String(id) === trackID;
        });
        if (!existingTrack) {
            return res.status(404).json({
                message: "Track does not exist in this playlist!",
                success: false,
            });
        }

        // Remove from user's playlists
        const updatedPlaylist = await Playlist.findOneAndUpdate(
            { _id: playlistID },
            { $pull: { tracks: trackID } },
            { new: true }
        );

        await existingPlaylist.save();

        res.status(201).json({
            message: "Removed track from the playlist successfully",
            success: true,
            updatedPlaylist,
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Remove Track from Playlist Failed!" });
    }
};
