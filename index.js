const express = require("express");
const cors = require("cors");
const loginRouter = require("./API/login").router; 
const testRouter = require("./API/test").router;   
const bodyParser = require("body-parser");

const app = express();

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`API LISTENING ON PORT ${PORT}`);
});

app.use(
    cors({
        origin: "*",
    })
);


app.use(bodyParser.json());
app.use("/", testRouter); 
app.use("/login", loginRouter); 

module.exports = app;
