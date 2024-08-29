const express = require("express");
const cors = require("cors");
const index = require("./API/login").router;
const index = require("./API/test").router;

const bodyParser = require("body-parser");

const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.use(bodyParser.json());
app.use("/", test);
app.use("/login", login);



module.exports = app;
