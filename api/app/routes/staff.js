// routes/staff.js

const express = require('express');
const db = require('../db');
const router = express.Router();

// Create a new staff member
router.post('/', (req, res) => {
    const { Name, Position, Email, Phone } = req.body;
    const sql = 'INSERT INTO Staff (Name, Position, Email, Phone) VALUES (?, ?, ?, ?)';
    db.query(sql, [Name, Position, Email, Phone], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error adding staff member to database' });
        } else {
            res.status(200).json({ message: 'Staff member added to database' });
        }
    });
});

// Get all staff members
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Staff';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving staff members from database' });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;
