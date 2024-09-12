const express = require('express');
const router = express.Router();
const db = require("../dbconnect");


router.post('/insertResult', async (req, res) => {
    const { lottoId } = req.body;

    try {
        // Step 1: Check if there are already 5 results
        const [checkResult] = await db.query('SELECT * FROM LottoResult ORDER BY result_id ASC');
        
        if (checkResult.length >= 5) {
            // Step 2: Delete the oldest entry (the one with the smallest result_id)
            const oldestResultId = checkResult[0].result_id;
            await db.query('DELETE FROM LottoResult WHERE result_id = ?', [oldestResultId]);
        }

        // Step 3: Fetch the maximum result_id to generate the next result_id
        const [maxResult] = await db.query('SELECT MAX(result_id) AS max_id FROM LottoResult');
        const nextResultId = (maxResult[0].max_id || 0) + 1; // If no rows, start from 1

        // Step 4: Insert the new lotto result with a manually incremented result_id
        await db.query('INSERT INTO LottoResult (result_id, lotto_id) VALUES (?, ?)', [nextResultId, lottoId]);

        res.status(201).json({ message: 'Lotto result inserted successfully' });
    } catch (error) {
        console.error('Error inserting lotto result:', error);
        res.status(500).json({ message: 'Failed to insert lotto result' });
    }
});

module.exports = { router };