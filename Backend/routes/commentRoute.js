const {
    getContentComments,
    commentContent,
    deleteComment,
    switchCommentLikeStatus,
} = require("../controllers/commentsController");

const router = require("express").Router();

router.get("/getContentComments/:contentType/:relatedID", getContentComments);
router.post("/commentContent", commentContent);
router.delete("/deleteComment", deleteComment);
router.post("/switchCommentLikeStatus", switchCommentLikeStatus);

module.exports = router;
