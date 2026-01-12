const API = require("../utils/apiBuilder");
const TagController = require("../controllers/ksp/TagController");

const router = API.configRoute("/tags")
    /**
     * -------------------------------------
     * Tag Routes
     * -------------------------------------
     */
    .addPath("/trending")
    .asGET(TagController.trending)
    .useUserAuth()
    .build()

    .getRouter();

module.exports = router;
