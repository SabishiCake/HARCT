/**
 * @fileoverview Provides routes to manage feedback data in the database.
 * @module routes/feedback
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();
const intUUID = require('../../utils/intUUID');

router.post('/', async (req, res) => {
  const { name, email, comment, rating } = req.body;
  const feedback_id = intUUID();

  if (!name || !email || !comment || !rating) {
    return res.status(400).json({ error: 'Please enter all fields' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const sql =
    'INSERT INTO feedback (feedback_id, name, email, comment, rating) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [feedback_id, name, email, comment, rating], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving feedback from the database' });
    } else {
      res.status(200).json(result);
    }
  });
});

router.get('/', async (req, res) => {
  const sql = 'SELECT * FROM feedback';
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving feedback from the database' });
    } else {
      if (result.length === 0) {
        res.status(200).json({ message: 'No feedback found' });
      } else {
        console.log(result);
        res.status(200).json(result);
      }
    }
  });
});

router.get('/:feedback_id', async (req, res) => {
  const { feedback_id } = req.params;
  const sql = 'SELECT * FROM feedback WHERE feedback_id = ?';
  db.query(sql, [feedback_id], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving feedback from the database' });
    } else {
      if (result.length === 0) {
        res.status(200).json({ message: 'No feedback found' });
      } else {
        res.status(200).json(result);
      }
    }
  });
});

router.put('/:feedback_id', async (req, res) => {
  const { name, email, comment, rating } = req.body;
  console.log(req.body);
  console.log(req.params);
  const id = req.params.feedback_id;
  if (!id) {
    return res.status(400).json({ error: 'No id' });
  }
  if (!name || !email || !comment || !rating) {
    return res.status(400).json({ error: 'Please enter all fields' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const sql =
    'UPDATE feedback SET name = ?, email = ?, comment = ?, rating = ? WHERE feedback_id = ?';
  db.query(sql, [name, email, comment, rating, id], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving feedback from the database' });
    } else {
      if (result.length === 0) {
        res.status(200).json({ message: 'No feedback found' });
      } else {
        res.status(200).json(result);
      }
    }
  });
});

router.delete('/:feedback_id', async (req, res) => {
  const { feedback_id } = req.params;
  const sql = 'DELETE FROM feedback WHERE feedback_id = ?';
  db.query(sql, [feedback_id], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving feedback from the database' });
    } else {
      if (result.length === 0) {
        res.status(200).json({ message: 'No feedback found' });
      } else {
        res.status(200).json(result);
      }
    }
  });
});

module.exports = router;
