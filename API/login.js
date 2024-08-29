const express = require("express");
const { conn, queryAsync } = require("../dbconnect");
const mysql = require("mysql");
const { userReq } = require("../Model/insertModel");

const router = express.Router();

router.get("/", (req, res) => {
  conn.query('SELECT * FROM User', (err, result, fields) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Database query failed');
      return;
    }
    res.json(result);
  });
});

module.exports = router;
