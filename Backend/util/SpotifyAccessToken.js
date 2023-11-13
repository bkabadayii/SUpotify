const axios = require("axios");
const fs = require("fs");

// Load environment variables from .env file
require('dotenv').config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Function to authenticate and get the access token
async function getAccessToken() {
    try {
        const response = await axios.post("https://accounts.spotify.com/api/token", null, {
            params: {
                grant_type: "client_credentials",
            },
            auth: {
                username: clientId,
                password: clientSecret,
            },
        });

        const accessToken = response.data.access_token;

        // Update the existing access token in .env file
        fs.writeFileSync('.env', 
        `MONGO_URL = mongodb+srv://admin:fmi9Qj5zCQ9077g2@supotifycluster.41kadml.mongodb.net/?retryWrites=true&w=majority
PORT = 4000
TOKEN_KEY = !1gorkemafsin1!
SPOTIFY_CLIENT_ID =a3abf95fd683498f9d1df82b608b521d
SPOTIFY_CLIENT_SECRET=2012fe02ce5246f8923d47b93455142b
SPOTIFY_TOKEN=${accessToken}\n`);

        return accessToken;
    } catch (error) {
        console.error("Error getting access token:", error.message);
        throw error;
    }
}

module.exports = {
    getAccessToken,
};