const {
    createFollowedUsersForUser,
    addToUserFollowedUsers,
    removeFromUserFollowedUsers,
    getAllFollowedUsersForUser,
    recommendationBlockUser,
    recommendationUnblockUser,
    getBlockedUsers,
} = require("../controllers/followedUsersController");

const router = require("express").Router();

router.get("/getAllFollowedUsersForUser", getAllFollowedUsersForUser);
router.get("/getBlockedUsers", getBlockedUsers);

router.post("/createFollowedUsersForUser", createFollowedUsersForUser);
router.post("/addToUserFollowedUsers", addToUserFollowedUsers);
router.post("/recommendationBlockUser", recommendationBlockUser);

router.delete("/removeFromUserFollowedUsers", removeFromUserFollowedUsers);
router.delete("/recommendationUnblockUser", recommendationUnblockUser);

module.exports = router;
