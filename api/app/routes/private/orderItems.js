const express = require('express');
const db = require('../../db');
const router = express.Router();

// Create a new order item
router.post('/', (req, res) => {
  const { OrderID, ItemID, Quantity } = req.body;
  const sql =
    'INSERT INTO OrderItems (OrderID, ItemID, Quantity) VALUES (?, ?, ?)';
  db.query(sql, [OrderID, ItemID, Quantity], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error adding order item to database' });
    } else {
      res.status(200).json({ message: 'Order item added to database' });
    }
  });
});

// Delete order item by OrderItemID
router.delete('/:orderItemID', (req, res) => {
  const orderItemID = req.params.orderItemID;
  const sql = 'DELETE FROM OrderItems WHERE OrderItemID = ?';
  db.query(sql, [orderItemID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error deleting order item from database' });
    } else {
      res.status(200).json({ message: 'Order item deleted from database' });
    }
  });
});

// Get all order items
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM OrderItems';
  db.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving order items from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Get order item by OrderItemID
router.get('/:orderItemID', (req, res) => {
  const orderItemID = req.params.orderItemID;
  const sql = 'SELECT * FROM OrderItems WHERE OrderItemID = ?';
  db.query(sql, [orderItemID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving order item from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Update order item by OrderItemID
router.put('/:orderItemID', (req, res) => {
  const orderItemID = req.params.orderItemID;
  const { OrderID, ItemID, Quantity } = req.body;
  const sql =
    'UPDATE OrderItems SET OrderID = ?, ItemID = ?, Quantity = ? WHERE OrderItemID = ?';
  db.query(sql, [OrderID, ItemID, Quantity, orderItemID], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error updating order item in database' });
    } else {
      res.status(200).json({ message: 'Order item updated in database' });
    }
  });
});

module.exports = router;
