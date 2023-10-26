const express = require('express');
const db = require('../db');
const router = express.Router();

// Create a new order
router.post('/', (req, res) => {
    const { GuestID, OrderDate, TotalPrice } = req.body;
    const sql = 'INSERT INTO Orders (GuestID, OrderDate, TotalPrice) VALUES (?, ?, ?)';
    db.query(sql, [GuestID, OrderDate, TotalPrice], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error adding order to database' });
        } else {
            res.status(200).json({ message: 'Order added to database' });
        }
    });
});

// Get all orders
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Orders';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving orders from database' });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;
