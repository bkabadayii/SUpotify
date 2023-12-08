const {
    getTopRatedTracks,
    getTopRatedAlbums,
    getTopRatedArtists,
    getLikedContentStatistics,
} = require("../operations/getStatistics.js");

const router = require("express").Router();

router.post("/getTopRatedTracks", getTopRatedTracks);
router.post("/getTopRatedAlbums", getTopRatedAlbums);
router.post("/getTopRatedArtists", getTopRatedArtists);

router.post("/getLikedContentStatistics", getLikedContentStatistics);

module.exports = router;
