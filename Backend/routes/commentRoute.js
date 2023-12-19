const {
    getContentComments,
    commentContent,
} = require("../controllers/commentsController");

const router = require("express").Router();

router.get("/getContentComments/:contentType/:relatedID", getContentComments);
router.post("/commentContent", commentContent);

module.exports = router;
