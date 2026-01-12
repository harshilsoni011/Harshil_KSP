const UserService = require("../../db/services/UserService");
const ValidationError = require("../../utils/ValidationError");
const { TableFields, ValidationMsgs } = require("../../utils/constants");

exports.register = async (req) => {
    console.log("req.body",req.body)
    const name = req.body[TableFields.name_];
    const email = req.body[TableFields.email];
    const password = req.body[TableFields.password];

    const user = await UserService.createUser({ name, email, password });
    const token = user.createAuthToken();

    return { user, token };
};

exports.login = async (req) => {
    const email = req.body[TableFields.email];
    const password = req.body[TableFields.password];

    if (!email || !password) {
        throw new ValidationError(ValidationMsgs.EmailEmpty || "Email and password are required");
    }

    const user = await UserService.findByEmail(email);
    if (!user) {
        throw new ValidationError(ValidationMsgs.UnableToLogin);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ValidationError(ValidationMsgs.UnableToLogin);
    }

    const token = user.createAuthToken();

    return { user, token };
};