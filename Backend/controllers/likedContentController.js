const LikedContent = require("../models/likedContentModel");
const Track = require("../models/trackModel");
const Album = require("../models/albumModel");
const Artist = require("../models/artistModel");
const { getAlbumWithSpotifyID } = require("../operations/addAlbum");
const { addCustomTrack } = require("./tracksController");
const { exactSearchFromSpotify } = require("./spotifyApiController");

module.exports.createLikedContent = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const existingLikedContent = await LikedContent.findOne({ username });

        if (existingLikedContent) {
            return res.json({
                message: "Liked songs for this user already exists",
                success: false,
            });
        }

        const likedContent = await LikedContent.create({
            username: username,
            likedTracks: [],
            likedAlbums: [],
            likedArtists: [],
        });

        res.status(201).json({
            message: "Liked Content is created successfully",
            success: true,
            likedContent,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Create Liked Content Failed!" });
    }
};

// In order for a user to get their liked content
/*
    params: {
        contentType: "TRACK", "ALBUM" or "ARTIST"
    }
*/
module.exports.getLikedContent = async (req, res) => {
    try {
        const user = req.user;
        const { username } = user;
        const { contentType } = req.params;
        const existingLikedContent = await LikedContent.findOne({ username });

        // If user does not have liked songs, throw an error
        if (!existingLikedContent) {
            res.status(500).json({
                message:
                    "Liked content does not exist for the specified username!",
                success: false,
            });
        }

        // Populate necessary information
        let populatedLikedContent;
        if (contentType === "TRACK") {
            populatedLikedContent = await (
                await (
                    await existingLikedContent.populate("likedTracks.track")
                ).populate("likedTracks.track.artists", "name")
            ).populate("likedTracks.track.album", ["name", "imageURL"]);
            populatedLikedContent = populatedLikedContent.likedTracks;
        } else if (contentType === "ALBUM") {
            populatedLikedContent = await (
                await existingLikedContent.populate("likedAlbums.album")
            ).populate("likedAlbums.album.artists", "name");
            populatedLikedContent = populatedLikedContent.likedAlbums;
        } else if (contentType === "ARTIST") {
            populatedLikedContent = await existingLikedContent.populate(
                "likedArtists.artist"
            );
            populatedLikedContent = populatedLikedContent.likedTracks;
        } else {
            res.json({
                message:
                    "Invalid content type, can only be TRACK or ALBUM or ARTIST",
                success: false,
            });
        }
        res.status(201).json({
            message: "Retrieved liked content successfully",
            success: true,
            likedContent: populatedLikedContent,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Get Liked Content Failed!",
            success: false,
        });
    }
};

// In order for a user to add new content to their likedContent
/*
    body: {
        contentType: "TRACK" or "ALBUM" or "ARTIST"
        contentID: ObjectID
    }
*/
module.exports.likeContent = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const { contentType, contentID } = req.body;

        let existingLikedContent = await LikedContent.findOne({ username });

        // If liked songs list is not initialized for user, throw error
        if (!existingLikedContent) {
            return res.json({
                message: "Liked Content for this user does not exist!",
                success: false,
            });
        }

        // If user already liked the content with contentID, throw error
        let duplicate;
        let validContent;
        if (contentType === "TRACK") {
            duplicate = existingLikedContent.likedTracks.find(
                (existingTrack) => contentID === String(existingTrack.track)
            );
            validContent = Track.findById(contentID);
        } else if (contentType === "ALBUM") {
            duplicate = existingLikedContent.likedAlbums.find(
                (existingTrack) => contentID === String(existingTrack.album)
            );
            validContent = Album.findById(contentID);
        } else if (contentType === "ARTIST") {
            duplicate = existingLikedContent.likedArtists.find(
                (existingTrack) => contentID === String(existingTrack.artist)
            );
            validContent = Artist.findById(contentID);
        } else {
            return res.json({
                message:
                    "Invalid content type: Valid types: TRACK, ALBUM, ARTIST",
                success: false,
            });
        }

        if (duplicate) {
            return res.json({
                message: "User has already liked this content!",
                success: false,
            });
        }
        if (!validContent) {
            return res.json({
                message: "Content does not exist in database!",
                success: false,
            });
        }

        // If there are no errors, add  to the relevant list of the user
        if (contentType === "TRACK") {
            existingLikedContent.likedTracks.push({
                track: contentID,
                likedAt: new Date(),
            });
        } else if (contentType === "ALBUM") {
            existingLikedContent.likedAlbums.push({
                album: contentID,
                likedAt: new Date(),
            });
        } else if (contentType === "ARTIST") {
            existingLikedContent.likedArtists.push({
                artist: contentID,
                likedAt: new Date(),
            });
        }

        await existingLikedContent.save();

        res.status(201).json({
            message: `Added contentID: ${contentID}, to liked contents of user: ${username}`,
            contentType,
            success: true,
            existingLikedContent,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Like Content Failed!", success: false });
    }
};

// In order to remove content from user's LikedContent
/*
    body: {
        contentID: "ObjectID",
        contentType: "TRACK", "ALBUM" or "ARTIST"
    }
*/
module.exports.removeFromLikedContent = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get songID from request body
        const { contentID, contentType } = req.body;
        let existingLikedContent = await LikedContent.findOne({ username });

        // If liked songs list is not initialized for user, throw error
        if (!existingLikedContent) {
            return res.json({
                message: "Liked Content for this user does not exist!",
                success: false,
            });
        }

        let updatedLikedContent;
        if (contentType === "TRACK") {
            updatedLikedContent = await LikedContent.findOneAndUpdate(
                { username: username },
                { $pull: { likedTracks: { track: contentID } } },
                { new: true }
            );
        } else if (contentType === "ALBUM") {
            updatedLikedContent = await LikedContent.findOneAndUpdate(
                { username: username },
                { $pull: { likedAlbums: { album: contentID } } },
                { new: true }
            );
        } else if (contentType === "ARTIST") {
            updatedLikedContent = await LikedContent.findOneAndUpdate(
                { username: username },
                { $pull: { likedArtists: { artist: contentID } } },
                { new: true }
            );
        } else {
            res.status(500).json({
                message: "Invalid content type!",
                success: false,
            });
        }

        res.status(200).json({
            message: "Content is removed from liked content successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Remove From Liked Content Failed!",
            success: false,
        });
    }
};

// Adds a track to liked tracks by track spotify id and album spotify id
module.exports.likeTrackBySpotifyID = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get songID from request body
        const { spotifyID, albumSpotifyID } = req.body;
        let existingLikedContent = await LikedContent.findOne({ username });

        // If liked songs list is not initialized for user, throw error
        if (!existingLikedContent) {
            return res.json({
                message: "Liked content does not exist for this user!",
                success: false,
            });
        }

        // If user already liked the song with songID, throw error
        const duplicate = (
            await existingLikedContent.populate("likedTracks.track")
        ).likedTracks.find(
            (existingTrack) =>
                spotifyID === String(existingTrack.track.spotifyID)
        );

        if (duplicate) {
            return res.json({
                message: "Track already exists in liked content of user!",
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

        existingLikedContent.likedTracks.push({
            track: existingTrackID,
            likedAt: new Date(),
        });
        await existingLikedContent.save();

        res.status(201).json({
            message: `Added track with spotify ID: ${spotifyID}, to liked content of user: ${username}`,
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
    artists: [String]
}
*/
module.exports.likeCustomTrack = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get necessary variables from request body
        const { trackName, albumName, artists } = req.body;
        let existingLikedContent = await LikedContent.findOne({ username });

        // If liked songs list is not initialized for user, throw error
        if (!existingLikedContent) {
            return res.json({
                message: "Liked content does not exist!",
                success: false,
            });
        }

        // If there are no errors, add track to user's liked songs list
        const newTrackId = await addCustomTrack(trackName, albumName, artists);
        if (!newTrackId) {
            return res.json({
                message: "Cannot add custom track to user's liked tracks!",
                success: false,
            });
        }

        existingLikedContent.likedTracks.push({
            track: newTrackId,
            likedAt: new Date(),
        });
        await existingLikedContent.save();

        res.status(201).json({
            message: `Added custom song to liked songs of user: ${username}`,
            success: true,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Like Custom Track Failed!", success: false });
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

module.exports.addManyToLikedTracks = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get trackList from request body
        const { trackList } = req.body;
        let existingLikedContent = await LikedContent.findOne({ username });

        // If liked songs list is not initialized for user, throw error
        if (!existingLikedContent) {
            return res.json({
                message: "Liked content for this user does not exist!",
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
                    await existingLikedContent.populate("likedTracks.track")
                ).likedTracks.find(
                    (existingTrack) =>
                        existingTrack.track.spotifyID === newTrackSpotifyID
                );

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

                    existingLikedContent.likedTracks.push({
                        track: existingTrack._id,
                        likedAt: new Date(),
                    });
                    addedTracks.push({ trackName, albumName, artistName });
                }
            }

            // Else add track to database as a custom song
            else {
                const duplicate = (
                    await (
                        await existingLikedContent.populate("likedTracks.track")
                    ).populate("likedTracks.track.album")
                ).likedTracks.find((existingTrack) => {
                    return (
                        existingTrack.track.name === trackName &&
                        existingTrack.track.album.name === albumName
                    );
                });
                if (duplicate) {
                    existingTracks.push({ trackName, albumName, artistName });
                } else {
                    const newTrack = await addCustomTrack(
                        trackName,
                        albumName,
                        [artistName]
                    );
                    addedTracks.push({ trackName, albumName, artistName });
                    existingLikedContent.likedTracks.push({
                        track: newTrack._id,
                        likedAt: new Date(),
                    });
                }
            }
            // Save database
            await existingLikedContent.save();
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
