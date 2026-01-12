const API = require("../utils/apiBuilder");
const AuthController = require("../controllers/ksp/AuthController");
const UserController = require("../controllers/ksp/UserController");

const router = API.configRoute("/users")

    .addPath("/register")
    .asPOST(AuthController.register)
    .build()

    .addPath("/login")
    .asPOST(AuthController.login)
    .build()


    .addPath("/top")
    .asGET(UserController.topUsers)
    .useUserAuth()
    .build()

    .addPath("/me")
    .asGET(UserController.me)
    .useUserAuth()
    .build()

    .getRouter();

module.exports = router;
