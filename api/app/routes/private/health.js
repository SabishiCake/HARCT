const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is OK' });
});

router.get('/db', (req, res) => {
  const sql = 'SELECT 1';
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error connecting to DB' });
    } else {
      res.status(200).json({ message: 'DB is OK' });
    }
  });
});

module.exports = router;
