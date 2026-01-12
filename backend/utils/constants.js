const ValidationMsgs = (function () {
    function ValidationMsgs() {}
    ValidationMsgs.InvalidAuthToken = "The authentication token is invalid.";
    ValidationMsgs.ParametersError = "Invalid parameters.";
    ValidationMsgs.RecordNotFound = "No matching record was found.";
    ValidationMsgs.AccountAlreadyExists = "This account has already been registered.";
    ValidationMsgs.AccountNotRegistered = "This account is not registered.";
    ValidationMsgs.PasswordEmpty = "Password cannot be blanked.";
    ValidationMsgs.EmailEmpty = "Email cannot be blank.";
    ValidationMsgs.EmailInvalid = "Provided email address is invalid. ";
    ValidationMsgs.PhoneInvalid = "Provided phone number is invalid.";
    ValidationMsgs.PasswordInvalid = "Password is invalid.";
    ValidationMsgs.AuthFail = "Authentication failed. Please log in. ";
    ValidationMsgs.UnableToLogin = "Unable to login with provided credentials.";
    ValidationMsgs.DuplicateEmail = "Email already exists.";
    ValidationMsgs.UnauthorizedAccess = "You don't have permission to access this resource.";
    ValidationMsgs.InvalidUserId = "Invalid Uesr id.";
    return ValidationMsgs;
})();

const ResponseMessages = (function () {
    function ResponseMessages() {}
    ResponseMessages.Ok = "Ok";
    ResponseMessages.NotFound = "Data not found!";
    ResponseMessages.signInSuccess = "Sign In successfully!";
    ResponseMessages.signOutSuccess = "Sign Out successfully!";

    return ResponseMessages;
})();

const TableNames = (function () {
    function TableNames() {}
    TableNames.User = "users";
    TableNames.Question = "questions";
    TableNames.Answer = "answers";
    TableNames.Comment = "comments";
    TableNames.Vote = "votes";

    return TableNames;
})();

const TableFields = (function () {
    function TableFields() {}
    
    // Common fields
    TableFields.ID = "_id";
    TableFields.createdAt = "createdAt";
    TableFields.updatedAt = "updatedAt";
    
    // User specific fields
    TableFields.name_ = "name";
    TableFields.email = "email";
    TableFields.password = "password";
    TableFields.reputation = "reputation";
    
    // Question specific fields
    TableFields.title = "title";
    TableFields.body = "body";
    TableFields.tags = "tags";
    TableFields.author = "author";
    TableFields.score = "score";
    
    // Answer specific fields
    TableFields.question = "question";
    
    // Comment specific fields
    TableFields.targetType = "targetType";
    TableFields.targetId = "targetId";
    
    // Vote specific fields
    TableFields.user = "user";
    TableFields.value = "value";

    return TableFields;
})();

const ResponseStatus = (function () {
    function ResponseStatus() {}
    ResponseStatus.Failed = 0;
    ResponseStatus.Success = 200;
    ResponseStatus.BadRequest = 400;
    ResponseStatus.Unauthorized = 401;
    ResponseStatus.NotFound = 404;
    ResponseStatus.UpgradeRequired = 426;
    ResponseStatus.AccountDeactivated = 3001;
    ResponseStatus.InternalServerError = 500;
    ResponseStatus.ServiceUnavailable = 503;

    return ResponseStatus;
})();

const ApiResponseCode = (function () {
    function ApiResponseCode() {}
    ApiResponseCode.ClientOrServerError = 400;
    ApiResponseCode.ResponseSuccess = 200;
    ApiResponseCode.AuthError = 401;
    ApiResponseCode.UnderMaintenance = 503; // Service Unavailable
    ApiResponseCode.ForceUpdate = 409; // Version Control

    return ApiResponseCode;
})();

module.exports = {
    ValidationMsgs,
    TableNames,
    TableFields,
    ResponseStatus,
    ResponseMessages,
    ApiResponseCode,
};
