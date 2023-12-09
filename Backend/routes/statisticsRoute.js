const {
    getTopRatedTracks,
    getTopRatedAlbums,
    getTopRatedArtists,
    getLikedContentStatistics,
    getAllGenres,
} = require("../operations/getStatistics.js");

const router = require("express").Router();

router.post("/getTopRatedTracks", getTopRatedTracks);
router.post("/getTopRatedAlbums", getTopRatedAlbums);
router.post("/getTopRatedArtists", getTopRatedArtists);

router.post("/getLikedContentStatistics", getLikedContentStatistics);

router.get("/getAllGenres/:contentType/:source", getAllGenres);

module.exports = router;
