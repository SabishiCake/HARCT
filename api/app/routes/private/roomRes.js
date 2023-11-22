/**
 * @fileoverview Provides routes to manage reservations in the database.
 * @module routes/roomRes
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();

/**
 * Route to create a new reservation.
 * @name POST/roomRes
 * @function
 * @memberof module:routes/roomRes
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
    'INSERT INTO room_reservations (guest_id, room_id, check_in_date, check_out_date, total_cost) VALUES (?, ?, ?, ?, ?)';
  db.query(
    sql,
    [GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost],

    (err, result) => {
      if (err) {
        res
          .status(500)
          .json({ error: 'Error adding room reservation to database' });
      } else {
        res.status(200).json({
          message: 'Room reservation added and room status updated',
        });
      }
      // (err, result) => {
      //   if (err) {
      //     res
      //       .status(500)
      //       .json({ error: 'Error adding room reservation to database' });
      //   } else {
      //     // Set the room as occupied
      //     const updateSql =
      //       'UPDATE room_details SET is_occupied = true WHERE room_id = ?';
      //     db.query(updateSql, [RoomID], (updateErr, updateResult) => {
      //       if (updateErr) {
      //         res
      //           .status(500)
      //           .json({ error: 'Error updating room reservation status' });
      //       } else {
      //         res.status(200).json({
      //           message: 'Room reservation added and room status updated',
      //         });
      //       }
      //     });
      //   }
    }
  );
});

/**
 * Route to delete a reservation by reservation_id.
 * @name DELETE/roomRes/:reservationID
 * @function
 * @memberof module:routes/roomRes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.reservationID - The ID of the reservation to be deleted.
 * @param {Object} res - The response object.
 */

router.delete('/:reservationID', (req, res) => {
  const reservationID = req.params.reservationID;
  const sql = 'DELETE FROM room_reservations WHERE reservation_id = ?';
  db.query(sql, [reservationID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error deleting room reservation from database' });
    } else {
      res
        .status(200)
        .json({ message: 'Room reservation deleted from database' });
    }
  });
});

/**
 * Route to get all reservations.
 * @name GET/roomRes
 * @function
 * @memberof module:routes/roomRes
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM room_reservations';
  db.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving room reservations from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to get a reservation by reservation_id.
 * @name GET/roomRes/:reservationID
 * @function
 * @memberof module:routes/roomRes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.reservationID - The ID of the reservation to be retrieved.
 * @param {Object} res - The response object.
 */

router.get('/:reservationID', (req, res) => {
  const reservationID = req.params.reservationID;
  const sql = 'SELECT * FROM room_reservations WHERE reservation_id = ?';
  db.query(sql, [reservationID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving room reservation from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to get a reservation by GuestID.
 * @name GET/roomRes/guest/:guestID
 * @function
 * @memberof module:routes/roomRes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.guestID - The ID of the guest for whom reservations are to be retrieved.
 * @param {Object} res - The response object.
 */

router.get('/guest/:guestID', (req, res) => {
  const guestID = req.params.guestID;
  const sql = 'SELECT * FROM room_reservations WHERE Guest_ID = ?';
  db.query(sql, [guestID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving room reservation from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to update a reservation by reservation_id.
 * @name PUT/roomRes/:reservationID
 * @function
 * @memberof module:routes/roomRes
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
    'UPDATE room_reservations SET guest_id = ?, room_id = ?, check_in_date = ?, check_out_date = ?, total_cost = ? WHERE reservation_id = ?';
  db.query(
    sql,
    [GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost, reservationID],
    (err, result) => {
      if (err) {
        res
          .status(500)
          .json({ error: 'Error updating reservation in database' });
      } else {
        res
          .status(200)
          .json({ message: 'Room reservation updated in database' });
      }
    }
  );
});

module.exports = router;
