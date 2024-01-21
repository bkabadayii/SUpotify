// Checks if users can correctly comment content
const axios = require("axios");
const assert = require("assert");

require("dotenv").config();
const headers = {
    Authorization: "Bearer <your_token>",
};

const NUM_ITEMS = 5;
const CONTENTS = [
    { type: "TRACK", id: "6570851b84cd8cced2217398" },
    { type: "ALBUM", id: "6570d138f8c90977b9ff6185" },
    { type: "ARTIST", id: "6570851a84cd8cced2217392" },
    { type: "TRACK", id: "6571268b11550fa718fad627" },
    { type: "TRACK", id: "658854ff4b681d21749a65ee" },
];

describe("Comment System Tests", () => {
    let newComments = [];
    it("should get content comments and comment to a content", async function () {
        this.timeout(20000000);
        try {
            if (CONTENTS.length < NUM_ITEMS) {
                throw new Error(
                    "You must have at least NUM_ITEMS contents to run this test!"
                );
            }

            const getContentCommentsURL =
                "http://localhost:4000/api/comments/getContentComments/:contentType/:relatedID";
            const commentContentURL =
                "http://localhost:4000/api/comments/commentContent";

            for (let i = 0; i < NUM_ITEMS; i++) {
                let getContentCommentsResponse = await axios.get(
                    getContentCommentsURL
                        .replace(":contentType", CONTENTS[i].type)
                        .replace(":relatedID", CONTENTS[i].id),
                    {
                        headers,
                    }
                );

                const initialNumComments =
                    getContentCommentsResponse.data.allComments.length;

                // Send comment request
                const commentContentResponse = await axios.post(
                    commentContentURL,
                    {
                        contentType: CONTENTS[i].type,
                        relatedID: CONTENTS[i].id,
                        comment: "Crazy content",
                    },
                    { headers }
                );

                // Expect a success response
                assert.strictEqual(commentContentResponse.data.success, true);
                newComments.push(commentContentResponse.data.newComment._id);

                getContentCommentsResponse = await axios.get(
                    getContentCommentsURL
                        .replace(":contentType", CONTENTS[i].type)
                        .replace(":relatedID", CONTENTS[i].id),
                    {
                        headers,
                    }
                );

                const finalNumComments =
                    getContentCommentsResponse.data.allComments.length;

                // Expect final number of comments to be one more than the initial
                assert.strictEqual(initialNumComments + 1, finalNumComments);
            }
        } catch (error) {
            assert.fail(error.message);
        }
    });
    it("should like / unlike comments", async function () {
        this.timeout(20000000);
        try {
            const getContentCommentsURL =
                "http://localhost:4000/api/comments/getContentComments/:contentType/:relatedID";
            const switchCommentLikeStatusURL =
                "http://localhost:4000/api/comments/switchCommentLikeStatus";

            for (let i = 0; i < NUM_ITEMS; i++) {
                /* CHECK INITIAL STATE */
                let getContentCommentsResponse = await axios.get(
                    getContentCommentsURL
                        .replace(":contentType", CONTENTS[i].type)
                        .replace(":relatedID", CONTENTS[i].id),
                    {
                        headers,
                    }
                );
                let numComments, lastComment;

                numComments =
                    getContentCommentsResponse.data.allComments.length;
                lastComment =
                    getContentCommentsResponse.data.allComments[
                        numComments - 1
                    ];

                // Assert total likes == 0 and selfLike == false
                assert.strictEqual(lastComment.totalLikes, 0);
                assert.strictEqual(lastComment.selfLike, false);
                /* CHECK INITIAL STATE */

                /* CHECK STATE AFTER LIKE */
                let switchCommentLikeStatusResponse = await axios.post(
                    switchCommentLikeStatusURL,
                    {
                        commentID: newComments[i],
                    },
                    { headers }
                );

                getContentCommentsResponse = await axios.get(
                    getContentCommentsURL
                        .replace(":contentType", CONTENTS[i].type)
                        .replace(":relatedID", CONTENTS[i].id),
                    {
                        headers,
                    }
                );

                numComments =
                    getContentCommentsResponse.data.allComments.length;
                lastComment =
                    getContentCommentsResponse.data.allComments[
                        numComments - 1
                    ];

                // Assert total likes == 1 and selfLike == true
                assert.strictEqual(lastComment.totalLikes, 1);
                assert.strictEqual(lastComment.selfLike, true);
                /* CHECK STATE AFTER LIKE */

                /* CHECK STATE AFTER UNLIKE */
                switchCommentLikeStatusResponse = await axios.post(
                    switchCommentLikeStatusURL,
                    {
                        commentID: newComments[i],
                    },
                    { headers }
                );

                getContentCommentsResponse = await axios.get(
                    getContentCommentsURL
                        .replace(":contentType", CONTENTS[i].type)
                        .replace(":relatedID", CONTENTS[i].id),
                    {
                        headers,
                    }
                );

                numComments =
                    getContentCommentsResponse.data.allComments.length;
                lastComment =
                    getContentCommentsResponse.data.allComments[
                        numComments - 1
                    ];

                // Assert total likes == 0 and selfLike == false
                assert.strictEqual(lastComment.totalLikes, 0);
                assert.strictEqual(lastComment.selfLike, false);
                /* CHECK STATE AFTER UNLIKE */
            }
        } catch (error) {
            assert.fail(error.message);
        }
    });
    it("should delete new comments", async function () {
        this.timeout(20000000);
        try {
            const getContentCommentsURL =
                "http://localhost:4000/api/comments/getContentComments/:contentType/:relatedID";
            const deleteCommentURL =
                "http://localhost:4000/api/comments/deleteComment";

            for (let i = 0; i < NUM_ITEMS; i++) {
                let getContentCommentsResponse = await axios.get(
                    getContentCommentsURL
                        .replace(":contentType", CONTENTS[i].type)
                        .replace(":relatedID", CONTENTS[i].id),
                    {
                        headers,
                    }
                );

                const initialNumComments =
                    getContentCommentsResponse.data.allComments.length;

                // Send delete comment request
                const deleteCommentResponse = await axios.delete(
                    deleteCommentURL,
                    {
                        headers,
                        data: {
                            contentType: CONTENTS[i].type,
                            relatedID: CONTENTS[i].id,
                            commentID: newComments[i],
                        },
                    }
                );

                // Expect a success response
                assert.strictEqual(deleteCommentResponse.data.success, true);

                getContentCommentsResponse = await axios.get(
                    getContentCommentsURL
                        .replace(":contentType", CONTENTS[i].type)
                        .replace(":relatedID", CONTENTS[i].id),
                    {
                        headers,
                    }
                );

                const finalNumComments =
                    getContentCommentsResponse.data.allComments.length;

                // Expect final number of comments to be one less than the initial
                assert.strictEqual(initialNumComments - 1, finalNumComments);
            }
        } catch (error) {
            assert.fail(error.message);
        }
    });
});
