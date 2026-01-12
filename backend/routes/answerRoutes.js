const API = require("../utils/apiBuilder");
const AnswerController = require("../controllers/ksp/AnswerController");

const router = API.configRoute("/question")
    /**
     * -------------------------------------
     * Answer Routes
     * -------------------------------------
     */
    .addPath("/:id/answers")
    .asPOST(AnswerController.create)
    .useUserAuth()
    .build()

    .getRouter();

module.exports = router;
