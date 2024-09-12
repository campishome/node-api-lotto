const express = require('express');
const router = express.Router();
const db = require("../dbconnect");


router.post('/insertResult', async (req, res) => {
    const { lottoNumber } = req.body;

    try {
        const [checkResult] = await db.query('SELECT * FROM LottoResult ORDER BY result_id ASC');
        
        if (checkResult.length === 5 && checkResult[0].result_id === 1 && checkResult[4].result_id === 5) {
            await db.query('DELETE FROM LottoResult');
        }
        const [maxResult] = await db.query('SELECT MAX(result_id) AS max_id FROM LottoResult');
        const nextResultId = (maxResult[0].max_id || 0) + 1; 

        await db.query('INSERT INTO LottoResult (result_id, result_number)) VALUES (?, ?)', [nextResultId, lottoNumber]);

        res.status(201).json({ message: 'Lotto result inserted successfully' });
    } catch (error) {
        console.error('Error inserting lotto result:', error);
        res.status(500).json({ message: 'Failed to insert lotto result' });
    }
});


module.exports = { router };