/**
 * @fileoverview Provides routes to manage restaurant reservations in the database.
 * @module routes/tableRes
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const router = express.Router();
const db = require('../../db');
const intUUID = require('../../utils/intUUID');

/**
 * Route to get all restaurant reservations.
 * @name GET/tableRes
 * @function
 * @memberof module:routes/tableRes
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM table_reservations';

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

router.get('/:table_id', (req, res) => {
  const { table_id } = req.params;
  const fullTableInfo = `
  SELECT
    tr.reservation_id, tr.customer_name, tr.contact_info, tr.table_id, tr.reservation_date, tr.reservation_time, tr.num_of_guests, tr.status, tr.created_at, tr.updated_at,
    td.table_id, td.type_id, td.is_occupied, td.capacity,
    FROM table_reservations tr
    INNER JOIN tables_details td
    ON tr.table_id = td.table_id
    WHERE tr.table_id = ?
  `;

  db.query(fullTableInfo, [table_id], (err, result) => {
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

router.post('/', (req, res) => {
  const {
    reservation_id,
    customer_name,
    contact_info,
    table_id,
    reservation_date,
    reservation_time,
    num_of_guests,
    status,
    created_at,
    updated_at,
  } = req.body;

  const checkIfTableExists = 'SELECT * FROM tables_details WHERE table_id = ?';
  const sql =
    'INSERT INTO table_reservations (reservation_id, customer_name, contact_info, table_id, reservation_date, reservation_time, num_of_guests, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(checkIfTableExists, [table_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error checking if table exists' });
    } else {
      if (result.length > 0) {
        db.query(
          sql,
          [
            reservation_id,
            customer_name,
            contact_info,
            table_id,
            reservation_date,
            reservation_time,
            num_of_guests,
            status,
            created_at,
            updated_at,
          ],
          (err, result) => {
            if (err) {
              console.error(err);
              res
                .status(500)
                .json({ error: 'Error adding restaurant reservation' });
            } else {
              res.status(200).json(result);
            }
          }
        );
      } else {
        res.status(500).json({ error: 'Table does not exist' });
      }
    }
  });
});

module.exports = router;
