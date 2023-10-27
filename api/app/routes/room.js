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

// DELETE Room by RoomID
router.delete('/:roomID', (req, res) => {
    const roomID = req.params.roomID;
    const sql = 'DELETE FROM Room WHERE RoomID = ?';
    db.query(sql, [roomID], (err, result) => {
        if (err) {
            res.status(500).send('Error in deleting room from database');
        } else {
            console.log('Room deleted from database');
            res.status(200).send('Room deleted from database');
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


// Get Room by RoomID
router.get('/:roomID', (req, res) => {
    const roomID = req.params.roomID;
    const sql = 'SELECT * FROM Room WHERE RoomID = ?';
    db.query(sql, [roomID], (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving room from database');
        } else {
            res.status(200).send(result);
        }
    });
});

// Get all available Rooms
router.get('/available', (req, res) => {
    const sql = 'SELECT * FROM Room WHERE IsOccupied = false';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving available rooms from database');
        } else {
            res.status(200).send(result);
        }
    });
});

// Get all unavailable Rooms
router.get('/unavailable', (req, res) => {
    const sql = 'SELECT * FROM Room WHERE IsOccupied = true';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving unavailable rooms from database');
        } else {
            res.status(200).send(result);
        }
    });
});

// Update Room by RoomID
router.put('/:roomID', (req, res) => {
    const roomID = req.params.roomID;
    const { RoomNumber, Type, Description, Price, IsOccupied } = req.body;
    const sql = 'UPDATE Room SET RoomNumber = ?, Type = ?, Description = ?, Price = ?, IsOccupied = ?, WHERE RoomID = ?';
    db.query(sql, [RoomNumber, Type, Description, Price, IsOccupied, roomID], (err, result) => {
        if (err) {
            res.status(500).send('Error in updating room in database');
        } else {
            console.log('Room updated in database');
            res.status(200).send('Room updated in database');
        }
    });
});

// Update room as available by RoomID
router.put('/available/:roomID', (req, res) => {
    const roomID = req.params.roomID;
    const sql = 'UPDATE Room SET IsOccupied = false WHERE RoomID = ?';
    db.query(sql, [roomID], (err, result) => {
        if (err) {
            res.status(500).send('Error updating room status in database');
        } else {
            console.log('Room set as available in database');
            res.status(200).send('Room set as available in database');
        }
    });
});

// Update room as unavailable by RoomID
router.put('/unavailable/:roomID', (req, res) => {
    const roomID = req.params.roomID;
    const sql = 'UPDATE Room SET IsOccupied = true WHERE RoomID = ?';
    db.query(sql, [roomID], (err, result) => {
        if (err) {
            res.status(500).send('Error updating room status in database');
        } else {
            console.log('Room set as unavailable in database');
            res.status(200).send('Room set as unavailable in database');
        }
    });
});



module.exports = router;
