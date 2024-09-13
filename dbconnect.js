const mysql = require('mysql2');


const pool = mysql.createPool({
    host: "http://47.129.222.47/",
    user: "web66_65011212009",
    password: "65011212009@csmsu",
    database: "web66_65011212009"
});


module.exports = pool.promise();
