const express = require('express');
const db = require('../db');
const router = express.Router();

// Create Room
router.post('/', (req, res) => {
    const { RoomID, RoomNumber, Type, Description, Price } = req.body;
    const sql = 'INSERT INTO Room (RoomID, RoomNumber, Type, Description, Price) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [RoomID, RoomNumber, Type, Description, Price], (err, result) => {
        if (err) {
            res.status(500).send('Error in saving room to database');
        } else {
            console.log('Room added to database');
            res.status(200).send('Room added to database');
        }
    });
});

// Get all Rooms
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Room';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving rooms from database');
        } else {
            res.status(200).send(result);
        }
    });
});

// Add more routes for updating and deleting room

module.exports = router;
