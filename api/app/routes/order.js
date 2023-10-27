const express = require('express');
const db = require('../db');
const router = express.Router();

// Create a new order
router.post('/', (req, res) => {
  const { GuestID, OrderDate, TotalPrice } = req.body;
  const sql =
    'INSERT INTO Orders (GuestID, OrderDate, TotalPrice) VALUES (?, ?, ?)';
  db.query(sql, [GuestID, OrderDate, TotalPrice], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error adding order to database' });
    } else {
      res.status(200).json({ message: 'Order added to database' });
    }
  });
});

// Delete order by OrderID
router.delete('/:orderID', (req, res) => {
  const orderID = req.params.orderID;
  const sql = 'DELETE FROM Orders WHERE OrderID = ?';
  db.query(sql, [orderID], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting order from database' });
    } else {
      res.status(200).json({ message: 'Order deleted from database' });
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

// Get order by OrderID
router.get('/:orderID', (req, res) => {
  const orderID = req.params.orderID;
  const sql = 'SELECT * FROM Orders WHERE OrderID = ?';
  db.query(sql, [orderID], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving order from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Update order by OrderID
router.put('/:orderID', (req, res) => {
  const orderID = req.params.orderID;
  const { GuestID, OrderDate, TotalPrice } = req.body;
  const sql =
    'UPDATE Orders SET GuestID = ?, OrderDate = ?, TotalPrice = ? WHERE OrderID = ?';
  db.query(sql, [GuestID, OrderDate, TotalPrice, orderID], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error updating order in database' });
    } else {
      res.status(200).json({ message: 'Order updated in database' });
    }
  });
});

module.exports = router;
