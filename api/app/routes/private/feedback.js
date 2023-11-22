/**
 * @fileoverview Provides routes to manage feedback data in the database.
 * @module routes/feedback
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();

/**
 * Route to create new feedback.
 * @name POST/feedback
 * @function
 * @memberof module:routes/feedback
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {number} req.body.GuestID - The ID of the guest who provided the feedback.
 * @param {string} req.body.Comment - The comment provided in the feedback.
 * @param {number} req.body.Rating - The rating provided in the feedback.
 * @param {Object} res - The response object.
 */

router.post('/', (req, res) => {
  const { GuestID, Comment, Rating } = req.body;
  const sql =
    'INSERT INTO Feedback (guest_id, Comment, Rating) VALUES (?, ?, ?)';
  db.query(sql, [GuestID, Comment, Rating], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error adding feedback to database' });
    } else {
      res.status(200).json({ message: 'Feedback added to database' });
    }
  });
});

/**
 * Route to delete feedback by FeedbackID.
 * @name DELETE/feedback/:feedbackID
 * @function
 * @memberof module:routes/feedback
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.feedbackID - The ID of the feedback to be deleted.
 * @param {Object} res - The response object.
 */

router.delete('/:feedbackID', (req, res) => {
  const feedbackID = req.params.feedbackID;
  const sql = 'DELETE FROM Feedback WHERE feedback_id = ?';
  db.query(sql, [feedbackID], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting feedback from database' });
    } else {
      res.status(200).json({ message: 'Feedback deleted from database' });
    }
  });
});

/**
 * Route to get all feedback.
 * @name GET/feedback
 * @function
 * @memberof module:routes/feedback
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM Feedback';
  db.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving feedback from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to get feedback by FeedbackID.
 * @name GET/feedback/:feedbackID
 * @function
 * @memberof module:routes/feedback
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.feedbackID - The ID of the feedback to be retrieved.
 * @param {Object} res - The response object.
 */

router.get('/:feedbackID', (req, res) => {
  const feedbackID = req.params.feedbackID;
  const sql = 'SELECT * FROM Feedback WHERE feedback_id = ?';
  db.query(sql, [feedbackID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving feedback from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to update feedback by FeedbackID.
 * @name PUT/feedback/:feedbackID
 * @function
 * @memberof module:routes/feedback
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.feedbackID - The ID of the feedback to be updated.
 * @param {Object} req.body - The request body.
 * @param {number} req.body.GuestID - The ID of the guest who provided the feedback.
 * @param {string} req.body.Comment - The comment provided in the feedback.
 * @param {number} req.body.Rating - The rating provided in the feedback.
 * @param {Object} res - The response object.
 */

router.put('/:feedbackID', (req, res) => {
  const feedbackID = req.params.feedbackID;
  const { GuestID, Comment, Rating } = req.body;
  const sql =
    'UPDATE Feedback SET guest_id = ?, Comment = ?, Rating = ? WHERE feedback_id = ?';
  db.query(sql, [GuestID, Comment, Rating, feedbackID], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error updating feedback in database' });
    } else {
      res.status(200).json({ message: 'Feedback updated in database' });
    }
  });
});

module.exports = router;
