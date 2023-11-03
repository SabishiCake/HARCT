/**
 * @fileoverview Manages different room types in a hotel.
 * @module routes/roomTypes
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const router = express.Router();
const db = require('../../db');

/**
 * Route to get all room types.
 * @name GET/roomTypes
 * @function
 * @memberof module:routes/roomTypes
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM room_types';

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving room types' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to add a new room type.
 * @name POST/roomTypes
 * @function
 * @memberof module:routes/roomTypes
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.TypeName - The name of the room type.
 * @param {string} req.body.Description - The description of the room type.
 * @param {number} req.body.Rate - The rate of the room type.
 * @param {Object} res - The response object.
 */

router.post('/', (req, res) => {
  const { TypeName, Description, Rate } = req.body;

  const sql =
    'INSERT INTO room_types (TypeName, Description, Rate) VALUES (?, ?, ?)';
  const values = [TypeName, Description, Rate];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error adding room type' });
    } else {
      res.status(201).json({ message: 'Room type added successfully' });
    }
  });
});

/**
 * Route to delete a room type.
 * @name DELETE/roomTypes/:typeId
 * @function
 * @memberof module:routes/roomTypes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.typeId - The ID of the room type.
 * @param {Object} res - The response object.
 */

router.delete('/:typeId', (req, res) => {
  const typeId = req.params.typeId;
  const sql = 'DELETE FROM room_types WHERE TypeID = ?';

  db.query(sql, typeId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting room type' });
    } else {
      res.status(200).json({ message: 'Room type deleted successfully' });
    }
  });
});

module.exports = router;
