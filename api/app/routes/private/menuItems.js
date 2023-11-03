/**
 * @fileoverview Provides routes to manage menu items in the database.
 * @module routes/menuItems
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();
const id = require('../../utils/intUUID');

/**
 * Route to create a new menu item.
 * @name POST/menuItems
 * @function
 * @memberof module:routes/menuItems
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.Name - The name of the menu item.
 * @param {string} req.body.Description - The description of the menu item.
 * @param {number} req.body.Price - The price of the menu item.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to delete a menu item by ItemID.
 * @name DELETE/menuItems/:itemID
 * @function
 * @memberof module:routes/menuItems
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.itemID - The ID of the menu item to be deleted.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to get all menu items.
 * @name GET/menuItems
 * @function
 * @memberof module:routes/menuItems
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to get a menu item by ItemID.
 * @name GET/menuItems/:itemID
 * @function
 * @memberof module:routes/menuItems
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.itemID - The ID of the menu item to be retrieved.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to update a menu item by ItemID.
 * @name PUT/menuItems/:itemID
 * @function
 * @memberof module:routes/menuItems
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.itemID - The ID of the menu item to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.Name - The name of the menu item.
 * @param {string} req.body.Description - The description of the menu item.
 * @param {number} req.body.Price - The price of the menu item.
 * @param {Object} res - The response object.
 */

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
