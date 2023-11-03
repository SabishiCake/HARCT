/**
 * @fileoverview Provides routes to manage payments in the database.
 * @module routes/payments
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();

/**
 * Route to create a new payment.
 * @name POST/payments
 * @function
 * @memberof module:routes/payments
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.GuestID - The ID of the guest associated with the payment.
 * @param {number} req.body.Amount - The amount of the payment.
 * @param {string} req.body.PaymentDate - The date of the payment.
 * @param {Object} res - The response object.
 */

router.post('/', (req, res) => {
  const { GuestID, Amount, PaymentDate } = req.body;
  const sql =
    'INSERT INTO Payments (GuestID, Amount, PaymentDate) VALUES (?, ?, ?)';
  db.query(sql, [GuestID, Amount, PaymentDate], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error adding payment to database' });
    } else {
      res.status(200).json({ message: 'Payment added to database' });
    }
  });
});

/**
 * Route to delete a payment by PaymentID.
 * @name DELETE/payments/:paymentID
 * @function
 * @memberof module:routes/payments
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.paymentID - The ID of the payment to be deleted.
 * @param {Object} res - The response object.
 */

router.delete('/:paymentID', (req, res) => {
  const paymentID = req.params.paymentID;
  const sql = 'DELETE FROM Payments WHERE PaymentID = ?';
  db.query(sql, [paymentID], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting payment from database' });
    } else {
      res.status(200).json({ message: 'Payment deleted from database' });
    }
  });
});

/**
 * Route to get all payments.
 * @name GET/payments
 * @function
 * @memberof module:routes/payments
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM Payments';
  db.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving payments from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to get a payment by PaymentID.
 * @name GET/payments/:paymentID
 * @function
 * @memberof module:routes/payments
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.paymentID - The ID of the payment to be retrieved.
 * @param {Object} res - The response object.
 */

router.get('/:paymentID', (req, res) => {
  const paymentID = req.params.paymentID;
  const sql = 'SELECT * FROM Payments WHERE PaymentID = ?';
  db.query(sql, [paymentID], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving payment from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to update a payment by PaymentID.
 * @name PUT/payments/:paymentID
 * @function
 * @memberof module:routes/payments
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.paymentID - The ID of the payment to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.GuestID - The ID of the guest associated with the payment.
 * @param {number} req.body.Amount - The amount of the payment.
 * @param {string} req.body.PaymentDate - The date of the payment.
 * @param {Object} res - The response object.
 */

router.put('/:paymentID', (req, res) => {
  const paymentID = req.params.paymentID;
  const { GuestID, Amount, PaymentDate } = req.body;
  const sql =
    'UPDATE Payments SET GuestID = ?, Amount = ?, PaymentDate = ? WHERE PaymentID = ?';
  db.query(sql, [GuestID, Amount, PaymentDate, paymentID], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error updating payment in database' });
    } else {
      res.status(200).json({ message: 'Payment updated in database' });
    }
  });
});

module.exports = router;
