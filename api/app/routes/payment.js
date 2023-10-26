
const express = require('express');
const db = require('../db');
const router = express.Router();

// Create a new payment
router.post('/', (req, res) => {
    const { GuestID, Amount, PaymentDate } = req.body;
    const sql = 'INSERT INTO Payments (GuestID, Amount, PaymentDate) VALUES (?, ?, ?)';
    db.query(sql, [GuestID, Amount, PaymentDate], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error adding payment to database' });
        } else {
            res.status(200).json({ message: 'Payment added to database' });
        }
    });
});

// Get all payments
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Payments';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving payments from database' });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;
