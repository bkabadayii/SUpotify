// WARNING / TODO: Admin protection must be added to this file
const Artist = require("../models/artistModel");

// Adds new artist to the database
module.exports.addNewArtist = async (req, res) => {
    try {
        const { name, genres, popularity, spotifyID, spotifyURL, imageURL } =
            req.body;

        // If there exists an artist with the same name, throw an error
        const existingArtist = await Artist.findOne({ name });
        if (existingArtist) {
            return res.json({
                message: "Artist already exists",
                success: false,
            });
        }
        // Else create new artist.
        const newArtist = await Artist.create({
            name,
            genres,
            popularity,
            spotifyID,
            spotifyURL,
            imageURL,
        });

        return res.status(201).json({
            message: "New artist has been added successfully",
            success: true,
            newArtist: newArtist,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};
