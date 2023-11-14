const { addNewAlbum } = require("../operations/addAlbum");

const router = require("express").Router();

router.post("/addNewAlbum", addNewAlbum);

module.exports = router;
