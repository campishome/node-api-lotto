const express = require("express");
const app = express();
const PORT = 4000;
//const db = require("./dbconnect");
const cors = require("cors");
const bodyParser = require("body-parser");

const loginRouter = require("./API/login").router; 
const testRouter = require("./API/test").router;
const showRouter = require("./API/show").router;
const lottoRouter = require("./API/lotto").router;

app.use(
    cors({
        origin: "*",
    })
);

app.listen(PORT, () => {
    console.log(`API LISTENING ON PORT ${PORT}`);
});

 
app.use(bodyParser.json());
app.use("/", testRouter); 
app.use("/users", loginRouter);
app.use("/shows", showRouter);
app.use("/lotto", lottoRouter); 

module.exports = app;
