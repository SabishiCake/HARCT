// routes/allData.js

const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all data for all users
router.get('/', (req, res) => {
    const sql = `SELECT * FROM Guest;
              SELECT * FROM Reservation;
              SELECT * FROM Orders;
              SELECT * FROM Payments;
              SELECT * FROM Feedback`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error retrieving all data from database' });
        } else {
            const [guests, reservations, orders, payments, feedback] = result;
            const responseData = guests.map(guest => {
                const guestId = guest.GuestID;
                const guestReservations = reservations.filter(reservation => reservation.GuestID === guestId);
                const guestOrders = orders.filter(order => order.GuestID === guestId);
                const guestPayments = payments.filter(payment => payment.GuestID === guestId);
                const guestFeedback = feedback.filter(item => item.GuestID === guestId);
                return {
                    ...guest,
                    reservations: guestReservations,
                    orders: guestOrders,
                    payments: guestPayments,
                    feedback: guestFeedback
                };
            });
            res.status(200).json(responseData);
        }
    });
});

module.exports = router;
