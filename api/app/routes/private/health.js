const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/api', (req, res) => {
  res.send('OK');
});

router.get('/db', (req, res) => {
  const sql = 'SELECT 1';
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      res.send('NOT OK');
    } else {
      res.send('OK');
    }
  });
});

module.exports = router;
