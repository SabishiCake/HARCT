/**
 * @fileoverview Provides functionality to generate and store API key in the database.
 * @module routes/apikey
 * @requires express
 * @requires ../../db
 * @requires uuid
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

/**
 * Route to generate and store API key.
 * @name POST/apikey
 * @function
 * @memberof module:routes/apikey
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.description - The description for the API key (optional).
 * @param {Object} res - The response object.
 */
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
