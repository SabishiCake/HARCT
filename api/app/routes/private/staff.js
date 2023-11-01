/**
 * @fileoverview Manages staff members in the database.
 * @module routes/staff
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();

/**
 * Route to create a new staff member.
 * @name POST/staff
 * @function
 * @memberof module:routes/staff
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.Name - The name of the staff member.
 * @param {string} req.body.Position - The position of the staff member.
 * @param {string} req.body.Email - The email address of the staff member.
 * @param {string} req.body.Phone - The phone number of the staff member.
 * @param {Object} res - The response object.
 */

router.post('/', (req, res) => {
  const { Name, Position, Email, Phone } = req.body;
  const sql =
    'INSERT INTO Staff (Name, Position, Email, Phone) VALUES (?, ?, ?, ?)';
  db.query(sql, [Name, Position, Email, Phone], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error adding staff member to database' });
    } else {
      res.status(200).json({ message: 'Staff member added to database' });
    }
  });
});

/**
 * Route to delete a staff member by StaffID.
 * @name DELETE/staff/:staffID
 * @function
 * @memberof module:routes/staff
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.staffID - The ID of the staff member.
 * @param {Object} res - The response object.
 */

router.delete('/:staffID', (req, res) => {
  const staffID = req.params.staffID;
  const sql = 'DELETE FROM Staff WHERE StaffID = ?';
  db.query(sql, [staffID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error deleting staff member from database' });
    } else {
      res.status(200).json({ message: 'Staff member deleted from database' });
    }
  });
});

/**
 * Route to get all staff members.
 * @name GET/staff
 * @function
 * @memberof module:routes/staff
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM Staff';
  db.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving staff members from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to get a staff member by StaffID.
 * @name GET/staff/:staffID
 * @function
 * @memberof module:routes/staff
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.staffID - The ID of the staff member.
 * @param {Object} res - The response object.
 */

router.get('/:staffID', (req, res) => {
  const staffID = req.params.staffID;
  const sql = 'SELECT * FROM Staff WHERE StaffID = ?';
  db.query(sql, [staffID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving staff member from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to update a staff member by StaffID.
 * @name PUT/staff/:staffID
 * @function
 * @memberof module:routes/staff
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.staffID - The ID of the staff member.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.Name - The name of the staff member.
 * @param {string} req.body.Position - The position of the staff member.
 * @param {string} req.body.Email - The email address of the staff member.
 * @param {string} req.body.Phone - The phone number of the staff member.
 * @param {Object} res - The response object.
 */

router.put('/:staffID', (req, res) => {
  const staffID = req.params.staffID;
  const { Name, Position, Email, Phone } = req.body;
  const sql =
    'UPDATE Staff SET Name = ?, Position = ?, Email = ?, Phone = ? WHERE StaffID = ?';
  db.query(sql, [Name, Position, Email, Phone, staffID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error updating staff member in database' });
    } else {
      res.status(200).json({ message: 'Staff member updated in database' });
    }
  });
});

module.exports = router;
