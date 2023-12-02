const {
    createUserToRatings,
    getUserToRatings,
    addNewRating,
    deleteRating,
} = require("../controllers/ratingController");

const router = require("express").Router();

router.post("/createUserToRatings", createUserToRatings);
router.get("/getUserToRatings", getUserToRatings);

router.post("/addNewRating", addNewRating);
router.delete("/deleteRating/:ratingType/:relatedID", deleteRating);

module.exports = router;
