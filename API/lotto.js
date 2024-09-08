const express = require('express');
const router = express.Router();
const db = require("../dbconnect");

router.post('/createLotto', async (req, res) => {
    const { lottoNumber } = req.body;

    try {
        // Check for existing user by phone or email
        const checkQuery = 'SELECT lotto_id FROM LottoAll WHERE lotto_number = ?';
        const [existingUser] = await db.query(checkQuery, [lottoNumber]);
        const lottoStatus = "ยังไม่ถูกซื้อ"


        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Lotto already exists' });
        }

        // Insert the new user
        const insertQuery = 'INSERT INTO LottoAll (lotto_number, lotto_status) VALUES (?, ?)';
        await db.query(insertQuery, [lottoNumber,lottoStatus]);

        res.status(201).json({ message: 'Creating lotto successfully' });
    } catch (error) {
        console.error('Error creating lotto:', error.message); // Log error details
        res.status(500).json({ message: 'Error creating lotto', error: error.message });
    }
});

router.post('/buyLotto', async (req, res) => {
    const { lottoId,userId } = req.body;

    try {
        // Check for existing lottoId and userId
        const checkQueryLotto = 'SELECT lotto_number FROM LottoAll WHERE lotto_id = ?';
        const [existingLotto] = await db.query(checkQueryLotto, [lottoId]);
        const checkQueryUser = 'SELECT user_name FROM Customer WHERE user_id = ?';
        const [existingUser] = await db.query(checkQueryUser, [userId]);
        

        if (existingUser.length <= 0 || existingLotto.length <= 0) {
            return res.status(400).json({ message: 'Lotto or User not exists' });
        }


        // Insert the new user
        const insertQuery = 'INSERT INTO LottoBought (lotto_id, user_id) VALUES (?, ?)';
        await db.query(insertQuery, [lottoId,userId]);

        const lottoStatus = "ถูกซื้อไปแล้ว"
        const updateStatus = 'UPDATE LottoAll SET lotto_status = ? WHERE lotto_id = ?';
        await db.query(updateStatus, [lottoStatus,lottoId]);


        res.status(201).json({ message: 'Purchase successfully' });
    } catch (error) {
        console.error('Error creating lotto:', error.message); // Log error details
        res.status(500).json({ message: 'Purchase Error', error: error.message });
    }
});

module.exports = { router };