// routes/feedback.js

const express = require('express');
const db = require('../db');
const router = express.Router();

// Create new feedback
router.post('/', (req, res) => {
    const { GuestID, Comment, Rating } = req.body;
    const sql = 'INSERT INTO Feedback (GuestID, Comment, Rating) VALUES (?, ?, ?)';
    db.query(sql, [GuestID, Comment, Rating], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error adding feedback to database' });
        } else {
            res.status(200).json({ message: 'Feedback added to database' });
        }
    });
});

// Delete feedback by FeedbackID
router.delete('/:feedbackID', (req, res) => {
    const feedbackID = req.params.feedbackID;
    const sql = 'DELETE FROM Feedback WHERE FeedbackID = ?';
    db.query(sql, [feedbackID], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error deleting feedback from database' });
        } else {
            res.status(200).json({ message: 'Feedback deleted from database' });
        }
    });
});

// Get all feedback
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Feedback';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving feedback from database' });
        } else {
            res.status(200).json(result);
        }
    });
});

// Get feedback by FeedbackID
router.get('/:feedbackID', (req, res) => {
    const feedbackID = req.params.feedbackID;
    const sql = 'SELECT * FROM Feedback WHERE FeedbackID = ?';
    db.query(sql, [feedbackID], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving feedback from database' });
        } else {
            res.status(200).json(result);
        }
    });
});

// Update feedback by FeedbackID
router.put('/:feedbackID', (req, res) => {
    const feedbackID = req.params.feedbackID;
    const { GuestID, Comment, Rating } = req.body;
    const sql = 'UPDATE Feedback SET GuestID = ?, Comment = ?, Rating = ? WHERE FeedbackID = ?';
    db.query(sql, [GuestID, Comment, Rating, feedbackID], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error updating feedback in database' });
        } else {
            res.status(200).json({ message: 'Feedback updated in database' });
        }
    });
});


module.exports = router;
