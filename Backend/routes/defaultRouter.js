const router = require("express").Router();

// default '.get' route for the root of the API
router.get("/", (req, res) => {
    res.json({ message: "Welcome to SUpotify API!" });
});

module.exports = router;
