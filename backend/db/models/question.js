const mongoose = require("mongoose");
const { TableFields, TableNames } = require("../../utils/constants");

const questionSchema = new mongoose.Schema(
    {
        [TableFields.title]: {
            type: String,
            required: true,
            trim: true,
        },
        [TableFields.body]: {
            type: String,
            required: true,
        },
        [TableFields.tags]: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],
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

questionSchema.index({
    [TableFields.title]: "text",
    [TableFields.body]: "text",
    [TableFields.tags]: "text",
});

const Question = mongoose.model(TableNames.Question, questionSchema);

module.exports = Question;
