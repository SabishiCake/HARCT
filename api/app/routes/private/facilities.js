/**
 * @fileoverview Provides routes to manage room facilities in the database.
 * @module routes/Facilities
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const router = express.Router();
const db = require('../../db');

/**
 * Route to get all room facilities.
 * @name GET/Facilities
 * @function
 * @memberof module:routes/Facilities
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM facilities';

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving room facilities' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to add a new room facility.
 * @name POST/Facilities
 * @function
 * @memberof module:routes/Facilities
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.FacilityName - The name of the facility.
 * @param {string} req.body.Description - The description of the facility.
 * @param {Object} res - The response object.
 */

router.post('/', (req, res) => {
  const { FacilityName, Description } = req.body;

  const sql =
    'INSERT INTO facilities (facility_name, description) VALUES (?, ?)';
  const values = [FacilityName, Description];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error adding room facility' });
    } else {
      res.status(201).json({ message: 'Room facility added successfully' });
    }
  });
});

/**
 * Route to update a room facility.
 * @name PUT/Facilities/:id
 * @function
 * @memberof module:routes/Facilities
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the room facility to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.FacilityName - The name of the facility.
 * @param {string} req.body.Description - The description of the facility.
 * @param {Object} res - The response object.
 */

router.put('/:id', (req, res) => {
  const facilityId = req.params.id;
  const { FacilityName, Description } = req.body;

  const sql =
    'UPDATE facilities SET facility_name = ?, description = ? WHERE facility_id = ?';
  const values = [FacilityName, Description, facilityId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating room facility' });
    } else {
      res.status(200).json({ message: 'Room facility updated successfully' });
    }
  });
});

/**
 * Route to delete a room facility.
 * @name DELETE/Facilities/:id
 * @function
 * @memberof module:routes/Facilities
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the room facility to be deleted.
 * @param {Object} res - The response object.
 */

router.delete('/:id', (req, res) => {
  const facilityId = req.params.id;
  const sql = 'DELETE FROM facilities WHERE facility_id = ?';

  db.query(sql, facilityId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting room facility' });
    } else {
      res.status(200).json({ message: 'Room facility deleted successfully' });
    }
  });
});

module.exports = router;
