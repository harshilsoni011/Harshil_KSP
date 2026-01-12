const express = require("express");
const DBController = require("./db/mongoose");
const path = require("path");
const cors = require("cors");
const app = express();
const morgan = require("./utils/morgan");
const fs = require("fs");

app.use(cors());
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(
    express.urlencoded({
        extended: false,
        limit: "5gb",
        parameterLimit: 50000,
    }),
);

app.use(express.json({ limit: "1gb" }));

const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
    if (path.extname(file) === ".js") {
        app.use(require(path.join(routesPath, file)));
    }
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/static_files", express.static(path.join(__dirname, "../static_files")));
 
app.get("/", (req, res) => {
    res.sendStatus(200);
});

DBController.initConnection(async () => {
    const httpServer = require("http").createServer(app);

    httpServer.listen(process.env.PORT, async function () {
        console.log(`Server is running on ${process.env.HOST + ":" + process.env.PORT}`);
    });
});
