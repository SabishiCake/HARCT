/**
 * @fileoverview Provides routes to manage restaurant reservations in the database.
 * @module routes/restaurantReservations
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const router = express.Router();
const db = require('../../db');

/**
 * Route to get all restaurant reservations.
 * @name GET/restaurantReservations
 * @function
 * @memberof module:routes/restaurantReservations
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM reservations';

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: 'Error retrieving restaurant reservations' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to add a new restaurant reservation.
 * @name POST/restaurantReservations
 * @function
 * @memberof module:routes/restaurantReservations
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.GuestID - The ID of the guest making the reservation.
 * @param {number} req.body.TableNumber - The table number for the reservation.
 * @param {string} req.body.ReservationDate - The date of the reservation.
 * @param {Object} res - The response object.
 */

router.post('/', (req, res) => {
  const { GuestID, TableNumber, ReservationDate } = req.body;

  const sql =
    'INSERT INTO reservations (GuestID, TableNumber, ReservationDate) VALUES (?, ?, ?)';
  const values = [GuestID, TableNumber, ReservationDate];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error adding restaurant reservation' });
    } else {
      res
        .status(201)
        .json({ message: 'Restaurant reservation added successfully' });
    }
  });
});

/**
 * Route to update a restaurant reservation by ID.
 * @name PUT/restaurantReservations/:id
 * @function
 * @memberof module:routes/restaurantReservations
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the reservation to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.GuestID - The ID of the guest making the reservation.
 * @param {number} req.body.TableNumber - The table number for the reservation.
 * @param {string} req.body.ReservationDate - The date of the reservation.
 * @param {Object} res - The response object.
 */

router.put('/:id', (req, res) => {
  const reservationId = req.params.id;
  const { GuestID, TableNumber, ReservationDate } = req.body;

  const sql =
    'UPDATE reservations SET GuestID = ?, TableNumber = ?, ReservationDate = ? WHERE ReservationID = ?';
  const values = [GuestID, TableNumber, ReservationDate, reservationId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating restaurant reservation' });
    } else {
      res
        .status(200)
        .json({ message: 'Restaurant reservation updated successfully' });
    }
  });
});

/**
 * Route to delete a restaurant reservation by ID.
 * @name DELETE/restaurantReservations/:id
 * @function
 * @memberof module:routes/restaurantReservations
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the reservation to be deleted.
 * @param {Object} res - The response object.
 */

router.delete('/:id', (req, res) => {
  const reservationId = req.params.id;
  const sql = 'DELETE FROM reservations WHERE ReservationID = ?';

  db.query(sql, reservationId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting restaurant reservation' });
    } else {
      res
        .status(200)
        .json({ message: 'Restaurant reservation deleted successfully' });
    }
  });
});

module.exports = router;
