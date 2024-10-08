const express = require("express");
const app = express();
const PORT = 4000;
//const db = require("./dbconnect");
const cors = require("cors");
const bodyParser = require("body-parser");

const loginRouter = require("./API/login").router; 
const testRouter = require("./API/test").router;
const lottoRouter = require("./API/lotto").router;
const walletRouter = require("./API/wallet").router;
const showRouter = require("./API/show").router;
const profileRouter = require("./API/profile").router;
const resultRouter = require("./API/result").router;
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
app.use("/lotto", lottoRouter);
app.use("/wallet", walletRouter);
app.use("/shows", showRouter);
app.use("/profile", profileRouter);
app.use("/result", resultRouter);  

module.exports = app;
