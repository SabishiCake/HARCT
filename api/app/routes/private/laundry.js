/**
 * @fileoverview Provides routes to manage laundry items and orders in the database.
 * @module routes/laundry
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();

/**
 * Route to get all laundry items.
 * @name GET/laundry/items
 * @function
 * @memberof module:routes/laundry
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/items', (req, res) => {
  const sql = 'SELECT * FROM laundryitems';
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving laundry items from the database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to add a new laundry item.
 * @name POST/laundry/items
 * @function
 * @memberof module:routes/laundry
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.OrderID - The ID of the order associated with the laundry item.
 * @param {string} req.body.ItemName - The name of the laundry item.
 * @param {number} req.body.Quantity - The quantity of the laundry item.
 * @param {string} req.body.Status - The status of the laundry item.
 * @param {Object} res - The response object.
 */

router.post('/items', (req, res) => {
  const { OrderID, ItemName, Quantity, Status } = req.body;
  const sql =
    'INSERT INTO laundryitems (OrderID, ItemName, Quantity, Status) VALUES (?, ?, ?, ?)';
  db.query(sql, [OrderID, ItemName, Quantity, Status], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error adding laundry item to the database' });
    } else {
      res.status(200).json({ message: 'Laundry item added successfully' });
    }
  });
});

/**
 * Route to update a laundry item by ItemID.
 * @name PUT/laundry/items/:id
 * @function
 * @memberof module:routes/laundry
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the laundry item to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.OrderID - The ID of the order associated with the laundry item.
 * @param {string} req.body.ItemName - The name of the laundry item.
 * @param {number} req.body.Quantity - The quantity of the laundry item.
 * @param {string} req.body.Status - The status of the laundry item.
 * @param {Object} res - The response object.
 */

router.put('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const { OrderID, ItemName, Quantity, Status } = req.body;
  const sql =
    'UPDATE laundryitems SET OrderID = ?, ItemName = ?, Quantity = ?, Status = ? WHERE ItemID = ?';
  db.query(
    sql,
    [OrderID, ItemName, Quantity, Status, itemId],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: 'Error updating laundry item in the database' });
      } else {
        res.status(200).json({ message: 'Laundry item updated successfully' });
      }
    }
  );
});

/**
 * Route to delete a laundry item by ItemID.
 * @name DELETE/laundry/items/:id
 * @function
 * @memberof module:routes/laundry
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the laundry item to be deleted.
 * @param {Object} res - The response object.
 */

router.delete('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const sql = 'DELETE FROM laundryitems WHERE ItemID = ?';
  db.query(sql, [itemId], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error deleting laundry item from the database' });
    } else {
      res.status(200).json({ message: 'Laundry item deleted successfully' });
    }
  });
});

/**
 * Route to get all laundry orders.
 * @name GET/laundry/orders
 * @function
 * @memberof module:routes/laundry
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/orders', (req, res) => {
  const sql = 'SELECT * FROM laundryorders';
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving laundry orders from the database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to add a new laundry order.
 * @name POST/laundry/orders
 * @function
 * @memberof module:routes/laundry
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.GuestID - The ID of the guest associated with the laundry order.
 * @param {string} req.body.PickupDate - The pickup date of the laundry order.
 * @param {string} req.body.DeliveryDate - The delivery date of the laundry order.
 * @param {string} req.body.Status - The status of the laundry order.
 * @param {Object} res - The response object.
 */

router.post('/orders', (req, res) => {
  const { GuestID, PickupDate, DeliveryDate, Status } = req.body;
  const sql =
    'INSERT INTO laundryorders (GuestID, PickupDate, DeliveryDate, Status) VALUES (?, ?, ?, ?)';
  db.query(sql, [GuestID, PickupDate, DeliveryDate, Status], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error adding laundry order to the database' });
    } else {
      res.status(200).json({ message: 'Laundry order added successfully' });
    }
  });
});

/**
 * Route to update a laundry order by OrderID.
 * @name PUT/laundry/orders/:id
 * @function
 * @memberof module:routes/laundry
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the laundry order to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.GuestID - The ID of the guest associated with the laundry order.
 * @param {string} req.body.PickupDate - The pickup date of the laundry order.
 * @param {string} req.body.DeliveryDate - The delivery date of the laundry order.
 * @param {string} req.body.Status - The status of the laundry order.
 * @param {Object} res - The response object.
 */

router.put('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const { GuestID, PickupDate, DeliveryDate, Status } = req.body;
  const sql =
    'UPDATE laundryorders SET GuestID = ?, PickupDate = ?, DeliveryDate = ?, Status = ? WHERE OrderID = ?';
  db.query(
    sql,
    [GuestID, PickupDate, DeliveryDate, Status, orderId],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: 'Error updating laundry order in the database' });
      } else {
        res.status(200).json({ message: 'Laundry order updated successfully' });
      }
    }
  );
});

/**
 * Route to delete a laundry order by OrderID.
 * @name DELETE/laundry/orders/:id
 * @function
 * @memberof module:routes/laundry
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the laundry order to be deleted.
 * @param {Object} res - The response object.
 */

router.delete('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const sql = 'DELETE FROM laundryorders WHERE OrderID = ?';
  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error deleting laundry order from the database' });
    } else {
      res.status(200).json({ message: 'Laundry order deleted successfully' });
    }
  });
});

module.exports = router;
