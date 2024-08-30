const express = require('express');
const router = express.Router();
const db = require("./dbconnect");

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM User');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});

module.exports = { router };
