const express = require("express");
const API = require("../utils/apiBuilder");
const CommentController = require("../controllers/ksp/CommentController");

const router = express.Router();

const questionCommentRouter = API.configRoute("/question")
    
    .addPath("/:id/comments")
    .asPOST(CommentController.createQuestionComment)
    .useUserAuth()
    .build()

    .getRouter();

const answerCommentRouter = API.configRoute("/answers")
    .addPath("/:id/comments")
    .asPOST(CommentController.createAnswerComment)
    .useUserAuth()
    .build()

    .getRouter();

router.use(questionCommentRouter);
router.use(answerCommentRouter);

module.exports = router;
