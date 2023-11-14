const axios = require("axios");

// Unnecessary information must be removed
module.exports.getTrackFromSpotify = async (spotifyID) => {
    try {
        // Get Spotify access token from environment variables
        const spotifyToken = process.env.SPOTIFY_TOKEN;

        // Send request to Spotify API to get information about the track
        const spotifyResponse = await axios.get(
            `https://api.spotify.com/v1/tracks/${spotifyID}`,
            {
                headers: {
                    Authorization: `Bearer ${spotifyToken}`,
                },
            }
        );

        // Extract data from the Spotify API response
        const spotifyResult = spotifyResponse.data;

        // Send request to Spotify API to get information about the album
        const spotifyAlbumResponse = await axios.get(
            `https://api.spotify.com/v1/albums/${spotifyResult.album.id}`,
            {
                headers: {
                    Authorization: `Bearer ${spotifyToken}`,
                },
            }
        );

        // Extract data from the Spotify API response for the album
        const spotifyAlbumResult = spotifyAlbumResponse.data;

        // Fetch detailed artist information for each artist
        const artistPromises = spotifyResult.artists.map(async (artist) => {
            try {
                const artistInfoResponse = await axios.get(
                    `https://api.spotify.com/v1/artists/${artist.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyToken}`,
                        },
                    }
                );
                return artistInfoResponse.data;
            } catch (artistError) {
                console.error(
                    "Error fetching artist information:",
                    artistError.message
                );
                throw artistError;
            }
        });

        // Wait for all artist information requests to complete
        const detailedArtistInfo = await Promise.all(artistPromises);

        // Organize the information into a structured format
        const returnInfo = {
            albumInfo: {
                albumID: spotifyResult.album.id,
                albumName: spotifyResult.album.name,
                albumReleaseDate: spotifyResult.album.release_date,
                albumURL: spotifyAlbumResult.external_urls.spotify,
                albumImage: spotifyAlbumResult.images[0].url,
            },
            artistInfo: {
                artistNumber: spotifyResult.artists.length,
                artists: detailedArtistInfo.map((artist) => ({
                    artistName: artist.name,
                    artistID: artist.id,
                    artistGenres: artist.genres.map((genre) => genre),
                })),
            },
            otherInfo: {
                durationMS: spotifyResult.duration_ms,
                popularity: spotifyResult.popularity,
                previewURL: spotifyResult.preview_url,
                name: spotifyResult.name,
                genres: spotifyAlbumResult.genres.map((genre) => genre),
                spotifyURL: spotifyResult.external_urls.spotify,
            },
        };

        // Respond with a success message and return the organized information
        return returnInfo;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        return null;
    }
};

module.exports.getAlbumFromSpotify = async (spotifyID) => {
    try {
        // Get Spotify access token from environment variables
        const spotifyToken = process.env.SPOTIFY_TOKEN;

        // Send request to Spotify API to get information about the album
        const spotifyResponse = await axios.get(
            `https://api.spotify.com/v1/albums/${spotifyID}`,
            {
                headers: {
                    Authorization: `Bearer ${spotifyToken}`,
                },
            }
        );

        // Extract data from the Spotify API response
        const spotifyResult = spotifyResponse.data;

        // Organize the information into a structured format
        const returnInfo = {
            name: spotifyResult.name,
            releaseDate: spotifyResult.release_date,
            totalTracks: spotifyResult.total_tracks,
            genres: spotifyResult.genres.map((genre) => genre),
            spotifyID: spotifyResult.id,
            spotifyURL: spotifyResult.external_urls.spotify,
            imageURL: spotifyResult.images[0].url,
            trackIDs: spotifyResult.tracks.items.map((track) => track.id),
            albumArtists: spotifyResult.artists.map((artist) => ({
                artistName: artist.name,
                artistID: artist.id,
            })),
        };

        return returnInfo;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        return null;
    }
};

module.exports.getArtistFromSpotify = async (spotifyID) => {
    try {
        // Get Spotify access token from environment variables
        const spotifyToken = process.env.SPOTIFY_TOKEN;

        // Send request to Spotify API to get information about the artist
        const spotifyResponse = await axios.get(
            `https://api.spotify.com/v1/artists/${spotifyID}`,
            {
                headers: {
                    Authorization: `Bearer ${spotifyToken}`,
                },
            }
        );

        // Extract data from the Spotify API response
        const spotifyResult = spotifyResponse.data;

        // Organize the information into a structured format
        const returnInfo = {
            name: spotifyResult.name,
            genres: spotifyResult.genres.map((genre) => genre),
            popularity: spotifyResult.popularity,
            spotifyID: spotifyResult.id,
            spotifyURL: spotifyResult.external_urls.spotify,
            imageURL: spotifyResult.images[0].url,
        };

        // Respond with a success message and the organized information
        console.log("getArtistFromSpotify...");
        console.log(returnInfo);
        return returnInfo;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        return null;
    }
};
