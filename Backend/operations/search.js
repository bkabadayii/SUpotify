const Track = require("../models/trackModel");

module.exports.search = async (req, res) => {
    try {
        const { searchTerm } = req.body;

        if (!searchTerm) {
            return res
                .status(400)
                .json({ message: "Search term is required!", success: false });
        }

        /*
        // Create a case-insensitive and partial match regular expression
        const regexp = new RegExp(escapeRegExp(searchTerm), "i");

        // Use the regex to search for tracks by name, album name, or artist
        const tracks = await Track.find({
            $or: [
                { name: { $regex: regexp } },
                // { album: { $regex: regexp } },
                // { artist: { $regex: regexp } },
            ],
        });
        */

        // aggregation array
        let calledAggregation = [
            {
                $search: {
                    index: "default",
                    autocomplete: {
                        query: searchTerm,
                        path: "name",
                    },
                },
            },
            { $limit: 10 },
        ];

        const tracks = await Track.aggregate(calledAggregation);

        res.status(201).json({
            message: "Search results returned successfully",
            success: true,
            tracks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
