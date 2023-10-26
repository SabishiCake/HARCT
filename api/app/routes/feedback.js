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

module.exports = router;
