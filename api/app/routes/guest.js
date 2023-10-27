const express = require('express');
const db = require('../db');
const router = express.Router();
const intUUID = require(__dirname + '/../utils/intUUID.js');

// Create Guest
router.post('/', (req, res) => {
  const GuestID = intUUID();
  console.log(`GuestID: ${GuestID}`);
  const { LastName, FirstName, Email, Phone, Address } = req.body;
  const sql =
    'INSERT INTO Guest (GuestID, LastName, FirstName, Email, Phone, Address) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(
    sql,
    [GuestID, LastName, FirstName, Email, Phone, Address],
    (err, result) => {
      if (err) {
        res.status(500).send(`Error in saving guest to database: ${err}`);
      } else {
        console.log('Guest added to database');
        // res.status(200).send('Guest added to database');
        res.status(200).json({
          message: `Guest added to database with GuestID ${GuestID}`,
          createdGuest: result,
        });
      }
    }
  );
});

// Delete Guest by GuestID
router.delete('/:guestId', (req, res) => {
  const guestId = req.params.guestId;
  const sql = 'DELETE FROM Guest WHERE GuestID = ?';
  db.query(sql, [guestId], (err, result) => {
    if (err) {
      res.status(500).send(`Error in deleting guest from database: ${err}`);
    } else {
      console.log('Guest deleted from database');
      // res.status(200).send('Guest deleted from database');
      res.status(200).json({
        message: `Guest deleted from database with GuestID ${guestId}`,
        deletedGuest: result,
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
        error: err,
      });
    } else {
      // res.status(200).send(result);
      res.status(200).json({
        message: 'Guests retrieved from database',
        guests: result,
      });
    }
  });
});

// Get all data related to a specific GuestID
router.get('/:guestId', (req, res) => {
  const guestId = req.params.guestId;
  const sql = `SELECT * FROM Guest WHERE GuestID = ?;
              SELECT * FROM Reservation WHERE GuestID = ?;
              SELECT * FROM Orders WHERE GuestID = ?;
              SELECT * FROM Payments WHERE GuestID = ?;
              SELECT * FROM Feedback WHERE GuestID = ?`;
  db.query(
    sql,
    [guestId, guestId, guestId, guestId, guestId],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: 'Error retrieving guest data from database' });
      } else {
        const [guestInfo, reservations, orders, payments, feedback] = result;
        const responseData = {
          guestInfo: {
            ...guestInfo[0],
            reservations: reservations,
            orders: orders,
            payments: payments,
            feedback: feedback,
          },
        };
        res.status(200).json(responseData);
      }
    }
  );
});

// Update Guest by GuestID
router.put('/:guestId', (req, res) => {
  const guestId = req.params.guestId;
  const { LastName, FirstName, Email, Phone, Address } = req.body;
  const sql =
    'UPDATE Guest SET LastName = ?, FirstName = ?, Email = ?, Phone = ?, Address = ? WHERE GuestID = ?';
  db.query(
    sql,
    [LastName, FirstName, Email, Phone, Address, guestId],
    (err, result) => {
      if (err) {
        res.status(500).send(`Error in updating guest in database: ${err}`);
      } else {
        console.log('Guest updated in database');
        // res.status(200).send('Guest updated in database');
        res.status(200).json({
          message: `Guest updated in database with GuestID ${guestId}`,
          updatedGuest: result,
        });
      }
    }
  );
});

module.exports = router;
