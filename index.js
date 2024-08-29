const express = require("express");
const app = express();
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`API LISTENING ON PORT ${PORT}`);
});
// const cors = require("cors");
// const loginRouter = require("./API/login").router; 
// const testRouter = require("./API/test").router;   
// const bodyParser = require("body-parser");


// app.use(
//     cors({
//         origin: "*",
//     })
// );

app.get('/', (req, res) => {
    res.send('Welcome to my API UWU.');
});

// app.use(bodyParser.json());
// app.use("/", testRouter); 
// app.use("/login", loginRouter); 

module.exports = app;
