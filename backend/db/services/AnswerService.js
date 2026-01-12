const ValidationError = require("../../utils/ValidationError");
const Answer = require("../models/answer");
const { TableFields } = require("../../utils/constants");

class AnswerService {
    static findById = (answerId) => {
        return Answer.findById(answerId);
    };

    static findByQuestionId = (questionId) => {
        return Answer.find({ [TableFields.question]: questionId })
            .sort({ [TableFields.createdAt]: 1 })
            .populate(TableFields.author, `${TableFields.name_} ${TableFields.reputation}`);
    };

    static createAnswer = async (answerData) => {
        const { questionId, body, authorId } = answerData;

        if (!body) {
            throw new ValidationError("Answer body is required");
        }

        const answer = await Answer.create({
            [TableFields.question]: questionId,
            [TableFields.body]: body,
            [TableFields.author]: authorId,
        });

        return answer;
    };

    static updateScore = async (answerId, score) => {
        return await Answer.findByIdAndUpdate(
            answerId,
            { $inc: { [TableFields.score]: score } },
            { new: true }
        );
    };
}

module.exports = AnswerService;
