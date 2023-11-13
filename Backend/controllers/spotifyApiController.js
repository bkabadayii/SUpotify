const axios = require("axios");

module.exports.getTrackFromSpotify = async (req, res) => {
    try {
        const { songID } = req.body;
        if (!songID) {
            return res.status(400).json({ message: 'Bad Request', success: false, error: 'Missing songID in the request body' });
        }

        // Get Spotify access token from environment variables
        const spotifyToken = process.env.SPOTIFY_TOKEN;

        // Send request to Spotify API to get information about the track
        const spotifyResponse = await axios.get(`https://api.spotify.com/v1/tracks/${songID}`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        });

        // Extract data from the Spotify API response
        const spotifyResult = spotifyResponse.data;

        // Send request to Spotify API to get information about the album
        const spotifyAlbumResponse = await axios.get(`https://api.spotify.com/v1/albums/${spotifyResult.album.id}`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        });

        // Extract data from the Spotify API response for the album
        const spotifyAlbumResult = spotifyAlbumResponse.data;

        // Fetch detailed artist information for each artist
        const artistPromises = spotifyResult.artists.map(async artist => {
            try {
                const artistInfoResponse = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}`, {
                    headers: {
                        Authorization: `Bearer ${spotifyToken}`,
                    },
                });
                return artistInfoResponse.data;
            } catch (artistError) {
                console.error('Error fetching artist information:', artistError.message);
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
                artists: detailedArtistInfo.map(artist => ({
                    artistName: artist.name,
                    artistID: artist.id,
                    artistGenres: artist.genres.map(genre => genre),
                })),
            },
            otherInfo: {
                durationMS: spotifyResult.duration_ms,
                popularity: spotifyResult.popularity,
                previewURL: spotifyResult.preview_url,
                songName: spotifyResult.name,
                genres: spotifyAlbumResult.genres.map(genre => genre),
                trackURL: spotifyResult.external_urls.spotify,
            },
        };

        // Log the organized information to the console
        console.log(returnInfo);

        // Respond with a success message and the organized information
        res.status(201).json({
            message: "Retrieved song info successfully",
            success: true,
            songInfo: returnInfo,
        });
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);

        // Respond with an error message and a 500 Internal Server Error status
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: err.message, // Include the error message in the response
        });
    }
};


module.exports.getAlbumFromSpotify = async (req, res) => {
    try {
        const { albumID } = req.body;
    if (!albumID) {
        return res.status(400).json({ message: 'Bad Request', success: false, error: 'Missing albumID in the request body' });
    }


        // Get Spotify access token from environment variables
        const spotifyToken = process.env.SPOTIFY_TOKEN;

        // Send request to Spotify API to get information about the album
        const spotifyResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumID}`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        });

        // Extract data from the Spotify API response
        const spotifyResult = spotifyResponse.data;

        // Organize the information into a structured format
        const returnInfo = {
            albumName: spotifyResult.name,
            albumId: spotifyResult.id,
            albumImage: spotifyResult.images[0].url,
            albumTotalTracks: spotifyResult.total_tracks,
            albumURL: spotifyResult.external_urls.spotify,
            albumReleaseDate: spotifyResult.release_date,
            albumGenres: spotifyResult.genres.map(genre=>genre),
            trackIds: spotifyResult.tracks.items.map(track=>track.id),
            albumArtists: spotifyResult.artists.map(artist=>({
                artistName: artist.name,
                artistId: artist.id}))
        };

        // Log the organized information to the console
        console.log(returnInfo);

        // Respond with a success message and the organized information
        res.status(201).json({
            message: "Retrieved album info successfully",
            success: true,
            albumInfo: returnInfo,
        });
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);

        // Respond with an error message and a 500 Internal Server Error status
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: err.message, // Include the error message in the response
        });
    }
};

module.exports.getArtistFromSpotify = async (req, res) => {
    try {
        const { artistID } = req.body;
    if (!artistID) {
        return res.status(400).json({ message: 'Bad Request', success: false, error: 'Missing artistID in the request body' });
    }


        // Get Spotify access token from environment variables
        const spotifyToken = process.env.SPOTIFY_TOKEN;

        // Send request to Spotify API to get information about the artist
        const spotifyResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistID}`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        });

        // Extract data from the Spotify API response
        const spotifyResult = spotifyResponse.data;

        // Organize the information into a structured format
        const returnInfo = {
            artistName: spotifyResult.name,
            artistId: spotifyResult.id,
            artistImage: spotifyResult.images[0].url,
            artistURL: spotifyResult.external_urls.spotify,
            artistGenres: spotifyResult.genres.map(genre=>genre),
            artistPopularity: spotifyResult.popularity,
        };

        // Log the organized information to the console
        console.log(returnInfo);

        // Respond with a success message and the organized information
        res.status(201).json({
            message: "Retrieved artist info successfully",
            success: true,
            artistInfo: returnInfo,
        });
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);

        // Respond with an error message and a 500 Internal Server Error status
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: err.message, // Include the error message in the response
        });
    }
};
