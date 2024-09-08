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
        const insertQuery = 'INSERT INTO Lotto (lotto_number, lotto_status) VALUES (?, ?)';
        await db.query(insertQuery, [lottoNumber,lottoStatus]);

        res.status(201).json({ message: 'Creating lotto successfully' });
    } catch (error) {
        console.error('Error creating lotto:', error.message); // Log error details
        res.status(500).json({ message: 'Error creating lotto', error: error.message });
    }
});

module.exports = { router };