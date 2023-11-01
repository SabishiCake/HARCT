/**
 * @fileoverview Provides routes to manage order items in the database.
 * @module routes/orderItems
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();

/**
 * Route to create a new order item.
 * @name POST/orderItems
 * @function
 * @memberof module:routes/orderItems
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.OrderID - The ID of the order associated with the item.
 * @param {string} req.body.ItemID - The ID of the item in the order.
 * @param {number} req.body.Quantity - The quantity of the item in the order.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to delete an order item by OrderItemID.
 * @name DELETE/orderItems/:orderItemID
 * @function
 * @memberof module:routes/orderItems
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.orderItemID - The ID of the order item to be deleted.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to get all order items.
 * @name GET/orderItems
 * @function
 * @memberof module:routes/orderItems
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to get an order item by OrderItemID.
 * @name GET/orderItems/:orderItemID
 * @function
 * @memberof module:routes/orderItems
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.orderItemID - The ID of the order item to be retrieved.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to update an order item by OrderItemID.
 * @name PUT/orderItems/:orderItemID
 * @function
 * @memberof module:routes/orderItems
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.orderItemID - The ID of the order item to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.OrderID - The ID of the order associated with the item.
 * @param {string} req.body.ItemID - The ID of the item in the order.
 * @param {number} req.body.Quantity - The quantity of the item in the order.
 * @param {Object} res - The response object.
 */

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
