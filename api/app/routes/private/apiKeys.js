const express = require('express');
const db = require('../../db');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Generate and store API key
router.post('/', (req, res) => {
  const apiKey = uuidv4();
  const description = req.body.description || 'No description provided';
  const sql = 'INSERT INTO APIKeys (APIKey, Description) VALUES (?, ?)';
  db.query(sql, [apiKey, description], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error generating API key' });
    } else {
      res.status(200).json({ apiKey, description });
    }
  });
});

module.exports = router;
