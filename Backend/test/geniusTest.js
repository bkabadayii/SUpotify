// Checks if users can correctly retrieve lyrics from genius
const axios = require("axios");
const assert = require("assert");

require("dotenv").config();
const headers = {
    Authorization: "Bearer <your_token>",
};
const TRACKS = [
    { name: "Way 2 Sexy", artist: "Drake" },
    { name: "SAVANA", artist: "Motive" },
    { name: "Zor", artist: "Lil Zey" },
];

describe("Rating System Tests", () => {
    it("should retrieve lyrics from genius api", async function () {
        this.timeout(20000000);
        try {
            for (const track of TRACKS) {
                const getURL =
                    "http://localhost:4000/api/getFromGenius/getLyricsOfASong/:songName/:artistName";
                const getLyricsResponse = await axios.get(
                    getURL
                        .replace(":songName", track.name)
                        .replace(":artistName", track.artist),
                    {
                        headers,
                    }
                );
                assert.strictEqual(getLyricsResponse.data.success, true);
            }
        } catch (error) {
            assert.fail(error.message);
        }
    });
});
