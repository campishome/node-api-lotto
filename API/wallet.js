const express = require('express');
const router = express.Router();
const db = require("../dbconnect");

router.post('/add_money', async (req, res) => {
    const { userId, amount } = req.body;

    // Validate input
    if (typeof userId !== 'number' || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        // Update wallet
        const updateWallet = 'UPDATE Customer SET user_wallet = user_wallet + ? WHERE user_id = ?';
        const result = await db.query(updateWallet, [amount, userId]);

        // Check if the update affected any rows
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Success response
        res.status(200).json({ message: 'Deposit successfully' });
    } catch (error) {
        // Log the error and send a response
        console.error('Deposit Error:', error.message);
        res.status(500).json({ message: 'Deposit Error', error: error.message });
    }
});

router.post('/withdraw', async (req, res) => {
    const { userId,amount } = req.body;

    try {
        const checkBalanceQuery = 'SELECT user_wallet FROM Customer WHERE user_id = ?';
        const [result] = await db.query(checkBalanceQuery, [userId]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' }); // Ensure user exists
        }

        const currentBalance = result[0].user_wallet;

        if (amount > currentBalance) {
            console.log('Insufficient funds'); // Log for debugging
            return res.status(400).json({ message: 'มันจะถอนปายด้ายยางไงว้า เงินมันมีนิดเดียวน้า โผมว่ามันถอนม่ายด้าย' });
        }

        const updateWallet = 'UPDATE Customer SET user_wallet = user_wallet - ? WHERE user_id = ?';
        await db.query(updateWallet, [amount, userId]);

        res.status(201).json({ message: 'Withdraw successfully' });
    } catch (error) {
        console.error('Withdraw Error:', error.message); // Log error details
        res.status(500).json({ message: 'Withdraw Error', error: error.message });
    }
});

module.exports = { router };