/**
 * @fileoverview Provides routes to manage payments
 * @module routes/payments
 * @requires express
 * @requires ../../db
 * @requires ../../utils/intUUID
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();
const intUUID = require('../../utils/intUUID');

router.post('/', (req, res) => {
  const sql = 'INSERT INTO payments SET ?';
  const payment = {
    payment_id: intUUID(),
    created_at: new Date(),
    updated_at: new Date(),
    guest_id: req.body.guest_id,
    amount: req.body.amount,
    payment_date: req.body.payment_date,
    payment_status: req.body.payment_status,
    reftransaction_id: req.body.reftransaction_id,
  };
  db.query(sql, payment, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error adding payment to the database' });
    } else {
      res.status(200).json({ message: 'Payment added successfully' });
    }
  });
});

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM payments';
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving all payments from the database' });
    } else {
      res.status(200).json(result);
    }
  });
});

router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM payments WHERE payment_id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving payment from the database' });
    } else {
      res.status(200).json(result);
    }
  });
});

router.get('/refTransId/:id', (req, res) => {
  // const sql = 'SELECT * FROM payments WHERE reftransaction_id = ?';
  // db.query(sql, [req.params.id], (err, result) => {
  //   if (err) {
  //     console.log(err);
  //     res
  //       .status(500)
  //       .json({ error: 'Error retrieving payment from the database' });
  //   } else {
  //     res.status(200).json(result);
  //   }
  // });

  if (
    req.params.id === 'undefined' ||
    req.params.id === 'null' ||
    !req.params.id
  ) {
    return res.status(200).json({ message: 'No payment found' });
  }

  const getFullPaymentInfoSql = `
    SELECT g.guest_id, g.last_name, g.first_name, g.email, g.phone, g.address,
            p.payment_id, p.reftransaction_id, p.created_at, p.updated_at, p.guest_id, p.amount, p.payment_date, p.payment_status, p.type, p.method

    FROM guest g
    INNER JOIN payments p ON g.guest_id = p.guest_id
    WHERE p.reftransaction_id = ?;
    `;

  try {
    db.query(getFullPaymentInfoSql, [req.params.id], (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: 'Error retrieving payment from the database' });
      } else {
        if (result.length === 0) {
          return res.status(200).json({ message: 'No payment found' });
        }

        const formattedPaymentResult = result.map((row) => {
          return {
            payment_id: row.payment_id,
            reftransaction_id: row.reftransaction_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
            guest_id: row.guest_id,
            amount: row.amount,
            payment_date: row.payment_date,
            payment_status: row.payment_status,
            type: row.type,
            payment_method: row.method,
          };
        });

        const formattedGuestResult = {
          guest_id: result[0].guest_id,
          last_name: result[0].last_name,
          first_name: result[0].first_name,
          email: result[0].email,
          phone: result[0].phone,
          address: result[0].address,

          payments: formattedPaymentResult,
        };

        res.status(200).json(formattedGuestResult);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/guest/:id', (req, res) => {
  const getFullPaymentInfoSql = `
    SELECT g.guest_id, g.last_name, g.first_name, g.email, g.phone, g.address,
            p.payment_id, p.reftransaction_id, p.created_at, p.updated_at, p.guest_id, p.amount, p.payment_date, p.payment_status, p.type, p.method

    FROM guest g
    INNER JOIN payments p ON g.guest_id = p.guest_id
    WHERE g.guest_id = ?;
    `;

  try {
    db.query(getFullPaymentInfoSql, [req.params.id], (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: 'Error retrieving payment from the database' });
      } else {
        const formattedPaymentResult = result.map((row) => {
          return {
            payment_id: row.payment_id,
            reftransaction_id: row.reftransaction_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
            guest_id: row.guest_id,
            amount: row.amount,
            payment_date: row.payment_date,
            payment_status: row.payment_status,
            type: row.type,
            payment_method: row.method,
          };
        });

        const formattedGuestResult = {
          guest_id: result[0].guest_id,
          last_name: result[0].last_name,
          first_name: result[0].first_name,
          email: result[0].email,
          phone: result[0].phone,
          address: result[0].address,

          payments: formattedPaymentResult,
        };

        res.status(200).json(formattedGuestResult);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.put('/:id', (req, res) => {
  const sql = 'UPDATE payments SET ? WHERE payment_id = ?';
  const payment = {
    updated_at: new Date(),
    guest_id: req.body.guest_id,
    amount: req.body.amount,
    payment_date: req.body.payment_date,
    payment_status: req.body.payment_status,
    method: req.body.method,
    reftransaction_id: req.body.reftransaction_id,
  };
  db.query(sql, [payment, req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error updating payment in the data base' });
    } else {
      res.status(200).json({ message: 'Payment updated successfully' });
    }
  });
});

router.put('/refTransId/:id', (req, res) => {
  const payment = {
    updated_at: new Date(),
    guest_id: req.body.guest_id,
    amount: req.body.amount,
    payment_date: req.body.payment_date,
    payment_status: req.body.payment_status,
    type: req.body.type,
    method: req.body.payment_method,
  };
  const sql = 'UPDATE payments SET ? WHERE reftransaction_id = ?';
  db.query(sql, [payment, req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error updating payment in the data base' });
    } else {
      res.status(200).json({ message: 'Payment updated successfully' });
    }
  });
});

router.put('/:id', (req, res) => {
  const payment = {
    updated_at: new Date(),
    guest_id: req.body.guest_id,
    amount: req.body.amount,
    payment_date: req.body.payment_date,
    payment_status: req.body.payment_status,
    type: req.body.type,
    method: req.body.payment_method,
  };
  const sql = 'UPDATE payments SET ? WHERE payment_id = ?';
  db.query(sql, [payment, req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error updating payment in the data base' });
    } else {
      res.status(200).json({ message: 'Payment updated successfully' });
    }
  });
});

module.exports = router;
