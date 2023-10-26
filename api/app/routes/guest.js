const express = require('express');
const db = require('../db');
const router = express.Router();
const intUUID = require(__dirname + '/../utils/intUUID.js');

// Create Guest
router.post('/', (req, res) => {
    const GuestID = intUUID();
    console.log(`GuestID: ${GuestID}`);
    const { LastName, FirstName, Email, Phone, Address } = req.body;
    const sql = 'INSERT INTO Guest (GuestID, LastName, FirstName, Email, Phone, Address) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [GuestID, LastName, FirstName, Email, Phone, Address], (err, result) => {
        if (err) {
            res.status(500).send(`Error in saving guest to database: ${err}`);
        } else {
            console.log('Guest added to database');
            // res.status(200).send('Guest added to database');
            res.status(200).json({
                message: `Guest added to database with GuestID ${GuestID}`,
                createdGuest: result
            });
        }
    });
});

// Get all Guests
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Guest';
    db.query(sql, (err, result) => {
        if (err) {
            // res.status(500).send('Error retrieving guests from database');
            res.status(500).json({
                message: 'Error retrieving guests from database',
                error: err
            });
        } else {
            // res.status(200).send(result);
            res.status(200).json({
                message: 'Guests retrieved from database',
                guests: result
            });
        }
    });
});

module.exports = router;
