const {
    createUserToRatings,
    getUserToRatings,
    rateContent,
    deleteRating,
    getRatingInfo,
} = require("../controllers/ratingController");

const router = require("express").Router();

router.post("/createUserToRatings", createUserToRatings);
router.get("/getUserToRatings", getUserToRatings);

router.post("/rateContent", rateContent);
router.delete("/deleteRating/:ratingType/:relatedID", deleteRating);

router.get("/getRatingInfo/:ratingType/:relatedID", getRatingInfo);

module.exports = router;
