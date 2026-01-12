const VoteService = require("../../db/services/VoteService");
const ValidationError = require("../../utils/ValidationError");
const { TableFields } = require("../../utils/constants");

exports.voteQuestion = async (req) => {
    const { id } = req.params;
    const value = req.body[TableFields.value];

    if (![1, -1].includes(value)) {
        throw new ValidationError("Invalid vote value");
    }

    const result = await VoteService.createOrUpdateVote({
        userId: req.user[TableFields.ID],
        targetType: "question",
        targetId: id,
        value,
    });

    return { question: result.target };
};

exports.voteAnswer = async (req) => {
    const { id } = req.params;
    const value = req.body[TableFields.value];

    if (![1, -1].includes(value)) {
        throw new ValidationError("Invalid vote value");
    }

    const result = await VoteService.createOrUpdateVote({
        userId: req.user[TableFields.ID],
        targetType: "answer",
        targetId: id,
        value,
    });

    return { answer: result.target };
};
