const express = require('express');
const db = require('../../db');
const router = express.Router();
const id = require('../../utils/intUUID');

// Create a new menu item
router.post('/', (req, res) => {
  const { Name, Description, Price } = req.body;
  const MenuItemID = id();
  const sql =
    'INSERT INTO MenuItems (ItemID, Name, Description, Price) VALUES (?, ?, ?, 2)';
  db.query(sql, [Name, Description, Price], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error adding menu item to database' });
    } else {
      res.status(200).json({ message: 'Menu item added to database' });
    }
  });
});

// Delete menu item by ItemID
router.delete('/:itemID', (req, res) => {
  const itemID = req.params.itemID;
  const sql = 'DELETE FROM MenuItems WHERE ItemID = ?';
  db.query(sql, [itemID], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting menu item from database' });
    } else {
      res.status(200).json({ message: 'Menu item deleted from database' });
    }
  });
});

// Get all menu items
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM MenuItems';
  db.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving menu items from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Get menu item by ItemID
router.get('/:itemID', (req, res) => {
  const itemID = req.params.itemID;
  const sql = 'SELECT * FROM MenuItems WHERE ItemID = ?';
  db.query(sql, [itemID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving menu item from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Update menu item by ItemID
router.put('/:itemID', (req, res) => {
  const itemID = req.params.itemID;
  const { Name, Description, Price } = req.body;
  const sql =
    'UPDATE MenuItems SET Name = ?, Description = ?, Price = ? WHERE ItemID = ?';
  db.query(sql, [Name, Description, Price, itemID], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error updating menu item in database' });
    } else {
      res.status(200).json({ message: 'Menu item updated in database' });
    }
  });
});

module.exports = router;
