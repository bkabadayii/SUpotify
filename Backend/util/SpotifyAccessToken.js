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
        const envFilePath = '.env';
        const data = fs.readFileSync(envFilePath, 'utf8');
        const lines = data.split('\n');
        
        //Delete old access token
        lines.pop();
        
        //Append new access token
        const newLine = `SPOTIFY_TOKEN=${accessToken}`;
        lines.push(newLine);
        const updatedData = lines.join('\n');
        fs.writeFileSync(envFilePath, updatedData, 'utf8');

        return accessToken;
    } catch (error) {
        console.error("Error getting access token:", error.message);
        throw error;
    }
}

module.exports = {
    getAccessToken,
};
