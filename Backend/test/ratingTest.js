// Checks if users can correctly search and rate content
const axios = require("axios");
const assert = require("assert");

require("dotenv").config();
const headers = {
    Authorization: "Bearer <your_token>",
};
const NUM_ITEMS = 10;

describe("Rating System Tests", () => {
    let ratedTracks = [];
    it("should get track from liked tracks and rate it", async function () {
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
            if (likedContentLength < NUM_ITEMS) {
                throw new Error(
                    "User must have at least NUM_ITEMS tracks liked to run this test!"
                );
            }
            for (let i = 0; i < NUM_ITEMS; i++) {
                const contentID = likedContent[i].track._id;
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
                ratedTracks.push(contentID);
            }
        } catch (error) {
            assert.fail(error.message);
        }
    });
    it("should get album from liked albums and rate it", async function () {
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
                const likedContent = getLikedTracksResponse.data.likedContent;
                const likedContentLength = likedContent.length;

                const randomContentIndex = Math.floor(
                    Math.random() * likedContentLength
                );

                const contentID = likedContent[randomContentIndex].album._id;

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
    it("should delete existing ratings", async function () {
        this.timeout(20000000);
        try {
            const deleteRatingURL =
                "http://localhost:4000/api/ratings/deleteRating/:ratingType/:relatedID";
            const getUserToRatingsURL =
                "http://localhost:4000/api/ratings/getUserToRatings";
            const getRatingInfoURL =
                "http://localhost:4000/api/ratings/getRatingInfo/:ratingType/:relatedID";
            // Check if all ratings are deleted
            for (let trackID of ratedTracks) {
                const deleteRatingResponse = await axios.delete(
                    deleteRatingURL
                        .replace(":ratingType", "TRACK")
                        .replace(":relatedID", trackID),
                    {
                        headers,
                    }
                );
                // Expect a success response
                assert.strictEqual(deleteRatingResponse.data.success, true);
                // Check if rating is deleted from the track's ratings
                const getRatingInfoResponse = await axios.get(
                    getRatingInfoURL
                        .replace(":ratingType", "TRACK")
                        .replace(":relatedID", trackID),
                    { headers }
                );
                // Expect a success response
                assert.strictEqual(getRatingInfoResponse.data.success, true);
                // Expect selfRating to be null
                assert.strictEqual(
                    getRatingInfoResponse.data.selfRating,
                    undefined
                );
            }

            // At the end check if all ratings are also deleted from user's rated content
            const getUserToRatingsResponse = await axios.get(
                getUserToRatingsURL,
                { headers }
            );
            // Expect a success response
            assert.strictEqual(getUserToRatingsResponse.data.success, true);
            for (const ratedTrack of getUserToRatingsResponse.data
                .existingUserToRatings.trackRatings) {
                if (ratedTracks.includes(ratedTrack.track)) {
                    throw new Error("Rating not deleted from user's ratings!");
                }
            }
        } catch (error) {
            assert.fail(error.message);
        }
    });
});
