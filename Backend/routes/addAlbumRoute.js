const { addNewAlbum } = require("../operations/addAlbum");
const { addNewArtist } = require("../operations/addContent");

const router = require("express").Router();

router.post("/addNewAlbum", addNewAlbum);
router.post("/addNewArtist", addNewArtist);

module.exports = router;
