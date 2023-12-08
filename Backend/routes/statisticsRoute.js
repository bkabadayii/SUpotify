const { getTopRatedTracks } = require("../operations/getStatistics.js");

const router = require("express").Router();

router.post("/getTopRatedTracks", getTopRatedTracks);

module.exports = router;
