/**
 * @fileoverview Provides endpoint to retrieve comprehensive data for all users from various tables in the database.
 * @module routes/private/allData
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();

/**
 * Route to get all data for all users.
 * @name GET/api/allData
 * @function
 * @memberof module:routes/private/allData
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get('/', (req, res) => {
  const sql = `
    SELECT * FROM guest;
    SELECT * FROM reservation;
    SELECT * FROM orders;
    SELECT * FROM payments;
    SELECT * FROM feedback;
    SELECT * FROM housekeepingtasks;
    SELECT * FROM laundryorders;
    SELECT * FROM laundryitems;
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving all data from database' });
    } else {
      const [
        guests,
        reservations,
        orders,
        payments,
        feedback,
        housekeepingtasks,
        laundryorders,
        laundryitems,
      ] = result;
      const responseData = guests.map((guest) => {
        const guestId = guest.GuestID;
        const guestReservations = reservations.filter(
          (reservation) => reservation.GuestID === guestId
        );
        const guestOrders = orders.filter((order) => order.GuestID === guestId);
        const guestPayments = payments.filter(
          (payment) => payment.GuestID === guestId
        );
        const guestFeedback = feedback.filter(
          (item) => item.GuestID === guestId
        );
        const guestHousekeepingTasks = housekeepingtasks.filter(
          (task) => task.RoomNumber === guest.RoomNumber
        );
        const guestLaundryOrders = laundryorders.filter(
          (order) => order.GuestID === guestId
        );
        const guestLaundryItems = laundryitems.filter(
          (item) => item.OrderID === guest.OrderID
        );
        return {
          ...guest,
          reservations: guestReservations,
          orders: guestOrders,
          payments: guestPayments,
          feedback: guestFeedback,
          housekeepingtasks: guestHousekeepingTasks,
          laundryorders: guestLaundryOrders,
          laundryitems: guestLaundryItems,
        };
      });
      res.status(200).json(responseData);
    }
  });
});

module.exports = router;
