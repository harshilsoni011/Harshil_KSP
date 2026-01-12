const CommentService = require("../../db/services/CommentService");
const QuestionService = require("../../db/services/QuestionService");
const AnswerService = require("../../db/services/AnswerService");
const ValidationError = require("../../utils/ValidationError");
const { TableFields } = require("../../utils/constants");

exports.createQuestionComment = async (req) => {
    const { id } = req.params;
    const body = req.body[TableFields.body];

    const question = await QuestionService.findByIdBasic(id);
    if (!question) {
        throw new ValidationError("Question not found");
    }

    const comment = await CommentService.createComment({
        targetType: "question",
        targetId: id,
        body,
        authorId: req.user[TableFields.ID],
    });

    return { comment };
};

exports.createAnswerComment = async (req) => {
    const { id } = req.params;
    const body = req.body[TableFields.body];

    const answer = await AnswerService.findById(id);
    if (!answer) {
        throw new ValidationError("Answer not found");
    }

    const comment = await CommentService.createComment({
        targetType: "answer",
        targetId: id,
        body,
        authorId: req.user[TableFields.ID],
    });

    return { comment };
};
