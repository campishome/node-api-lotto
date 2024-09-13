const mysql = require('mysql2');


const pool = mysql.createPool({
    host: "47.129.222.47",
    user: "camp",
    password: "camp",
    database: "mobile_project"
});


module.exports = pool.promise();
