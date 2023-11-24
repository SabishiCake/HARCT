/**
 * Why does this exists? What does it do?
 *
 * The room_facility_mapping table serves as an intermediary or mapping table that
 * establishes a many-to-many relationship between the rooms available in the hotel
 * and the various facilities offered by the establishment.
 *
 * It allows for the association of specific facilities with specific rooms,
 * enabling efficient management and retrieval of data concerning the availability
 * of facilities in each room
 *
 * Its a many-to-many relationship because a room can have many facilities and a facility can be in many rooms.
 * Sincerely, I know its confusing but I hope this helps.
 */

/**
 * @fileoverview Provides routes to manage the relationship between rooms and facilities in a hotel.
 * @module routes/roomFacilityMapping
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const router = express.Router();
const db = require('../../db');

/**
 * Route to get all room facility mappings.
 * @name GET/roomFacilityMapping
 * @function
 * @memberof module:routes/roomFacilityMapping
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM room_facility_mapping';

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: 'Error retrieving room facility mappings' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to add a new room facility mapping.
 * @name POST/roomFacilityMapping
 * @function
 * @memberof module:routes/roomFacilityMapping
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.RoomID - The ID of the room.
 * @param {string} req.body.FacilityID - The ID of the facility.
 * @param {Object} res - The response object.
 */

router.post('/', (req, res) => {
  const { RoomID, FacilityID } = req.body;

  const sql =
    'INSERT INTO room_facility_mapping (room_id, facility_id) VALUES (?, ?)';
  const values = [RoomID, FacilityID];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error adding room facility mapping' });
    } else {
      res
        .status(201)
        .json({ message: 'Room facility mapping added successfully' });
    }
  });
});

/**
 * Route to get a room facility mapping by room ID.
 * @name GET/roomFacilityMapping/:roomId
 * @function
 * @memberof module:routes/roomFacilityMapping
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.roomId - The ID of the room.
 *
 */

router.get('/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const sql = 'SELECT * FROM room_facility_mapping WHERE room_id = ?';

  db.query(sql, [roomId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving room facility mapping' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to delete a room facility mapping.
 * @name DELETE/roomFacilityMapping/:roomId/:facilityId
 * @function
 * @memberof module:routes/roomFacilityMapping
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.roomId - The ID of the room.
 * @param {string} req.params.facilityId - The ID of the facility.
 * @param {Object} res - The response object.
 */

router.delete('/:roomId/:facilityId', (req, res) => {
  const roomId = req.params.roomId;
  const facilityId = req.params.facilityId;
  const sql =
    'DELETE FROM room_facility_mapping WHERE room_id = ? AND facility_id = ?';

  db.query(sql, [roomId, facilityId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting room facility mapping' });
    } else {
      res
        .status(200)
        .json({ message: 'Room facility mapping deleted successfully' });
    }
  });
});

module.exports = router;
