const express = require('express');
const db = require('../db');
const router = express.Router();

// Create a new payment
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

// Delete payment by PaymentID
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

// Get all payments
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

// Get payment by PaymentID
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

// Update payment by PaymentID
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
