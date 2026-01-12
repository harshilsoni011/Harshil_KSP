const API = require("../utils/apiBuilder");
const QuestionController = require("../controllers/ksp/QuestionController");

const router = API.configRoute("/question")

    .addPath("")
    .asGET(QuestionController.list)
    .useUserAuth()
    .build()

    .addPath("")
    .asPOST(QuestionController.create)
    .useUserAuth()
    .build()

    .addPath("/:id")
    .asGET(QuestionController.details)
    .useUserAuth()
    .build()

    .getRouter();

module.exports = router;
