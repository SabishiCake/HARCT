/**
 * @fileoverview Provides routes to manage room details in the database.
 * @module routes/roomDetails
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const router = express.Router();
const db = require('../../db');

/**
 * Route to get all room details.
 * @name GET/roomDetails
 * @function
 * @memberof module:routes/roomDetails
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM room_details';

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving room details' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to add a new room detail.
 * @name POST/roomDetails
 * @function
 * @memberof module:routes/roomDetails
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.RoomNumber - The room number.
 * @param {string} req.body.TypeID - The ID of the room type.
 * @param {boolean} req.body.IsOccupied - The occupancy status of the room.
 * @param {Object} res - The response object.
 */

router.post('/', (req, res) => {
  const { RoomNumber, TypeID, IsOccupied } = req.body;

  const sql =
    'INSERT INTO room_details (RoomNumber, TypeID, IsOccupied) VALUES (?, ?, ?)';
  const values = [RoomNumber, TypeID, IsOccupied];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error adding room detail' });
    } else {
      res.status(201).json({ message: 'Room detail added successfully' });
    }
  });
});

/**
 * Route to update a room detail.
 * @name PUT/roomDetails/:id
 * @function
 * @memberof module:routes/roomDetails
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the room detail to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.RoomNumber - The room number.
 * @param {string} req.body.TypeID - The ID of the room type.
 * @param {boolean} req.body.IsOccupied - The occupancy status of the room.
 * @param {Object} res - The response object.
 */

router.put('/:id', (req, res) => {
  const roomDetailId = req.params.id;
  const { RoomNumber, TypeID, IsOccupied } = req.body;

  const sql =
    'UPDATE room_details SET RoomNumber = ?, TypeID = ?, IsOccupied = ? WHERE RoomID = ?';
  const values = [RoomNumber, TypeID, IsOccupied, roomDetailId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating room detail' });
    } else {
      res.status(200).json({ message: 'Room detail updated successfully' });
    }
  });
});

/**
 * Route to delete a room detail.
 * @name DELETE/roomDetails/:id
 * @function
 * @memberof module:routes/roomDetails
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the room detail to be deleted.
 * @param {Object} res - The response object.
 */

router.delete('/:id', (req, res) => {
  const roomDetailId = req.params.id;
  const sql = 'DELETE FROM room_details WHERE RoomID = ?';

  db.query(sql, roomDetailId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting room detail' });
    } else {
      res.status(200).json({ message: 'Room detail deleted successfully' });
    }
  });
});

module.exports = router;
