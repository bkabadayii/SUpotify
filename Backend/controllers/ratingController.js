const Track = require("../models/trackModel");
const Album = require("../models/albumModel");
const Artist = require("../models/artistModel");
const Rating = require("../models/ratingModel");
const UserToRatings = require("../models/userToRatings");
const { isFriend } = require("./followedUsersController");

module.exports.createUserToRatings = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const existingUserToRatings = await UserToRatings.findOne({
            username,
        });

        if (existingUserToRatings) {
            return res.json({
                message: "Ratings for this user already exists",
                success: false,
            });
        }

        const userToRatings = await UserToRatings.create({
            username,
            trackRatings: [],
            albumRatings: [],
            artistRatings: [],
        });

        res.status(201).json({
            message: "User to ratings is created successfully",
            success: true,
            userToRatings,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "User to Ratings Creation Failed!" });
    }
};

// Gets all ratings for a user
module.exports.getUserToRatings = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get userToRatings
        const existingUserToRatings = await UserToRatings.findOne({
            username,
        });

        if (!existingUserToRatings) {
            return res.json({
                message: "Ratings for this user does not exist",
                success: false,
            });
        }

        res.status(201).json({
            message: "Get user to ratings successful",
            success: true,
            existingUserToRatings,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Get User to Ratings Failed!" });
    }
};

// Adds a new rating for a given user, ratingType, and relatedID,
// If user already rated, updates their rating
// ratingType is "TRACK" or "ALBUM" or "ARTIST"
// relatedID is the id of the track / album / artist
/*
    body: {
        ratingType: String,
        relatedID: ObjectID,
        rating: Number
    }
*/
module.exports.rateContent = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const { ratingType, relatedID, rating } = req.body;

        // Check if rating value is valid
        if (rating < 0 || rating > 10) {
            return res.json({
                message: "Rating value must be in range [0, 10]",
                success: false,
            });
        }
        // Check if ID and ratingType is valid
        let existingEntry;
        if (ratingType === "TRACK") {
            existingEntry = await Track.findById(relatedID);
        } else if (ratingType === "ALBUM") {
            existingEntry = await Album.findById(relatedID);
        } else if (ratingType === "ARTIST") {
            existingEntry = await Artist.findById(relatedID);
        } else {
            return res.json({
                message: "Rating type must be TRACK or ALBUM or ARTIST",
                success: false,
            });
        }
        if (!existingEntry) {
            return res.json({
                message: `Cannot add new rating: ${ratingType} not found in database!`,
                success: false,
            });
        }
        // Get userToRatings
        const existingUserToRatings = await UserToRatings.findOne({
            username,
        });

        if (!existingUserToRatings) {
            return res.json({
                message: "Ratings for this user does not exist",
                success: false,
            });
        }

        // Get rating information for the track / album / artist
        let allRatings = await Rating.findOne({ ratingType, relatedID });
        // If it does not exist, initialize it
        if (!allRatings) {
            allRatings = await Rating.create({
                ratingType,
                relatedID,
                ratings: [],
            });
        }
        // Check if user already rated
        const userRating = allRatings.ratings.find(
            (rating) => rating.username === username
        );

        // If user already rated, update their rating
        let updatedUserToRatings;
        if (userRating) {
            // Update in user's ratings
            if (ratingType === "TRACK") {
                updatedUserToRatings = await UserToRatings.findOneAndUpdate(
                    { username: username, "trackRatings.track": relatedID },
                    {
                        $set: {
                            "trackRatings.$.rating": rating.toFixed(1),
                            "trackRatings.$.ratedAt": new Date(),
                        },
                    },
                    { new: true }
                );
            } else if (ratingType === "ALBUM") {
                updatedUserToRatings = await UserToRatings.findOneAndUpdate(
                    { username: username, "albumRatings.album": relatedID },
                    {
                        $set: {
                            "albumRatings.$.rating": rating.toFixed(1),
                            "albumRatings.$.ratedAt": new Date(),
                        },
                    },
                    { new: true }
                );
            } else if (ratingType === "ARTIST") {
                updatedUserToRatings = await UserToRatings.findOneAndUpdate(
                    { username: username, "artistRatings.artist": relatedID },
                    {
                        $set: {
                            "artistRatings.$.rating": rating.toFixed(1),
                            "artistRatings.$.ratedAt": new Date(),
                        },
                    },
                    { new: true }
                );
            }
            // Update in all ratings
            const updatedAllRatings = await Rating.findOneAndUpdate(
                { ratingType, relatedID, "ratings.username": username },
                {
                    $set: {
                        "ratings.$.rating": rating.toFixed(1),
                        "ratings.$.ratedAt": new Date(),
                    },
                },
                { new: true }
            );
        } else {
            // Else, add rating entry in UserToRatings model
            if (ratingType === "TRACK") {
                existingUserToRatings.trackRatings.push({
                    track: relatedID,
                    rating: rating.toFixed(1),
                    ratedAt: new Date(),
                });
            } else if (ratingType === "ALBUM") {
                existingUserToRatings.albumRatings.push({
                    album: relatedID,
                    rating: rating.toFixed(1),
                    ratedAt: new Date(),
                });
            } else if (ratingType === "ARTIST") {
                existingUserToRatings.artistRatings.push({
                    artist: relatedID,
                    rating: rating.toFixed(1),
                    ratedAt: new Date(),
                });
            }

            // Add rating entry in Rating model
            allRatings.ratings.push({
                username,
                rating: rating.toFixed(1),
                ratedAt: new Date(),
            });
            // Save database
            updatedUserToRatings = await existingUserToRatings.save();
            const updatedAllRatings = await allRatings.save();
        }
        res.status(201).json({
            message: "Added new rating successfully",
            success: true,
            updatedUserToRatings,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Add New Rating Failed!" });
    }
};

// Deletes a rating for a given user, ratingType, and relatedID,
// ratingType is "TRACK" or "ALBUM" or "ARTIST"
// relatedID is the id of the track / album / artist
/*
    params: {
        ratingType: String,
        relatedID: ObjectID,
    }
*/
module.exports.deleteRating = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const { ratingType, relatedID } = req.params;

        if (
            ratingType !== "TRACK" &&
            ratingType !== "ALBUM" &&
            ratingType !== "ARTIST"
        ) {
            return res.json({
                message: "Invalid Rating Type!",
                success: false,
            });
        }
        // Get userToRatings
        const existingUserToRatings = await UserToRatings.findOne({
            username,
        });

        if (!existingUserToRatings) {
            return res.json({
                message: "Ratings for this user does not exist",
                success: false,
            });
        }

        // Get rating information for the track / album / artist
        let allRatings = await Rating.findOne({ ratingType, relatedID });
        // If it does not exist throw error
        if (!allRatings) {
            return res.json({
                message: `Ratings does not exist for this ${ratingType}`,
                success: false,
            });
        }

        // Check if user already rated
        const userRating = allRatings.ratings.find(
            (rating) => rating.username === username
        );
        if (!userRating) {
            return res.json({
                message: "Cannot delete rating: user has not rated",
                success: false,
            });
        }
        // Remove from user's ratings
        let updatedUserToRatings;
        if (ratingType === "TRACK") {
            updatedUserToRatings = await UserToRatings.findOneAndUpdate(
                { username: username },
                { $pull: { trackRatings: { track: relatedID } } },
                { new: true }
            );
        } else if (ratingType === "ALBUM") {
            updatedUserToRatings = await UserToRatings.findOneAndUpdate(
                { username: username },
                { $pull: { albumRatings: { album: relatedID } } },
                { new: true }
            );
        } else if (ratingType === "ARTIST") {
            updatedUserToRatings = await UserToRatings.findOneAndUpdate(
                { username: username },
                { $pull: { artistRatings: { artist: relatedID } } },
                { new: true }
            );
        }
        // Remove from all ratings
        const updatedAllRatings = await Rating.findOneAndUpdate(
            { ratingType, relatedID },
            { $pull: { ratings: { username } } },
            { new: true }
        );

        res.status(201).json({
            message: "Deleted rating successfully",
            success: true,
            updatedUserToRatings,
            updatedAllRatings,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Delete Rating Failed!" });
    }
};

// In order for a user to get rating information of a track / album / artist
// ratingType is "TRACK" or "ALBUM" or "ARTIST"
// relatedID is the id of the track / album / artist
/*
    params: {
        ratingType: String,
        relatedID: ObjectID,
    }
    returns: {
        selfRating: Number,
        averageRating: Number,
        numUsersRated: Number
        numFriendsRated: Number,
        friendsAverageRating: Number (null if no friends rated)
        friendRatings: [{username: String, rating: Number, ratedAt: Date}]
    }
*/

module.exports.getRatingInfo = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const { ratingType, relatedID } = req.params;

        if (
            ratingType !== "TRACK" &&
            ratingType !== "ALBUM" &&
            ratingType !== "ARTIST"
        ) {
            return res.json({
                message: "Invalid Rating Type!",
                success: false,
            });
        }

        // Get rating information for the track / album / artist
        let allRatings = await Rating.findOne({ ratingType, relatedID });
        // If it does not exist throw error
        if (!allRatings) {
            return res.json({
                message: `Ratings does not exist for this ${ratingType}`,
                success: false,
            });
        }

        // Return information
        let selfRating;
        let averageRating;
        let numUsersRated;
        let numFriendsRated;
        let friendRatings = [];
        let friendsAverageRating;

        // Set user's rating
        const userRating = allRatings.ratings.find(
            (rating) => rating.username === username
        );
        if (userRating) {
            selfRating = userRating.rating;
        }

        // Calculate averageRating and numUsersRated
        numUsersRated = allRatings.ratings.length;
        if (numUsersRated !== 0) {
            const ratingSum = allRatings.ratings.reduce(
                (accumulator, obj) => accumulator + obj["rating"],
                0
            );
            averageRating = ratingSum / numUsersRated;
        }

        // Calculate friendsAverageRating and numFriendsRated
        let friendRatingsSum = 0;
        for (let rating of allRatings.ratings) {
            const ratedUser = rating.username;
            const followInformation = await isFriend(username, ratedUser);
            if (followInformation && followInformation.followsEachOther) {
                friendRatings.push({
                    friendUsername: ratedUser,
                    ratedAt: rating.ratedAt,
                    rating: rating.rating,
                });
                friendRatingsSum += rating.rating;
            }
        }
        numFriendsRated = friendRatings.length;
        if (numFriendsRated !== 0) {
            friendsAverageRating = friendRatingsSum / numFriendsRated;
        }

        res.status(201).json({
            message: "Returned rating info successfully",
            success: true,
            selfRating,
            averageRating,
            numUsersRated,
            numFriendsRated,
            friendsAverageRating,
            friendRatings,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Get Rating Info Failed!" });
    }
};
