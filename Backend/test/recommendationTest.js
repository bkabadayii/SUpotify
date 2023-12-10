// Checks if users can correctly search and like content
const axios = require("axios");
const assert = require("assert");

require("dotenv").config();
headers = {
    Authorization: process.env.AUTH_TOKEN,
};
const NUM_ITEMS = 10;

describe("Recommedation test", () => {
    it("should return correct number of recommendations", async function () {
        this.timeout(20000000);
        try {
            const apiUrl =
                "http://localhost:4000/api/recommendation/recommendTrackFromFollowedUser/:trackNum";

            // Pick random recommendation count
            const randomTrackNum = Math.floor(Math.random() * NUM_ITEMS);
            const getRecommendationResponse = await axios.get(
                apiUrl.replace(":trackNum", randomTrackNum),
                {
                    headers,
                }
            );
            // Check if recommendation is successful
            assert.strictEqual(getRecommendationResponse.data.success, true);
            // Check if correct number of items are returned
            assert.strictEqual(
                getRecommendationResponse.data.recommendations.length,
                randomTrackNum
            );
        } catch (error) {
            assert.fail(error.message);
        }
    });
});
