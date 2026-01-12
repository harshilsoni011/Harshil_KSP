const mongoose = require("mongoose");
const { TableFields, TableNames } = require("../../utils/constants");

const voteSchema = new mongoose.Schema(
    {
        [TableFields.user]: {
            type: mongoose.Schema.Types.ObjectId,
            ref: TableNames.User,
            required: true,
        },
        [TableFields.targetType]: {
            type: String,
            enum: ["question", "answer"],
            required: true,
        },
        [TableFields.targetId]: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        [TableFields.value]: {
            type: Number,
            enum: [1, -1],
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

voteSchema.index(
    {
        [TableFields.user]: 1,
        [TableFields.targetType]: 1,
        [TableFields.targetId]: 1,
    },
    { unique: true },
);

const Vote = mongoose.model(TableNames.Vote, voteSchema);

module.exports = Vote;
