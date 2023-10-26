const express = require('express');
const db = require('../db');
const router = express.Router();

// Create a new reservation
router.post('/', (req, res) => {
    const { GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost } = req.body;
    const sql = 'INSERT INTO Reservation (GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error adding reservation to database' });
        } else {
            // Set the room as occupied
            const updateSql = 'UPDATE Room SET IsOccupied = true WHERE RoomID = ?';
            db.query(updateSql, [RoomID], (updateErr, updateResult) => {
                if (updateErr) {
                    res.status(500).json({ error: 'Error updating room status' });
                } else {
                    res.status(200).json({ message: 'Reservation added and room status updated' });
                }
            });
        }
    });
});

// Get all reservations
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Reservation';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving reservations from database' });
        } else {
            res.status(200).json(result);
        }
    });
});

// Get all occupied reservations
router.get('/occupied/', (req, res) => {
    const sql = `SELECT R.ReservationID, R.CheckInDate, R.CheckOutDate, G.FirstName, G.LastName, 
                Ro.RoomNumber, Ro.Type
                FROM Reservation R
                INNER JOIN Guest G ON R.GuestID = G.GuestID
                INNER JOIN Room Ro ON R.RoomID = Ro.RoomID
                WHERE Ro.IsOccupied = true`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving occupied reservations from database' });
        } else {
            res.status(200).json(result);
        }
    });
});

// Get all unoccupied reservations
router.get('/unoccupied/', (req, res) => {
    const sql = `SELECT R.ReservationID, R.CheckInDate, R.CheckOutDate, G.FirstName, G.LastName, 
                Ro.RoomNumber, Ro.Type
                FROM Reservation R
                INNER JOIN Guest G ON R.GuestID = G.GuestID
                INNER JOIN Room Ro ON R.RoomID = Ro.RoomID
                WHERE Ro.IsOccupied = false`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving occupied reservations from database' });
        } else {
            res.status(200).json(result);
        }
    });
});


module.exports = router;