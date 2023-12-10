// Checks if users can correctly search and like content
const axios = require("axios");
const assert = require("assert");

require("dotenv").config();
headers = {
    Authorization: process.env.AUTH_TOKEN,
};
const NUM_ITEMS = 50;

describe("Rating System Tests", () => {
    it("get track from liked tracks and rate it", async function () {
        this.timeout(20000000);
        try {
            const getURL =
                "http://localhost:4000/api/likedContent/getLikedContent/:contentType";
            const apiUrl = "http://localhost:4000/api/ratings/rateContent";
            const getLikedTracksResponse = await axios.get(
                getURL.replace(":contentType", "TRACK"),
                {
                    headers,
                }
            );
            assert.strictEqual(getLikedTracksResponse.data.success, true);

            const likedContent = getLikedTracksResponse.data.likedContent;
            const likedContentLength = likedContent.length;
            for (let i = 0; i < NUM_ITEMS; i++) {
                // Pick random index
                const randomContentIndex = Math.floor(
                    Math.random() * likedContentLength
                );

                const contentID = likedContent[randomContentIndex].track._id;
                // Pick random rating
                const randomRating = Math.random() * 10;
                const rateContentResponse = await axios.post(
                    apiUrl,
                    {
                        ratingType: "TRACK",
                        relatedID: contentID,
                        rating: randomRating,
                    },
                    { headers }
                );

                // Expect success response
                assert.strictEqual(rateContentResponse.data.success, true);
            }
            // done();
        } catch (error) {
            assert.fail(error.message);
        }
    }),
        it("get album from liked albums and rate it", async function () {
            this.timeout(20000000);
            try {
                const getURL =
                    "http://localhost:4000/api/likedContent/getLikedContent/:contentType";
                const apiUrl = "http://localhost:4000/api/ratings/rateContent";
                const getLikedTracksResponse = await axios.get(
                    getURL.replace(":contentType", "ALBUM"),
                    {
                        headers,
                    }
                );
                assert.strictEqual(getLikedTracksResponse.data.success, true);

                for (let i = 0; i < NUM_ITEMS; i++) {
                    // Pick random index?
                    const likedContent =
                        getLikedTracksResponse.data.likedContent;
                    const likedContentLength = likedContent.length;

                    const randomContentIndex = Math.floor(
                        Math.random() * likedContentLength
                    );

                    const contentID =
                        likedContent[randomContentIndex].album._id;

                    // Pick random rating
                    const randomRating = Math.random() * 10;
                    const rateContentResponse = await axios.post(
                        apiUrl,
                        {
                            ratingType: "ALBUM",
                            relatedID: contentID,
                            rating: randomRating,
                        },
                        { headers }
                    );

                    // Expect success response
                    assert.strictEqual(rateContentResponse.data.success, true);
                }
                // done();
            } catch (error) {
                assert.fail(error.message);
            }
        });
});
