const express = require('express');
const router = express.Router();
const db = require("../dbconnect");
//username image
router.put('/update/:id', async (req, res) => {
    const userId = req.params.id;
    const { name,image } = req.body;

    try {
        const checkQuery = 'UPDATE Customer SET user_name = ?,user_image = ? WHERE user_id = ?';
        const [existingUser] = await db.query(checkQuery, [name,image,userId]);

        res.status(201).json({ message: 'Update data successfully' });
    } catch (error) {
        console.error('Error update data:', error.message); // Log error details
        res.status(500).json({ message: 'Error update data', error: error.message });
    }
});

router.delete('/deleteAllUsers', async (req, res) => {
    try {
        const [deleteUsers] = await db.query('DELETE FROM Customer');
        if (deleteUsers.affectedRows > 0 || deleteUsers.affectedRows > 0) {
            res.send(`All lotto records deleted successfully.`);
        } else {
            res.status(404).send('No lotto records found to delete.');
        }
    } catch (error) {
        res.status(500).send('Error deleting lotto');
    }
});

module.exports = { router };