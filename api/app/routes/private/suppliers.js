const express = require('express');
const db = require('../../db');
const router = express.Router();
const intUUID = require('../../utils/intUUID');

router.post('/', async (req, res) => {
  const id = intUUID();
  const {
    supplier_id = id,
    supplier_name,
    contact_name,
    contact_title,
    address,
    city,
    region,
    postal_code,
    country,
    phone,
    email,
  } = req.body;

  const sql =
    'INSERT INTO suppliers (supplier_id, supplier_name, contact_name, contact_title, address, city, region, postal_code, country, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(
    sql,
    [
      supplier_id,
      supplier_name,
      contact_name,
      contact_title,
      address,
      city,
      region,
      postal_code,
      country,
      phone,
      email,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: 'Error retrieving suppliers from the database' });
      } else {
        res.status(200).json(result);
      }
    }
  );
});

router.get('/', async (req, res) => {
  const sql = 'SELECT * FROM suppliers';
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving suppliers from the database' });
    } else {
      res.status(200).json(result);
    }
  });
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM suppliers WHERE supplier_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving suppliers from the database' });
    } else {
      res.status(200).json(result);
    }
  });
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const {
    supplier_name,
    contact_name,
    contact_title,
    address,
    city,
    region,
    postal_code,
    country,
    phone,
    email,
  } = req.body;

  const sql =
    'UPDATE suppliers SET supplier_name = ?, contact_name = ?, contact_title = ?, address = ?, city = ?, region = ?, postal_code = ?, country = ?, phone = ?, email = ? WHERE supplier_id = ?';
  db.query(
    sql,
    [
      supplier_name,
      contact_name,
      contact_title,
      address,
      city,
      region,
      postal_code,
      country,
      phone,
      email,
      id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: 'Error retrieving suppliers from the database' });
      } else {
        res.status(200).json(result);
      }
    }
  );
});

module.exports = router;
