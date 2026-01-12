const mongoose = require("mongoose");
const { TableFields, TableNames } = require("../../utils/constants");

const commentSchema = new mongoose.Schema(
    {
        [TableFields.targetType]: {
            type: String,
            enum: ["question", "answer"],
            required: true,
        },
        [TableFields.targetId]: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        [TableFields.body]: {
            type: String,
            required: true,
        },
        [TableFields.author]: {
            type: mongoose.Schema.Types.ObjectId,
            ref: TableNames.User,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Comment = mongoose.model(TableNames.Comment, commentSchema);

module.exports = Comment;
