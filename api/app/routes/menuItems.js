const express = require('express');
const db = require('../db');
const router = express.Router();
const id = require(__dirname + '/../utils/intUUID.js');

// Create a new menu item
router.post('/', (req, res) => {
    const { Name, Description, Price } = req.body;
    const MenuItemID = id();
    const sql = 'INSERT INTO MenuItems (ItemID, Name, Description, Price) VALUES (?, ?, ?, 2)';
    db.query(sql, [Name, Description, Price], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error adding menu item to database' });
        } else {
            res.status(200).json({ message: 'Menu item added to database' });
        }
    });
});

// Get all menu items
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM MenuItems';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving menu items from database' });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;