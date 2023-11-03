/**
 * @fileoverview Provides routes to manage orders in the database.
 * @module routes/orders
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();

/**
 * Route to create a new order.
 * @name POST/orders
 * @function
 * @memberof module:routes/orders
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.GuestID - The ID of the guest placing the order.
 * @param {string} req.body.OrderDate - The date of the order.
 * @param {number} req.body.TotalPrice - The total price of the order.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to delete an order by OrderID.
 * @name DELETE/orders/:orderID
 * @function
 * @memberof module:routes/orders
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.orderID - The ID of the order to be deleted.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to get an order by OrderID.
 * @name GET/orders/:orderID
 * @function
 * @memberof module:routes/orders
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.orderID - The ID of the order to be retrieved.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to update an order by OrderID.
 * @name PUT/orders/:orderID
 * @function
 * @memberof module:routes/orders
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.orderID - The ID of the order to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.GuestID - The ID of the guest placing the order.
 * @param {string} req.body.OrderDate - The date of the order.
 * @param {number} req.body.TotalPrice - The total price of the order.
 * @param {Object} res - The response object.
 */

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
