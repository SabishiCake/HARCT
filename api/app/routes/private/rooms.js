/**
 * @fileoverview Provides routes to manage room details in the database.
 * @module routes/rooms
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const router = express.Router();
const db = require('../../db');

/**
 * Route to get all room details.
 * @name GET/rooms
 * @function
 * @memberof module:routes/rooms
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  // const sql = 'SELECT * FROM room_details';
  const roomSql = 'SELECT * FROM room_details';
  const typeSql = 'SELECT * FROM room_types WHERE type_id = ?';

  db.query(roomSql, (err, rooms) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving room details' });
    } else {
      rooms.forEach((room, index) => {
        db.query(typeSql, room.type_id, (err, type) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error retrieving room details' });
          } else {
            rooms[index].type = type[0];
            if (index === rooms.length - 1) {
              res.status(200).json(rooms);
            }
          }
        });
      });
    }
  });
});

/**
 * Route to get a room detail.
 * @name GET/rooms/:id
 * @function
 * @memberof module:routes/rooms
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the room detail to be retrieved.
 * @param {Object} res - The response object.
 * @returns {Object} The room detail.
 */

router.get('/:id', (req, res) => {
  const roomDetailId = req.params.id;
  const roomSql = 'SELECT * FROM room_details WHERE room_id = ?';
  const typeSql = 'SELECT * FROM room_types WHERE type_id = ?';

  db.query(roomSql, roomDetailId, (err, rooms) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving room details' });
    } else {
      rooms.forEach((room, index) => {
        db.query(typeSql, room.type_id, (err, type) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error retrieving room details' });
          } else {
            rooms[index].type = type[0];
            if (index === rooms.length - 1) {
              res.status(200).json(rooms);
            }
          }
        });
      });
    }
  });
});

/**
 * Route to get avaiable rooms.
 * @name GET/rooms/available
 * @function
 * @memberof module:routes/rooms
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/available', (req, res) => {
  const roomSql = 'SELECT * FROM room_details WHERE is_occupied = 1';
  const typeSql = 'SELECT * FROM room_types WHERE type_id = ?';

  db.query(roomSql, (err, rooms) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving room details' });
    } else {
      rooms.forEach((room, index) => {
        db.query(typeSql, room.type_id, (err, type) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error retrieving room details' });
          } else {
            rooms[index].type = type[0];
            if (index === rooms.length - 1) {
              res.status(200).json(rooms);
            }
          }
        });
      });
    }
  });
});

/**
 * Route to get unavaiable rooms.
 * @name GET/rooms/available
 * @function
 * @memberof module:routes/rooms
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/unavailable', (req, res) => {
  const roomSql = 'SELECT * FROM room_details WHERE is_occupied = 0';
  const typeSql = 'SELECT * FROM room_types WHERE type_id = ?';

  db.query(roomSql, (err, rooms) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving room details' });
    } else {
      rooms.forEach((room, index) => {
        db.query(typeSql, room.type_id, (err, type) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error retrieving room details' });
          } else {
            rooms[index].type = type[0];
            if (index === rooms.length - 1) {
              res.status(200).json(rooms);
            }
          }
        });
      });
    }
  });
});

/**
 * Route to add a new room detail.
 * @name POST/rooms
 * @function
 * @memberof module:routes/rooms
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
    'INSERT INTO room_details (room_number, type_id, is_occupied) VALUES (?, ?, ?)';
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
 * @name PUT/rooms/:id
 * @function
 * @memberof module:routes/rooms
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
    'UPDATE room_details SET room_number = ?, type_id = ?, is_occupied = ? WHERE room_id = ?';
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

router.put('/occupy/:id', (req, res) => {
  const roomDetailId = req.params.id;
  // const { IsOccupied } = req.body;
  const IsOccupied = 1;

  const sql = 'UPDATE room_details SET is_occupied = ? WHERE room_id = ?';
  const values = [IsOccupied, roomDetailId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating room detail' });
    } else {
      res.status(200).json({ message: 'Room detail updated successfully' });
    }
  });
});

router.put('/unOccupy/:id', (req, res) => {
  const roomDetailId = req.params.id;
  // const { IsOccupied } = req.body;
  const IsOccupied = 0;

  const sql = 'UPDATE room_details SET is_occupied = ? WHERE room_id = ?';
  const values = [IsOccupied, roomDetailId];

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
 * @name DELETE/rooms/:id
 * @function
 * @memberof module:routes/rooms
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the room detail to be deleted.
 * @param {Object} res - The response object.
 */

router.delete('/:id', (req, res) => {
  const roomDetailId = req.params.id;
  const sql = 'DELETE FROM room_details WHERE room_id = ?';

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
