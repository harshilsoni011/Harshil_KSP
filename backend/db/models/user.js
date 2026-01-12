const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { TableNames, TableFields } = require("../../utils/constants");

const UserSchema = new mongoose.Schema(
    {
        [TableFields.name_]: {
            type: String,
            required: true,
            trim: true,
        },
        [TableFields.email]: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        [TableFields.password]: {
            type: String,
            required: true,
            minlength: 6,
        },
        [TableFields.reputation]: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret[TableFields.password];
                delete ret.__v;
            },
        },
    },
);

UserSchema.pre("save", async function (next) {
    if (this.isModified(TableFields.password)) {
        this[TableFields.password] = await bcrypt.hash(this[TableFields.password], 8);
    }
    next();
});

UserSchema.methods.comparePassword = function (user) {
    return bcrypt.compare(user, this[TableFields.password]);
};

UserSchema.methods.createAuthToken = function () {
    const secret = process.env.JWT_USER_PK;

    return jwt.sign(
        {
            id: this[TableFields.ID].toString(),
        },
        secret,
        { expiresIn: "7d" },
    );
};

const User = mongoose.model(TableNames.User, UserSchema);

module.exports = User;
