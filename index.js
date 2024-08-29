const express = require("express");
const cors = require("cors");
const loginRouter = require("./API/login").router; // Correct path and variable name
const testRouter = require("./API/test").router;   // Correct path and variable name

const bodyParser = require("body-parser");

const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.use(bodyParser.json());
app.use("/", testRouter);   // Use the testRouter here
app.use("/login", loginRouter); // Use the loginRouter here

module.exports = app;
