const ValidationError = require("../../utils/ValidationError");
const Comment = require("../models/comment");
const { TableFields } = require("../../utils/constants");

class CommentService {
    static findByQuestionId = (questionId) => {
        return Comment.find({ [TableFields.targetType]: "question", [TableFields.targetId]: questionId })
            .sort({ [TableFields.createdAt]: 1 })
            .populate(TableFields.author, `${TableFields.name_} ${TableFields.reputation}`);
    };

    static findByAnswerIds = (answerIds) => {
        return Comment.find({
            [TableFields.targetType]: "answer",
            [TableFields.targetId]: { $in: answerIds },
        })
            .sort({ [TableFields.createdAt]: 1 })
            .populate(TableFields.author, `${TableFields.name_} ${TableFields.reputation}`);
    };

    static createComment = async (commentData) => {
        const { targetType, targetId, body, authorId } = commentData;

        if (!body) {
            throw new ValidationError("Comment body is required");
        }

        const comment = await Comment.create({
            [TableFields.targetType]: targetType,
            [TableFields.targetId]: targetId,
            [TableFields.body]: body,
            [TableFields.author]: authorId,
        });

        return comment;
    };
}

module.exports = CommentService;
