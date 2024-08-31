const express = require("express");
const app = express();
const PORT = 4000;
//const db = require("./dbconnect");
const cors = require("cors");
const bodyParser = require("body-parser");

const loginRouter = require("./API/login").router; 
const testRouter = require("./API/test").router;
const showRouter = require("./API/show").router;

app.use(
    cors({
        origin: "*",
    })
);

app.listen(PORT, () => {
    console.log(`API LISTENING ON PORT ${PORT}`);
});

 
// app.get('/', (req, res) => {
//     res.send('Welcome to my API UWU.');
// });

// app.get('/users', async (req, res) => {
//     try {
//         const [rows] = await db.query('SELECT * FROM User');
//         res.json(rows);
//     } catch (error) {
//         res.status(500).send('Error fetching users');
//     }
// });

app.use(bodyParser.json());
app.use("/", testRouter); 
app.use("/users", loginRouter);
app.use("/shows", showRouter); 

module.exports = app;
