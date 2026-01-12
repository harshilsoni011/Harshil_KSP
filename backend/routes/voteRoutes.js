const express = require("express");
const API = require("../utils/apiBuilder");
const VoteController = require("../controllers/ksp/VoteController");

const router = express.Router();

const questionVoteRouter = API.configRoute("/question")
    
    .addPath("/:id/vote")
    .asPOST(VoteController.voteQuestion)
    .useUserAuth()
    .build()

    .getRouter();

const answerVoteRouter = API.configRoute("/answers")
    .addPath("/:id/vote")
    .asPOST(VoteController.voteAnswer)
    .useUserAuth()
    .build()

    .getRouter();

router.use(questionVoteRouter);
router.use(answerVoteRouter);

module.exports = router;
