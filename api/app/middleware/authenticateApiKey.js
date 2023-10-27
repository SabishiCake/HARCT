const express = require('express');
const db = require('../db');
const router = express.Router();

const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized: API key is missing' });
  }

  const sql = 'SELECT * FROM APIKeys WHERE APIKey = ?';
  db.query(sql, apiKey, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }

    next();
  });
};

router.use(authenticateApiKey);

module.exports = authenticateApiKey;
