const ValidationError = require("../../utils/ValidationError");
const Vote = require("../models/vote");
const QuestionService = require("./QuestionService");
const AnswerService = require("./AnswerService");
const UserService = require("./UserService");
const { TableFields } = require("../../utils/constants");

const QUESTION_UPVOTE = 5;
const QUESTION_DOWNVOTE = -1;
const ANSWER_UPVOTE = 10;
const ANSWER_DOWNVOTE = -2;

class VoteService {
    static findVote = (userId, targetType, targetId) => {
        return Vote.findOne(
            {
                [TableFields.user]: userId, [TableFields.targetType]: targetType, [TableFields.targetId]: targetId
            }
        );
    };

    static createOrUpdateVote = async (voteData) => {
        const { userId, targetType, targetId, value } = voteData;

        const isQuestion = targetType === "question";

        let existing = await VoteService.findVote(userId, targetType, targetId);

        // If same vote exists, return without changes
        if (existing && existing[TableFields.value] === value) {
            const target = isQuestion
                ? await QuestionService.findByIdBasic(targetId)
                : await AnswerService.findById(targetId);
            return { target };
        }

        // Get previous vote value (0 if no previous vote)
        const previousValue = existing ? existing[TableFields.value] : 0;

        // Calculate score change for the target (question/answer)
        const score = value - previousValue;

        // Update or create vote
        if (!existing) {
            existing = new Vote({
                [TableFields.user]: userId,
                [TableFields.targetType]: targetType,
                [TableFields.targetId]: targetId,
                [TableFields.value]: value
            });
        } else {
            existing[TableFields.value] = value;
        }
        await existing.save();

        // Verify target exists
        if (isQuestion) {
            const question = await QuestionService.findByIdBasic(targetId);
            if (!question) {
                throw new ValidationError("Question not found");
            }
        } else {
            const answer = await AnswerService.findById(targetId);
            if (!answer) {
                throw new ValidationError("Answer not found");
            }
        }

        // Update target score
        const target = isQuestion
            ? await QuestionService.updateScore(targetId, score)
            : await AnswerService.updateScore(targetId, score);

        // Calculate reputation change
        // Previous vote effect (reverse it)
        let previousRep = 0;
        if (previousValue === 1) {
            previousRep = isQuestion ? QUESTION_UPVOTE : ANSWER_UPVOTE;
        } else if (previousValue === -1) {
            previousRep = isQuestion ? QUESTION_DOWNVOTE : ANSWER_DOWNVOTE;
        }

        // New vote effect
        let newRep = 0;
        if (value === 1) {
            newRep = isQuestion ? QUESTION_UPVOTE : ANSWER_UPVOTE;
        } else if (value === -1) {
            newRep = isQuestion ? QUESTION_DOWNVOTE : ANSWER_DOWNVOTE;
        }

        // Reputation delta = new effect - previous effect
        const repDelta = newRep - previousRep;

        // Update author's reputation if there's a change
        if (repDelta !== 0 && target[TableFields.author]) {
            await UserService.updateReputation(target[TableFields.author], repDelta);
        }

        return { target };
    };
}

module.exports = VoteService;
