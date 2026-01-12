const express = require("express");
const userAuth = require("../middleware/userAuth");
const { ResponseStatus } = require("../utils/constants");
const ValidationError = require("../utils/ValidationError");

class API {
    static configRoute(root) {
        const router = new express.Router();

        return new PathBuilder(root, router);
    }
}

const MethodBuilder = class {
    constructor(root, subPath, router) {
        this.asGET = function (methodToExecute) {
            return new Builder("get", root, subPath, methodToExecute, router);
        };

        this.asPOST = function (methodToExecute) {
            return new Builder("post", root, subPath, methodToExecute, router);
        };

        this.asDELETE = function (methodToExecute) {
            return new Builder("delete", root, subPath, methodToExecute, router);
        };

        this.asUPDATE = function (methodToExecute) {
            return new Builder("patch", root, subPath, methodToExecute, router);
        };
    }
};

const PathBuilder = class {
    constructor(root, router) {
        this.addPath = function (subPath) {
            return new MethodBuilder(root, subPath, router);
        };
        this.getRouter = () => router;
        this.changeRoot = (newRoot) => {
            root = newRoot;

            return this;
        };
    }
};

const Builder = class {
    constructor(
        methodType,
        root,
        subPath,
        executer,
        router,
        useAuthMiddleware,
        duplicateErrorHandler,
        middlewaresList = [],
        useAdminAuth = false,
        useUserAuth = false,
    ) {

        this.useUserAuth = () =>
            new Builder(
                methodType,
                root,
                subPath,
                executer,
                router,
                useAuthMiddleware,
                duplicateErrorHandler,
                middlewaresList,
                useAdminAuth,
                true,
            );

        this.setDuplicateErrorHandler = (mDuplicateErrorHandler) =>
            new Builder(
                methodType,
                root,
                subPath,
                executer,
                router,
                useAuthMiddleware,
                mDuplicateErrorHandler,
                middlewaresList,
                useAdminAuth,
                useKspAuth,
            );

        this.userMiddlewares = (...middlewares) => {
            middlewaresList = [...middlewares];

            return new Builder(
                methodType,
                root,
                subPath,
                executer,
                router,
                useAuthMiddleware,
                duplicateErrorHandler,
                middlewaresList,
                useAdminAuth,
                useUserAuth,
            );
        };

        this.build = () => {
            const controller = async (req, res) => {
                try {
                    const response = await executer(req, res);

                    res.status(ResponseStatus.Success).send(response);
                } catch (e) {
                    const message = e?.message || "Bad request";

                    if (e && duplicateErrorHandler) {
                        res.locals.errorMessage = message;
                        return res
                            .status(ResponseStatus.InternalServerError)
                            .send({ error: duplicateErrorHandler(e) });
                    }

                    if (e && e.name !== ValidationError.name) {
                        console.error(e);
                    }

                    res.locals.errorMessage = e;
                    return res
                        .status(ResponseStatus.BadRequest)
                        .send({ error: message, name: e?.name });
                }
            };

            const middlewares = [...middlewaresList];

            if (useUserAuth) {
                middlewares.push(userAuth);
            }

            router[methodType](root + subPath, ...middlewares, controller);

            return new PathBuilder(root, router);
        };
    }
};

module.exports = API;
