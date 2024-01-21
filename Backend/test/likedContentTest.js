// Checks if users can correctly search and like content
const axios = require("axios");
const assert = require("assert");

require("dotenv").config();
headers = {
    Authorization: process.env.AUTH_TOKEN,
};
const NUM_ITEMS = 50;
const NUM_ITEMS_ALBUM = 30;
const NUM_ITEMS_ARTIST = 10;
const SEARCH_TERMS = [
    "kanye",
    "weeknd",
    "motive",
    "ati242",
    "tame impala",
    "müslüm",
    "ahmet kaya",
    "travis",
    "don toliver",
    "asap rocky",
    "taylor",
    "rihanna",
    "hadise",
    "tarkan",
    "sefo",
    "21 savage",
    "lil wayne",
    "future",
    "uzi",
    "kendrick",
    "the neighbourhood",
    "jay-z",
    "sagopa",
    "ezhel",
    "şehinşah",
    "harry styles",
    "metro boomin",
    "arctic monkeys",
    "david guetta",
    "tom odell",
    "ariana grande",
    "eminem",
    "tyler the creator",
    "bad bunny",
    "playboi carti",
    "kid cudi",
    "ed sheeran",
    "azer bülbül",
    "miley cyrus",
    "juice wrld",
    "post malone",
    "luis fonsi",
    "gunna",
    "semicenk",
    "sezen aksu",
    "cakal",
    "güneş",
    "lil zey",
    "duman",
    "alizade",
    "gülşen",
    "lana del rey",
    "sertab erener",
    "murda",
    "serdar ortaç",
    "tamino",
    "radiohead",
    "placebo",
    "stromae",
];

describe("Liked Content Tests", () => {
    it("should search and like tracks", async function () {
        this.timeout(20000000);
        try {
            // In order to keep track of added id's
            let addedIDs = new Set();

            const searchURL =
                "http://localhost:4000/api/getFromSpotify/search/:searchTerm";
            const apiUrl =
                "http://localhost:4000/api/likedContent/likeTrackBySpotifyID";

            for (let i = 0; i < NUM_ITEMS; i++) {
                // Pick random search term?
                const randomSearchIndex = Math.floor(
                    Math.random() * SEARCH_TERMS.length
                );
                const searchTerm = SEARCH_TERMS[randomSearchIndex];

                const searchResponse = await axios.get(
                    searchURL.replace(":searchTerm", searchTerm),
                    {
                        headers,
                    }
                );
                assert.strictEqual(searchResponse.data.success, true);

                // Pick random index?
                const randomContentIndex = Math.floor(Math.random() * 5);
                const spotifyID =
                    searchResponse.data.data.Tracks[randomContentIndex].id;
                const albumSpotifyID =
                    searchResponse.data.data.Tracks[randomContentIndex].albumID;

                const likeTrackResponse = await axios.post(
                    apiUrl,
                    {
                        spotifyID,
                        albumSpotifyID,
                    },
                    { headers }
                );

                // If the track is already added, expect fail response
                if (addedIDs.has(spotifyID)) {
                    assert.strictEqual(likeTrackResponse.data.success, false);
                }
                // Else expect success response
                else {
                    assert.strictEqual(likeTrackResponse.data.success, true);
                }

                addedIDs.add(spotifyID);
            }
            // done();
        } catch (error) {
            assert.fail(error.message);
        }
    });
    it("should search and like albums", async function () {
        this.timeout(20000000);
        try {
            // In order to keep track of added id's
            let addedIDs = new Set();

            const searchURL =
                "http://localhost:4000/api/getFromSpotify/search/:searchTerm";
            const apiUrl =
                "http://localhost:4000/api/likedContent/likeAlbumBySpotifyID";

            for (let i = 0; i < NUM_ITEMS_ALBUM; i++) {
                // Pick random search term?
                const randomSearchIndex = Math.floor(
                    Math.random() * SEARCH_TERMS.length
                );
                const searchTerm = SEARCH_TERMS[randomSearchIndex];

                const searchResponse = await axios.get(
                    searchURL.replace(":searchTerm", searchTerm),
                    {
                        headers,
                    }
                );
                assert.strictEqual(searchResponse.data.success, true);

                // Pick random index?
                const randomContentIndex = Math.floor(Math.random() * 5);
                const spotifyID =
                    searchResponse.data.data.Albums[randomContentIndex].id;

                const likeAlbumResponse = await axios.post(
                    apiUrl,
                    {
                        spotifyID,
                    },
                    { headers }
                );

                // If the track is already added, expect fail response
                if (addedIDs.has(spotifyID)) {
                    assert.strictEqual(likeAlbumResponse.data.success, false);
                }
                // Else expect success response
                else {
                    assert.strictEqual(likeAlbumResponse.data.success, true);
                }

                addedIDs.add(spotifyID);
            }
            // done();
        } catch (error) {
            assert.fail(error.message);
        }
    });
    it("should search and like artists", async function () {
        this.timeout(20000000);
        try {
            // In order to keep track of added id's
            let addedIDs = new Set();

            const searchURL =
                "http://localhost:4000/api/getFromSpotify/search/:searchTerm";
            const apiUrl =
                "http://localhost:4000/api/likedContent/likeArtistBySpotifyID";

            for (let i = 0; i < NUM_ITEMS_ARTIST; i++) {
                // Pick random search term?
                const randomSearchIndex = Math.floor(
                    Math.random() * SEARCH_TERMS.length
                );
                const searchTerm = SEARCH_TERMS[randomSearchIndex];

                const searchResponse = await axios.get(
                    searchURL.replace(":searchTerm", searchTerm),
                    {
                        headers,
                    }
                );
                assert.strictEqual(searchResponse.data.success, true);

                // Pick random index?
                const randomContentIndex = Math.floor(Math.random() * 5);
                const spotifyID =
                    searchResponse.data.data.Artists[randomContentIndex].id;

                const likeArtistResponse = await axios.post(
                    apiUrl,
                    {
                        spotifyID,
                    },
                    { headers }
                );

                // If the track is already added, expect fail response
                if (addedIDs.has(spotifyID)) {
                    assert.strictEqual(likeArtistResponse.data.success, false);
                }
                // Else expect success response
                else {
                    assert.strictEqual(likeArtistResponse.data.success, true);
                }

                addedIDs.add(spotifyID);
            }
            // done();
        } catch (error) {
            assert.fail(error.message);
        }
    });
});
