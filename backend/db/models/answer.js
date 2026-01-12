const mongoose = require("mongoose");
const { TableFields, TableNames } = require("../../utils/constants");

const answerSchema = new mongoose.Schema(
    {
        [TableFields.question]: {
            type: mongoose.Schema.Types.ObjectId,
            ref: TableNames.Question,
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
        [TableFields.score]: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

const Answer = mongoose.model(TableNames.Answer, answerSchema);

module.exports = Answer;
