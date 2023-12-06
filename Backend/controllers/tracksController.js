const Track = require("../models/trackModel");
const Album = require("../models/albumModel");
const Artist = require("../models/artistModel");

// Cannot be directlly used as an endpoint
// This can be used via [Add custom track to liked songs, Add many to liked songs (file import)]
// Adds a custom track and its album and its artist (if it does not already exist) to the database
module.exports.addCustomTrack = async (trackName, albumName, artists) => {
    try {
        // Add the artists first
        let artistIDs = [];

        for (const artistName of artists) {
            const newArtist = await Artist.create({
                name: artistName,
                genres: [],
                popularity: 1,
                albums: [],
                spotifyID: "-",
                spotifyURL: "-",
                imageURL: "-",
            });
            artistIDs.push(newArtist._id);
        }

        // Add the album
        const newAlbum = await Album.create({
            name: albumName,
            releaseDate: new Date(),
            totalTracks: 1,
            genres: [],
            artists: artistIDs,
            tracks: [],
            spotifyID: "-",
            spotifyURL: "-",
            imageURL: "-",
        });

        // Add the track
        const newTrack = await Track.create({
            name: trackName,
            popularity: 1,
            durationMS: 0,
            album: newAlbum._id,
            artists: artistIDs,
            spotifyID: "-",
            spotifyURL: "-",
            imageURL: "-",
        });

        // Add track to the album tracks
        newAlbum.tracks.push(newTrack._id);
        await newAlbum.save();

        // Add album to artist albums
        for (const artistID of artistIDs) {
            const currentArtist = await Artist.findById(artistID);
            currentArtist.albums.push(newAlbum._id);
            await currentArtist.save();
        }

        return newTrack._id;
    } catch (error) {
        console.log("Error in Add Custom Track!");
        console.log(error);
        return null;
    }
};
