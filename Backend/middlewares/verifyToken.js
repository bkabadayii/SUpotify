const User = require("../models/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: Missing token or wrong format." });
        }

        const token = authHeader.slice(7);

        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            try {
                if (err) {
                    return res.status(401).json({
                        message: "Unauthorized: Token verification failed.",
                    });
                }

                const user = await User.findById(data.id);

                if (!user) {
                    return res.status(401).json({
                        message: "Unauthorized: User not found in the database."
                    });
                }

                // Attach the user to the request object
                req.user = user;

                next();

            } catch (innerError) {
                return res.status(500).json({
                    message: "Internal Server Error",
                    error: innerError.message
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};
