const express = require('express');
const db = require('../db');
const router = express.Router();

// Create a new order item
router.post('/', (req, res) => {
    const { OrderID, ItemID, Quantity } = req.body;
    const sql = 'INSERT INTO OrderItems (OrderID, ItemID, Quantity) VALUES (?, ?, ?)';
    db.query(sql, [OrderID, ItemID, Quantity], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error adding order item to database' });
        } else {
            res.status(200).json({ message: 'Order item added to database' });
        }
    });
});

// Get all order items
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM OrderItems';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving order items from database' });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;
