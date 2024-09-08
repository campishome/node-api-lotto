const express = require('express');
const router = express.Router();
const db = require("../dbconnect");

router.post('/add_money', async (req, res) => {
    const { userId,amount } = req.body;

    try {
        const updateStatus = 'UPDATE Customer SET user_wallet = user_wallet + ? WHERE user_id = ?';
        await db.query(updateStatus, [userId,amount]);


        res.status(201).json({ message: 'Add money successfully' });
    } catch (error) {
        console.error('Add money Error:', error.message); // Log error details
        res.status(500).json({ message: 'Add money Error', error: error.message });
    }
});

module.exports = { router };