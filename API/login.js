const express = require('express');
const router = express.Router();
const db = require("../dbconnect");

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT user_id,user_type,user_name,phone FROM User');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});

router.post('/login', async (req, res) => {
    const { phone, password } = req.body; // Destructuring phone and password from request body

    try {
        const query = 'SELECT user_id, user_type, user_name, phone FROM User WHERE phone = ? AND password = ?';
        const [rows] = await db.query(query, [phone, password]);

        if (rows.length > 0) {
            res.json(rows[0]); // Return the first matching user
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error.message); // Log the error for debugging
        res.status(500).send('Error fetching user');
    }
});


module.exports = { router };
