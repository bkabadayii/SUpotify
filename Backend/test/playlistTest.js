// Checks if users can correctly search and rate content
const axios = require("axios");
const assert = require("assert");

require("dotenv").config();
const headers = {
    Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDE3YTNjZDg3YzQ4YzY0OWFjNGYzYSIsImlhdCI6MTcwNTkwOTgwNiwiZXhwIjoxNzA2MTY5MDA2fQ.hGaQxNicSX2J7Guv7SNZxkTT4I9_lMrR5WxA69AeLc0",
};
const NUM_ITEMS = 3;
const TRACKS = [
    "6570851b84cd8cced2217398",
    "6571268b11550fa718fad627",
    "658854ff4b681d21749a65ee",
];
describe("Playlist System Tests", () => {
    let createdPlaylistId = "";
    it("should get get all playlists and create a new playlist", async function () {
        this.timeout(20000000);
        try {
            const getURL =
                "http://localhost:4000/api/playlists/getUserPlaylists";
            const createPlaylistUrl =
                "http://localhost:4000/api/playlists/createPlaylist";

            let getPlaylistsResponse = await axios.get(getURL, {
                headers,
            });

            assert.strictEqual(getPlaylistsResponse.data.success, true);
            const initialNumPlaylists =
                getPlaylistsResponse.data.userToPlaylists.playlists.length;

            const createPlaylistResponse = await axios.post(
                createPlaylistUrl,
                { playlistName: "My Playlist 1" },
                {
                    headers,
                }
            );
            assert.strictEqual(createPlaylistResponse.data.success, true);
            getPlaylistsResponse = await axios.get(getURL, {
                headers,
            });
            const finalNumPlaylists =
                getPlaylistsResponse.data.userToPlaylists.playlists.length;

            assert.strictEqual(initialNumPlaylists + 1, finalNumPlaylists);
            assert.strictEqual(
                getPlaylistsResponse.data.userToPlaylists.playlists[
                    finalNumPlaylists - 1
                ].name,
                "My Playlist 1"
            );
            createdPlaylistId =
                getPlaylistsResponse.data.userToPlaylists.playlists[
                    finalNumPlaylists - 1
                ]._id;
        } catch (error) {
            assert.fail(error.message);
        }
    });
    it("should add tracks to playlist", async function () {
        this.timeout(20000000);
        try {
            const getURL =
                "http://localhost:4000/api/playlists/getUserPlaylists";
            const addTrackURL =
                "http://localhost:4000/api/playlists/addTrackToPlaylist";

            for (let i = 0; i < NUM_ITEMS; i++) {
                const addTrackResponse = await axios.post(addTrackURL, {
                    headers,
                    data: {
                        trackID: TRACKS[i],
                        playlistID: createdPlaylistId,
                    },
                });
                assert.strictEqual(addTrackResponse.data.success, true);
            }
            // Get the playlist and check id there are all the songs
            const getPlaylistResponse = await axios.get(getURL, { headers });
            assert.strictEqual(getPlaylistResponse.data.success, true);
            assert.strictEqual(
                getPlaylistResponse.data.existingPlaylist.tracks.length,
                NUM_ITEMS
            );
        } catch (error) {
            assert.fail(error.message);
        }
    });
    it("should delete tracks from playlist", async function () {
        this.timeout(20000000);
        try {
            const getURL =
                "http://localhost:4000/api/playlists/getUserPlaylists";
            const removeTrackURL =
                "http://localhost:4000/api/playlists/removeTrackFromPlaylist";

            for (let i = 0; i < NUM_ITEMS; i++) {
                const removeTrackResponse = await axios.delete(removeTrackURL, {
                    headers,
                    data: {
                        trackID: TRACKS[i],
                        playlistID: createdPlaylistId,
                    },
                });
                assert.strictEqual(removeTrackResponse.data.success, true);
            }
            // Get the playlist and check id there are all the songs
            const getPlaylistResponse = await axios.get(getURL, { headers });
            assert.strictEqual(getPlaylistResponse.data.success, true);
            assert.strictEqual(
                getPlaylistResponse.data.existingPlaylist.tracks.length,
                0
            );
        } catch (error) {
            assert.fail(error.message);
        }
    });
    it("should delete the created playlist", async function () {
        this.timeout(20000000);
        try {
            const deletePlaylistURL =
                "http://localhost:4000/api/playlists/deletePlaylist";

            const deletePlaylistResponse = await axios.delete(
                deletePlaylistURL,
                {
                    headers,
                    data: {
                        playlistID: createdPlaylistId,
                    },
                }
            );

            assert.strictEqual(deletePlaylistResponse.data.success, true);
        } catch (error) {
            assert.fail(error.message);
        }
    });
});
