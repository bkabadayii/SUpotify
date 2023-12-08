const {
    getTopRatedTracks,
    getTopRatedAlbums,
    getTopRatedArtists,
} = require("../operations/getStatistics.js");

const router = require("express").Router();

router.post("/getTopRatedTracks", getTopRatedTracks);
router.post("/getTopRatedAlbums", getTopRatedAlbums);
router.post("/getTopRatedArtists", getTopRatedArtists);

module.exports = router;
