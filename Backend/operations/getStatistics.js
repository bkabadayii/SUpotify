/* TODO

4) Top average rating by genre - artist
TODO */

const Rating = require("../models/ratingModel");
const UserToRatings = require("../models/userToRatings");

const compareRating = (a, b) => {
    if (a.rating > b.rating) {
        return -1;
    }
    if (a.rating < b.rating) {
        return 1;
    }
    return 0;
};

const filterRating = (rating, filters) => {
    const {
        rateDate,
        trackReleaseDate,
        albumReleaseDate,
        trackGenres,
        albumGenres,
        artistGenres,
        trackArtists,
        albumArtists,
    } = filters;
    // If rateDate is specified, apply filter
    if (rateDate) {
        const startDate = new Date(rateDate[0]);
        const endDate = new Date(rateDate[1]);
        if (rating.ratedAt > endDate || rating.ratedAt < startDate) {
            return false;
        }
    }
    // If trackReleaseDate is specified, apply filter
    if (trackReleaseDate) {
        const startDate = new Date(trackReleaseDate[0]);
        const endDate = new Date(trackReleaseDate[1]);
        if (
            rating.track.album.releaseDate > endDate ||
            rating.track.album.releaseDate < startDate
        ) {
            return false;
        }
    }
    if (albumReleaseDate) {
        const startDate = new Date(albumReleaseDate[0]);
        const endDate = new Date(albumReleaseDate[1]);
        if (
            rating.album.releaseDate > endDate ||
            rating.album.releaseDate < startDate
        ) {
            return false;
        }
    }
    if (trackGenres) {
        const genres = rating.track.artists[0].genres;
        let genreMatch;
        for (const genre of genres) {
            genreMatch = trackGenres.find((filterGenre) => {
                return genre === filterGenre;
            });
            if (genreMatch) {
                break;
            }
        }
        if (!genreMatch) {
            return false;
        }
    }
    if (albumGenres) {
        const genres = rating.album.artists[0].genres;
        let genreMatch;
        for (const genre of genres) {
            genreMatch = albumGenres.find((filterGenre) => {
                return genre === filterGenre;
            });
            if (genreMatch) {
                break;
            }
        }
        if (!genreMatch) {
            return false;
        }
    }
    if (artistGenres) {
        const genres = rating.artist.genres;
        let genreMatch;
        for (const genre of genres) {
            genreMatch = artistGenres.find((filterGenre) => {
                return genre === filterGenre;
            });
            if (genreMatch) {
                break;
            }
        }
        if (!genreMatch) {
            return false;
        }
    }
    if (trackArtists) {
        const artists = rating.track.artists;
        let artistMatch;
        for (const artist of artists) {
            artistMatch = trackArtists.find((filterArtist) => {
                return String(artist._id) === filterArtist;
            });
            if (artistMatch) {
                break;
            }
        }
        if (!artistMatch) {
            return false;
        }
    }
    if (albumArtists) {
        const artists = rating.album.artists;
        let artistMatch;
        for (const artist of artists) {
            artistMatch = albumArtists.find((filterArtist) => {
                return String(artist._id) === filterArtist;
            });
            if (artistMatch) {
                break;
            }
        }
        if (!artistMatch) {
            return false;
        }
    }
    return true;
};
/*
Get top rated tracks
    * Filter by rate date
    * Filter by track release date
    * Filter by genre
    * Filter by artist
    * Number of items: (5, 20)  
    
    - Returned Display Options -
    * All tracks list
    * Genre statistics
    * Artist statistics
    * Track era statistics, ex: 2000-2010

    body: {
        filters: {
            rateDate: [Date, Date] -> Range
            releaseDate: [Date, Date] -> Range
            genres: [String],
            artists: [ObjectID]
        }
        numItems: Number 
    }

    returns: {
        trackRatings: [{Track, Rating}]
        genreToRating : [{
            genre: String,
            numTracks: Number
            avgRating: Number
        }]
        artistToRating: [{
            artist: Artist,
            numTracks: number
            avgRating: Number
        }]
        eraToRating: [{
            era: String,
            numTracks: number
            avgRating
        }]
    }
*/

module.exports.getTopRatedTracks = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get filters and numItems
        const { filters, numItems } = req.body;

        const userToRatings = UserToRatings.findOne({ username });
        // Populate necessary fields
        const populatedRatings = await userToRatings
            .populate("trackRatings.track")
            .then((userToRatings) =>
                userToRatings.populate("trackRatings.track.artists", [
                    "name",
                    "genres",
                    "popularity",
                    "spotifyURL",
                    "imageURL",
                ])
            )
            .then((userToRatings) =>
                userToRatings.populate("trackRatings.track.album", [
                    "name",
                    "releaseDate",
                    "imageURL",
                ])
            );

        // Filter tracks
        let filteredRatings = populatedRatings.trackRatings.filter((rating) => {
            return filterRating(rating, {
                rateDate: filters.rateDate,
                trackReleaseDate: filters.releaseDate,
                trackGenres:
                    filters.genres.length !== 0 ? filters.genres : null,
                trackArtists:
                    filters.artists.length !== 0 ? filters.artists : null,
            });
        });

        // Sort by rating and slice
        filteredRatings = filteredRatings.sort(compareRating);

        // Calculate genreToRatings
        let genreToRating = {};
        let artistToRating = {};
        let eraToRating = {};

        for (let rating of filteredRatings) {
            // Calculate genreToRatings
            let genres = rating.track.artists[0].genres;
            for (let genre of genres) {
                if (!genreToRating[genre]) {
                    genreToRating[genre] = { numTracks: 0, ratingSum: 0 };
                }
                genreToRating[genre].numTracks += 1;
                genreToRating[genre].ratingSum += rating.rating;
            }

            // Calculate artistToRating
            let artists = rating.track.artists;
            for (let artist of artists) {
                if (!artistToRating[artist._id]) {
                    artistToRating[artist._id] = {
                        artistName: artist.name,
                        artistImage: artist.imageURL,
                        numTracks: 0,
                        ratingSum: 0,
                    };
                }
                artistToRating[artist._id].numTracks += 1;
                artistToRating[artist._id].ratingSum += rating.rating;
            }

            // Calculate eraToRating
            const releaseYear = rating.track.album.releaseDate.getFullYear();
            const releaseEra = releaseYear - (releaseYear % 10);
            if (!eraToRating[releaseEra]) {
                eraToRating[releaseEra] = { numTracks: 0, ratingSum: 0 };
            }
            eraToRating[releaseEra].numTracks += 1;
            eraToRating[releaseEra].ratingSum += rating.rating;
        }

        // Calculate genre average ratings
        for (const [key, value] of Object.entries(genreToRating)) {
            genreToRating[key].avgRating = (
                value.ratingSum / value.numTracks
            ).toFixed(2);
            delete genreToRating[key].ratingSum;
        }
        // Calculate artist average ratings
        for (const [key, value] of Object.entries(artistToRating)) {
            artistToRating[key].avgRating = (
                value.ratingSum / value.numTracks
            ).toFixed(2);
            delete artistToRating[key].ratingSum;
        }
        // Calculate era average ratings
        for (const [key, value] of Object.entries(eraToRating)) {
            eraToRating[key].avgRating = (
                value.ratingSum / value.numTracks
            ).toFixed(2);
            delete eraToRating[key].ratingSum;
        }

        return res.status(201).json({
            message: "Returned top rated tracks sucessfully",
            success: true,
            trackRatings: filteredRatings.slice(0, numItems),
            genreToRating,
            artistToRating,
            eraToRating,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Get Top Rated Tracks Failed!" });
    }
};

/*
Get top rated albums
    * Filter by rate date
    * Filter by album release date
    * Filter by genre
    * Filter by artist
    * Number of items: (5, 20)  
    
    - Returned Display Options -
    * All albums list
    * Genre statistics
    * Artist statistics
    * Track era statistics, ex: 2000-2010

    body: {
        filters: {
            rateDate: [Date, Date] -> Range
            releaseDate: [Date, Date] -> Range
            genres: [String],
            artists: [ObjectID]
        }
        numItems: Number 
    }

    returns: {
        albumRatings: [{Album, Rating}]
        genreToRating : [{
            genre: String,
            numAlbums: Number
            avgRating: Number
        }]
        artistToRating: [{
            artist: Artist,
            numAlbums: number
            avgRating: Number
        }]
        eraToRating: [{
            era: String,
            numAlbums: number
            avgRating
        }]
    }
*/
module.exports.getTopRatedAlbums = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get filters and numItems
        const { filters, numItems } = req.body;

        const userToRatings = UserToRatings.findOne({ username });
        // Populate necessary fields
        const populatedRatings = await userToRatings
            .populate("albumRatings.album")
            .then((userToRatings) =>
                userToRatings.populate("albumRatings.album.artists", [
                    "name",
                    "genres",
                    "popularity",
                    "spotifyURL",
                    "imageURL",
                ])
            );

        // Filter tracks
        let filteredRatings = populatedRatings.albumRatings.filter((rating) => {
            return filterRating(rating, {
                rateDate: filters.rateDate,
                albumReleaseDate: filters.releaseDate,
                albumGenres:
                    filters.genres.length !== 0 ? filters.genres : null,
                trackArtists:
                    filters.artists.length !== 0 ? filters.artists : null,
            });
        });

        // Sort by rating
        filteredRatings = filteredRatings.sort(compareRating);

        // Calculate genre, artist and era statistics
        let genreToRating = {};
        let artistToRating = {};
        let eraToRating = {};

        for (let rating of filteredRatings) {
            // Calculate genreToRatings
            let genres = rating.album.artists[0].genres;
            for (let genre of genres) {
                if (!genreToRating[genre]) {
                    genreToRating[genre] = { numAlbums: 0, ratingSum: 0 };
                }
                genreToRating[genre].numAlbums += 1;
                genreToRating[genre].ratingSum += rating.rating;
            }

            // Calculate artistToRating
            let artists = rating.album.artists;
            for (let artist of artists) {
                if (!artistToRating[artist._id]) {
                    artistToRating[artist._id] = {
                        artistName: artist.name,
                        artistImage: artist.imageURL,
                        numAlbums: 0,
                        ratingSum: 0,
                    };
                }
                artistToRating[artist._id].numAlbums += 1;
                artistToRating[artist._id].ratingSum += rating.rating;
            }

            // Calculate eraToRating
            const releaseYear = rating.album.releaseDate.getFullYear();
            const releaseEra = releaseYear - (releaseYear % 10);
            if (!eraToRating[releaseEra]) {
                eraToRating[releaseEra] = { numAlbums: 0, ratingSum: 0 };
            }
            eraToRating[releaseEra].numAlbums += 1;
            eraToRating[releaseEra].ratingSum += rating.rating;
        }

        // Calculate genre average ratings
        for (const [key, value] of Object.entries(genreToRating)) {
            genreToRating[key].avgRating = (
                value.ratingSum / value.numAlbums
            ).toFixed(2);
            delete genreToRating[key].ratingSum;
        }
        // Calculate artist average ratings
        for (const [key, value] of Object.entries(artistToRating)) {
            artistToRating[key].avgRating = (
                value.ratingSum / value.numAlbums
            ).toFixed(2);
            delete artistToRating[key].ratingSum;
        }
        // Calculate era average ratings
        for (const [key, value] of Object.entries(eraToRating)) {
            eraToRating[key].avgRating = (
                value.ratingSum / value.numAlbums
            ).toFixed(2);
            delete eraToRating[key].ratingSum;
        }

        return res.status(201).json({
            message: "Returned top rated albums sucessfully",
            success: true,
            albumRatings: filteredRatings.slice(0, numItems),
            genreToRating,
            artistToRating,
            eraToRating,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Get Top Rated Albums Failed!" });
    }
};

/*
3) Get top rated artists
    * Filter by rate date
    * Filter by genre
    * Number of items: (5, 20)  
    
    - Display Options -
    * All artists list
    * Genre count
    body: {
            filters: {
                rateDate: [Date, Date] -> Range
                genres: [String],
            }
            numItems: Number 
        }

    returns: {
        artistRatings: [{Artist, Rating}]
        genreToRating : [{
            genre: String,
            numArtists: Number
            avgRating: Number
        }]
    }
*/
module.exports.getTopRatedArtists = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get filters and numItems
        const { filters, numItems } = req.body;

        const userToRatings = UserToRatings.findOne({ username });
        // Populate necessary fields
        const populatedRatings = await userToRatings.populate(
            "artistRatings.artist",
            ["name", "genres", "popularity", "spotifyURL", "imageURL"]
        );

        // Filter artists
        let filteredRatings = populatedRatings.artistRatings.filter(
            (rating) => {
                return filterRating(rating, {
                    rateDate: filters.rateDate,
                    artistGenres:
                        filters.genres.length !== 0 ? filters.genres : null,
                });
            }
        );

        // Sort by rating
        filteredRatings = filteredRatings.sort(compareRating);

        // Calculate genre statistics
        let genreToRating = {};

        for (let rating of filteredRatings) {
            // Calculate genreToRatings
            let genres = rating.artist.genres;
            for (let genre of genres) {
                if (!genreToRating[genre]) {
                    genreToRating[genre] = { numArtists: 0, ratingSum: 0 };
                }
                genreToRating[genre].numArtists += 1;
                genreToRating[genre].ratingSum += rating.rating;
            }
        }

        // Calculate genre average ratings
        for (const [key, value] of Object.entries(genreToRating)) {
            genreToRating[key].avgRating = (
                value.ratingSum / value.numArtists
            ).toFixed(2);
            delete genreToRating[key].ratingSum;
        }

        return res.status(201).json({
            message: "Returned top rated artists sucessfully",
            success: true,
            artistRatings: filteredRatings.slice(0, numItems),
            genreToRating,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Get Top Rated Artists Failed!" });
    }
};
