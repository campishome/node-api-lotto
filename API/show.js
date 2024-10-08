const express = require('express');
const router = express.Router();
const db = require("../dbconnect");

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT user_email FROM Customer');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching email');
    }
});

module.exports = { router };