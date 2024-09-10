const express = require('express');
const router = express.Router();
const db = require("../dbconnect");

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM LottoAll');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching lotto');
    }
});

router.post('/createLotto', async (req, res) => {
    const { lottoNumber } = req.body;

    try {
        const checkQuery = 'SELECT lotto_id FROM LottoAll WHERE lotto_number = ?';
        const [existingUser] = await db.query(checkQuery, [lottoNumber]);
        const lottoStatus = "ยังไม่ถูกซื้อ"


        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Lotto already exists' });
        }

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
        const checkQueryLotto = 'SELECT lotto_number FROM LottoAll WHERE lotto_id = ?';
        const [existingLotto] = await db.query(checkQueryLotto, [lottoId]);
        const checkQueryUser = 'SELECT user_name FROM Customer WHERE user_id = ?';
        const [existingUser] = await db.query(checkQueryUser, [userId]);
        

        if (existingUser.length <= 0 || existingLotto.length <= 0) {
            return res.status(400).json({ message: 'Lotto or User not exists' });
        }

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

const generateUniqueLottoNumbers = () => { //create random number  
    const lottoNumbers = new Set();

    while (lottoNumbers.size < 50) {
        const number = Math.floor(100000 + Math.random() * 900000).toString();
        lottoNumbers.add(number);
    }

    return Array.from(lottoNumbers);
};

router.post('/start', async (req, res) => {
    try {
        const lottoNumbers = generateUniqueLottoNumbers();
        const status = 'ยังไม่ถูกซื้อ';

        const insertLottoQuery = `INSERT INTO LottoAll (lotto_number, lotto_status) VALUES (?, ?)`;

        for (let number of lottoNumbers) {
            await db.execute(insertLottoQuery, [number, status]);
        }
        
        res.json({ lottoNumbers });
    } catch (error) {
        await db.rollback();
        console.error('Error:', error.message);
        res.status(500).send('Error generating and inserting lotto numbers');
    }
});

module.exports = { router };