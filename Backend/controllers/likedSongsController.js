const LikedSongs = require("../models/likedSongsModel");
const Track = require("../models/trackModel");
const { getAlbumWithSpotifyID } = require("../operations/addAlbum");
const { addCustomTrack } = require("./tracksController");
const { exactSearchFromSpotify } = require("./spotifyApiController");

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

/*
body: {
    trackName: String
    albumName: String
    by: "name" or "id"
    artists: [String] if by === "name"
    artists: [ObjectID] if by === "id"
}
*/
module.exports.addCustomToUserLikedSongs = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get necessary variables from request body
        const { trackName, albumName, artists, by } = req.body;
        let existingUserLikedSongs = await LikedSongs.findOne({ username });

        // If liked songs list is not initialized for user, throw error
        if (!existingUserLikedSongs) {
            return res.json({
                message: "User liked songs does not exist!",
                success: false,
            });
        }

        // If there are no errors, add track to user's liked songs list
        const newTrackId = await addCustomTrack(
            trackName,
            albumName,
            artists,
            by
        );
        if (!newTrackId) {
            return res.json({
                message: "Cannot add custom track to user's liked songs list!",
                success: false,
            });
        }

        existingUserLikedSongs.likedSongsList.push(newTrackId);
        await existingUserLikedSongs.save();

        res.status(201).json({
            message: `Added custom song to liked songs of user: ${username}`,
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
            (existingSongID) => songID === String(existingSongID)
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
            ).populate("likedSongsList.artists", "name")
        ).populate("likedSongsList.album", ["name", "imageURL"]);
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
/*
body: {
    "trackList": [
        {"trackName": "someTrackName", "albumName": "someAlbumName", "artistName": "someArtistName"}
        {"trackName": "someTrackName2", "albumName": "someAlbumName2", "artistName": "someArtistName2"}
    ]
}
*/

module.exports.addManyToUserLikedSongs = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get trackList from request body
        const { trackList } = req.body;
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
        var existingTracks = [];
        var addedTracks = [];
        for (const track of trackList) {
            const { trackName, albumName, artistName } = track;
            const spotifyResult = await exactSearchFromSpotify(
                trackName,
                albumName,
                artistName
            );

            // If track is found in spotify, use that data
            if (spotifyResult.Tracks[0]) {
                const newTrack = spotifyResult.Tracks[0];
                const newTrackSpotifyID = newTrack.id;
                const newAlbumSpotifyID = newTrack.albumID;

                const duplicate = (
                    await existingUserLikedSongs.populate("likedSongsList")
                ).likedSongsList.find((song) => {
                    return song.spotifyID === newTrackSpotifyID;
                });

                if (duplicate) {
                    existingTracks.push({ trackName, albumName, artistName });
                } else {
                    // Check if the song is in database
                    let existingTrack = await Track.findOne({
                        spotifyID: newTrackSpotifyID,
                    });
                    // If not, add its album to the database
                    if (!existingTrack) {
                        const albumID = await getAlbumWithSpotifyID(
                            newAlbumSpotifyID,
                            false
                        );
                        if (!albumID) {
                            throw new Error("Error in spotify request!!");
                        }
                        // Set track ID again after it is added.
                        existingTrack = await Track.findOne({
                            spotifyID: newTrackSpotifyID,
                        });
                    }

                    existingUserLikedSongs.likedSongsList.push(
                        existingTrack._id
                    );
                    addedTracks.push({ trackName, albumName, artistName });
                }
            }

            // Else add track to database as a custom song
            else {
                const duplicate = (
                    await (
                        await existingUserLikedSongs.populate("likedSongsList")
                    ).populate("likedSongsList.album")
                ).likedSongsList.find((song) => {
                    return (
                        song.name === trackName && song.album.name === albumName
                    );
                });

                if (duplicate) {
                    existingTracks.push({ trackName, albumName, artistName });
                } else {
                    const newTrack = await addCustomTrack(
                        trackName,
                        albumName,
                        [artistName],
                        "name"
                    );
                    addedTracks.push({ trackName, albumName, artistName });
                    existingUserLikedSongs.likedSongsList.push(newTrack._id);
                }
            }
            // Save database
            await existingUserLikedSongs.save();
        }

        res.status(201).json({
            message: `Added non-duplicate songs successfully, to liked songs of user: ${username}`,
            success: true,
            existingTracks: existingTracks,
            addedTracks: addedTracks,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};
