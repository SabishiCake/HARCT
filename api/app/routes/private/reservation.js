const express = require('express');
const db = require('../../db');
const router = express.Router();

// Create a new reservation
router.post('/', (req, res) => {
  const { GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost } = req.body;
  const sql =
    'INSERT INTO Reservation (GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost) VALUES (?, ?, ?, ?, ?)';
  db.query(
    sql,
    [GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error adding reservation to database' });
      } else {
        // Set the room as occupied
        const updateSql = 'UPDATE Room SET IsOccupied = true WHERE RoomID = ?';
        db.query(updateSql, [RoomID], (updateErr, updateResult) => {
          if (updateErr) {
            res.status(500).json({ error: 'Error updating room status' });
          } else {
            res
              .status(200)
              .json({ message: 'Reservation added and room status updated' });
          }
        });
      }
    }
  );
});

// Delete reservation by ReservationID
router.delete('/:reservationID', (req, res) => {
  const reservationID = req.params.reservationID;
  const sql = 'DELETE FROM Reservation WHERE ReservationID = ?';
  db.query(sql, [reservationID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error deleting reservation from database' });
    } else {
      res.status(200).json({ message: 'Reservation deleted from database' });
    }
  });
});

// Get all reservations
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM Reservation';
  db.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving reservations from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Get reservation by ReservationID
router.get('/:reservationID', (req, res) => {
  const reservationID = req.params.reservationID;
  const sql = 'SELECT * FROM Reservation WHERE ReservationID = ?';
  db.query(sql, [reservationID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving reservation from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Get reservation by GuestID
router.get('/guest/:guestID', (req, res) => {
  const guestID = req.params.guestID;
  const sql = 'SELECT * FROM Reservation WHERE GuestID = ?';
  db.query(sql, [guestID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving reservation from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Update reservation by ReservationID
router.put('/:reservationID', (req, res) => {
  const reservationID = req.params.reservationID;
  const { GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost } = req.body;
  const sql =
    'UPDATE Reservation SET GuestID = ?, RoomID = ?, CheckInDate = ?, CheckOutDate = ?, TotalCost = ? WHERE ReservationID = ?';
  db.query(
    sql,
    [GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost, reservationID],
    (err, result) => {
      if (err) {
        res
          .status(500)
          .json({ error: 'Error updating reservation in database' });
      } else {
        res.status(200).json({ message: 'Reservation updated in database' });
      }
    }
  );
});

module.exports = router;
