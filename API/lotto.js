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

router.get('/allNumber', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT lotto_number FROM LottoAll');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching lotto');
    }
});

router.get('/readyToSell', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT lotto_id,lotto_number FROM LottoAll WHERE lotto_status != "ถูกซื้อไปแล้ว"');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching lotto');
    }
});

router.get('/allPurchase', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM LottoBought');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching lotto');
    }
});

router.post('/statusCheck', async (req, res) => {
    const { lotto_number } = req.body; // Destructuring phone and password from request body

    try {
        const query = 'SELECT lotto_status FROM LottoAll WHERE lotto_number = ?';
        const [rows] = await db.query(query, [lotto_number]);

        if (rows.length > 0) {
            res.json(rows[0]); // Return the first matching number
        } else {
            res.status(404).send('Number not found');
        }
    } catch (error) {
        console.error('Error fetching Lotto:', error.message); // Log the error for debugging
        res.status(500).send('Error fetching Lotto');
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
    //check ว่าเงินพอซื้อไหม
    //พอ    insert lottoBought res สำเร็จ
    //ไม่พอ  res เติมเงิน
    try {
        const checkQueryWallet = 'SELECT user_wallet FROM Customer WHERE user_id = ?';
        const [existingWallet] = await db.query(checkQueryWallet, [userId]);

        const checkQueryLotto = 'SELECT lotto_number,lotto_status FROM LottoAll WHERE lotto_id = ?';
        const [existingLotto] = await db.query(checkQueryLotto, [lottoId]);

        const checkQueryUser = 'SELECT user_name FROM Customer WHERE user_id = ?';
        const [existingUser] = await db.query(checkQueryUser, [userId]);
        

        if (existingUser.length <= 0 || existingLotto.length <= 0) {
            return res.status(400).json({ message: 'Lotto or User not exists' });
        }

        if(existingLotto[0].lotto_status == "ถูกซื้อไปแล้ว"){
            return res.status(400).json({ message: 'Lotto has been bought' });
        }
        const currentBalance = existingWallet[0].user_wallet;
        
        if (currentBalance - 100 < 0) { //ใบละ 100
            console.log('เงินไม่พอ กรุณาเติมเงิน'); // Log for debugging
            return res.status(400).json({ message: 'มันจะซื้อปายด้ายยางไงว้า เงินมันมีนิดเดียวน้า โผมว่ามันซื้อม่ายด้าย' });
        }

        const insertQuery = 'INSERT INTO LottoBought (lotto_id, user_id) VALUES (?, ?)';
        await db.query(insertQuery, [lottoId,userId]);

        const lottoStatus = "ถูกซื้อไปแล้ว"
        const updateStatus = 'UPDATE LottoAll SET lotto_status = ? WHERE lotto_id = ?';
        await db.query(updateStatus, [lottoStatus,lottoId]);

        const updateWallet = 'UPDATE Customer SET user_wallet = ? - 100 WHERE user_id = ?';
        await db.query(updateWallet, [currentBalance,userId]);

        res.status(201).json({ message: 'Purchase successfully' });
    } catch (error) {
        console.error('Error creating lotto:', error.message); // Log error details
        res.status(500).json({ message: 'Purchase Error', error: error.message });
    }
});

// const generateUniqueLottoNumbers = () => { //create random number  
//     const lottoNumbers = new Set();

//     while (lottoNumbers.size < 50) {
//         const number = Math.floor(100000 + Math.random() * 900000).toString();
//         lottoNumbers.add(number);
//     }

//     return Array.from(lottoNumbers);
// };

// router.post('/start', async (req, res) => {
//     const connection = await db.getConnection(); // Get a connection from the pool
//     try {
//         await connection.beginTransaction(); // Start transaction

//         const lottoNumbers = generateUniqueLottoNumbers();
//         const status = 'ยังไม่ถูกซื้อ';

//         const insertLottoQuery = `INSERT INTO LottoAll (lotto_number, lotto_status) VALUES (?, ?)`;

//         for (let number of lottoNumbers) {
//             await connection.execute(insertLottoQuery, [number, status]);
//         }
        
//         await connection.commit(); // Commit transaction
//         res.json({ lottoNumbers });
//     } catch (error) {
//         await connection.rollback(); // Rollback transaction
//         console.error('Error:', error); // Log the entire error object
//         res.status(500).send('Error generating and inserting lotto numbers');
//     } finally {
//         connection.release(); // Release the connection back to the pool
//     }
// });

router.delete('/deleteAllLottos', async (req, res) => {
    try {
        const [deleteBought] = await db.query('DELETE FROM LottoBought');
        const [deleteAll] = await db.query('DELETE FROM LottoAll');
        if (deleteBought.affectedRows > 0 || deleteAll.affectedRows > 0) {
            res.send(`All lotto records deleted successfully.`);
        } else {
            res.status(404).send('No lotto records found to delete.');
        }
    } catch (error) {
        res.status(500).send('Error deleting lotto');
    }
});


module.exports = { router };