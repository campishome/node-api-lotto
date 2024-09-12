const express = require('express');
const router = express.Router();
const db = require("../dbconnect");


router.post('/insertResult', async (req, res) => {
    const { lottoId } = req.body;

    try {
        const [checkResult] = await db.query('SELECT * FROM LottoResult');
        if (checkResult.length >= 5) {
            await LottoResult.destroy({
                order: [['result_id', 'ASC']],
                limit: 1
            });
        }
        await LottoResult.create({
            lotto_id: lottoId
        });

        res.status(201).json({ message: 'Lotto result inserted successfully' });
    } catch (error) {
        console.error('Error inserting lotto result:', error);
        res.status(500).json({ message: 'Failed to insert lotto result' });
    }

});
module.exports = { router };