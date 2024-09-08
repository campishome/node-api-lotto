const express = require('express');
const router = express.Router();
const db = require("../dbconnect");

router.post('/add_money', async (req, res) => {
    const { userId,amount } = req.body;

    try {
        const updateWallet = 'UPDATE Customer SET user_wallet = user_wallet + ? WHERE user_id = ?';
        await db.query(updateWallet, [amount,userId]);

        res.status(201).json({ message: 'Deposit successfully' });
    } catch (error) {
        console.error('Deposit Error:', error.message); // Log error details
        res.status(500).json({ message: 'Deposit Error', error: error.message });
    }
});

router.post('/withdraw', async (req, res) => {
    const { userId,amount } = req.body;

    try {
        const checkBalanceQuery = 'SELECT user_wallet FROM Customer WHERE user_id = ?';
        const [user] = await db.query(checkBalanceQuery, [userId]);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentBalance = user.user_wallet;

        if (amount > currentBalance) {
            return res.status(400).json({ message: 'มันจะถอนไปด้ายยางงายวะ เงินมันมีนิ๊ดเดียวเองวะ โผมว่ามันถอนไปม่ายด้ายย' });
        }else{
            const updateWallet = 'UPDATE Customer SET user_wallet = user_wallet - ? WHERE user_id = ?';
            await db.query(updateWallet, [amount,userId]);

            return res.status(201).json({ message: 'Withdraw successfully' });
        }
    } catch (error) {
        console.error('Withdraw Error:', error.message); // Log error details
        res.status(500).json({ message: 'Withdraw Error', error: error.message });
    }
});

module.exports = { router };