const {
    createUserToRatings,
    getUserToRatings,
    addNewRating,
    deleteRating,
    updateRating,
    getRatingInfo,
} = require("../controllers/ratingController");

const router = require("express").Router();

router.post("/createUserToRatings", createUserToRatings);
router.get("/getUserToRatings", getUserToRatings);

router.post("/addNewRating", addNewRating);
router.delete("/deleteRating/:ratingType/:relatedID", deleteRating);
router.post("/updateRating", updateRating);

router.get("/getRatingInfo/:ratingType/:relatedID", getRatingInfo);

module.exports = router;
