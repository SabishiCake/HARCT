/**
 * @fileoverview Provides routes to manage reservations in the database.
 * @module routes/reservations
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();

/**
 * Route to create a new reservation.
 * @name POST/reservations
 * @function
 * @memberof module:routes/reservations
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.GuestID - The ID of the guest making the reservation.
 * @param {string} req.body.RoomID - The ID of the room reserved.
 * @param {string} req.body.CheckInDate - The check-in date for the reservation.
 * @param {string} req.body.CheckOutDate - The check-out date for the reservation.
 * @param {number} req.body.TotalCost - The total cost of the reservation.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to delete a reservation by ReservationID.
 * @name DELETE/reservations/:reservationID
 * @function
 * @memberof module:routes/reservations
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.reservationID - The ID of the reservation to be deleted.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to get all reservations.
 * @name GET/reservations
 * @function
 * @memberof module:routes/reservations
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to get a reservation by ReservationID.
 * @name GET/reservations/:reservationID
 * @function
 * @memberof module:routes/reservations
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.reservationID - The ID of the reservation to be retrieved.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to get a reservation by GuestID.
 * @name GET/reservations/guest/:guestID
 * @function
 * @memberof module:routes/reservations
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.guestID - The ID of the guest for whom reservations are to be retrieved.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to update a reservation by ReservationID.
 * @name PUT/reservations/:reservationID
 * @function
 * @memberof module:routes/reservations
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.reservationID - The ID of the reservation to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.GuestID - The ID of the guest making the reservation.
 * @param {string} req.body.RoomID - The ID of the room reserved.
 * @param {string} req.body.CheckInDate - The check-in date for the reservation.
 * @param {string} req.body.CheckOutDate - The check-out date for the reservation.
 * @param {number} req.body.TotalCost - The total cost of the reservation.
 * @param {Object} res - The response object.
 */

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
