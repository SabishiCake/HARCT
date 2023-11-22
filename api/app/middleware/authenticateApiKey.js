const express = require('express');
const db = require('../db');
const router = express.Router();

/**
 * @name authenticateApiKey
 * @description Middleware to authenticate API key in the request headers.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @param {*} next - The next middleware function.
 */
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  // Check if API key exists in the request headers
  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized: API key is missing' });
  }

  // Query the database to check if the API key exists
  const sql = 'SELECT * FROM api_keys WHERE api_Key = ?';
  db.query(sql, apiKey, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    // If the API key does not exist in the database, send a forbidden error
    if (result.length === 0) {
      return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }

    // If the API key is valid, continue to the next middleware
    next();
  });
};

// Use the authentication middleware for all routes using this router
router.use(authenticateApiKey);

module.exports = authenticateApiKey;
