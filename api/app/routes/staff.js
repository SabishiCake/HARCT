// routes/staff.js

const express = require('express');
const db = require('../db');
const router = express.Router();

// Create a new staff member
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

// Delete staff member by StaffID
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

// Get all staff members
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

// Get staff member by StaffID
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

// Update staff member by StaffID
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
