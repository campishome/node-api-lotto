const express = require('express');
const router = express.Router();
const db = require("../dbconnect");

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT user_id,user_name,user_phone,user_email,user_wallet,user_type FROM Customer WHERE user_type != "a"');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});


router.post('/login', async (req, res) => {
    const { phone, password } = req.body; // Destructuring phone and password from request body

    try {
        const query = 'SELECT user_id, user_type, user_name,user_phone,user_email FROM Customer WHERE user_phone = ? AND user_password = ?';
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

router.post('/register', async (req, res) => {
    const { username, phone, email, password ,wallet} = req.body;

    // Validate input data
    if (!username || !phone || !email || !password || !wallet) {
        return res.status(400).json({ message: "All fields (username, phone, email, password,wallet) are required" });
    }

    try {
        // Check for existing user by phone or email
        const checkQuery = 'SELECT user_id FROM Customer WHERE user_phone = ?';
        const [existingUser] = await db.query(checkQuery, [phone]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists with this phone number or email' });
        }

        // Insert the new user
        const insertQuery = 'INSERT INTO Customer (user_name, user_phone, user_email, user_password, user_type,user_wallet) VALUES (?, ?, ?, ?, ? ,?)';
        await db.query(insertQuery, [username, phone, email, password, 'c',wallet]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error.message); // Log error details
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

//api check all phone
//

module.exports = { router };
