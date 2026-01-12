const AnswerService = require("../../db/services/AnswerService");
const QuestionService = require("../../db/services/QuestionService");
const ValidationError = require("../../utils/ValidationError");
const { TableFields } = require("../../utils/constants");

exports.create = async (req) => {
    const { id } = req.params;
    const body = req.body[TableFields.body];

    const question = await QuestionService.findByIdBasic(id);
    if (!question) {
        throw new ValidationError("Question not found");
    }

    const answer = await AnswerService.createAnswer({
        questionId: id,
        body,
        authorId: req.user[TableFields.ID],
    });

    return { answer };
};
