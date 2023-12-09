const Artist = require("../models/artistModel");
const Track = require("../models/trackModel");
const Album = require("../models/albumModel");

// Returns track information by its id
/*
    params: {
        trackID: ObjectID
    }
*/
module.exports.getTrack = async (req, res) => {
    try {
        const { trackID } = req.params;x

        // Throw error if the track does not exist in database
        const existingTrack = await Track.findById(trackID);
        if (!existingTrack) {
            return res.status(404).json({
                message: "Track not found!",
                success: false,
            });
        }

        const populatedTrack = await existingTrack
            .populate("artists", [
                "name",
                "popularity",
                "imageURL",
                "spotifyURL",
            ])
            .then((track) => {
                return track.populate("album", [
                    "name",
                    "popularity",
                    "imageURL",
                    "spotifyURL",
                ]);
            });
        return res.status(201).json({
            message: "Track returned successfully",
            success: true,
            track: existingTrack,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Get Track Failed!", success: false });
    }
};

// Returns album information by its id
/*
    params: {
        albumID: ObjectID
    }
*/
module.exports.getAlbum = async (req, res) => {
    try {
        const { albumID } = req.params;

        // Throw error if the album does not exist in database
        const existingAlbum = await Album.findById(albumID);
        if (!existingAlbum) {
            return res.status(404).json({
                message: "Album not found!",
                success: false,
            });
        }

        const populatedAlbum = await existingAlbum
            .populate("artists", [
                "name",
                "popularity",
                "imageURL",
                "spotifyURL",
            ])
            .then((album) => {
                return album.populate("tracks", [
                    "name",
                    "popularity",
                    "durationMS",
                    "artists",
                ]);
            })
            .then((album) => {
                return album.populate("tracks.artists", [
                    "name",
                    "popularity",
                    "imageURL",
                    "spotifyURL",
                ]);
            });
        return res.status(201).json({
            message: "Album returned successfully",
            success: true,
            album: populatedAlbum,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Get Album Failed!", success: false });
    }
};

// Returns artist information by its id
/*
    params: {
        artistID: ObjectID
    }
*/
module.exports.getArtist = async (req, res) => {
    try {
        const { artistID } = req.params;

        // Throw error if the album does not exist in database
        const existingArtist = await Artist.findById(artistID);
        if (!existingArtist) {
            return res.status(404).json({
                message: "Artist not found!",
                success: false,
            });
        }

        const populatedArtist = await existingArtist
            .populate("albums", [
                "name",
                "artists",
                "popularity",
                "imageURL",
                "spotifyURL",
            ])
            .then((artist) => {
                return artist.populate("albums.artists", [
                    "name",
                    "popularity",
                    "imageURL",
                    "spotifyURL",
                ]);
            });

        return res.status(201).json({
            message: "Artist returned successfully",
            success: true,
            artist: populatedArtist,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Get Artist Failed!", success: false });
    }
};
