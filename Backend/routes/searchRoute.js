const { search } = require("../operations/search");

const router = require("express").Router();

router.get("/search", search);

module.exports = router;
