const express = require('express');
const router = express.Router();
const db = require("../dbconnect");


router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM LottoResult');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching LottoResult');
    }
});

router.post('/insertResult', async (req, res) => {
    const { lottoNumber } = req.body;

    try {
        // Step 1: Fetch all records from LottoResult ordered by result_id
        const [checkResult] = await db.query('SELECT * FROM LottoResult ORDER BY result_id ASC');
        
        // Step 2: If there are 5 entries and the result_id ranges from 1 to 5
        if (checkResult.length === 5 && checkResult[0].result_id === 1 && checkResult[4].result_id === 5) {
            // Delete all records to reset the table
            await db.query('DELETE FROM LottoResult');
        }

        // Step 3: Fetch the maximum result_id
        const [maxResult] = await db.query('SELECT MAX(result_id) AS max_id FROM LottoResult');
        const nextResultId = (maxResult[0].max_id || 0) + 1; // Start from 1 if no rows exist

        // Step 4: Insert the new lotto result with the calculated result_id
        await db.query('INSERT INTO LottoResult (result_id, result_number) VALUES (?, ?)', [nextResultId, lottoNumber]);

        res.status(201).json({ message: 'Lotto result inserted successfully' });
    } catch (error) {
        console.error('Error inserting lotto result:', error); // Log the actual error
        res.status(500).json({ message: 'Failed to insert lotto result', error: error.message }); // Send error details in response
    }
});



module.exports = { router };