/**
 * @fileoverview Provides routes to manage reservations in the database.
 * @module routes/roomRes
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();
const intUUID = require('../../utils/intUUID');

const resType = (Type) => {
  if (!Type) {
    return 'reservation';
  }
  if (Type === 'booking') {
    return 'booking';
  } else {
    return Type;
  }
};

/**
 * Route to create a new reservation.
 * @name POST/roomRes
 * @function
 * @memberof module:routes/roomRes
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.GuestID - The ID of the guest making the reservation.
 * @param {string} req.body.RoomID - The ID of the room reserved.
 * @param {string} req.body.CheckInDate - The check-in date for the reservation.
 * @param {string} req.body.CheckOutDate - The check-out date for the reservation.
 * @param {number} req.body.TotalCost - The total cost of the reservation.
 * @param {Object} res - The response object.
 */

router.post('/', (req, res) => {
  const { GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost, Type } =
    req.body;

  const ReservationID = intUUID();
  const paymentID = intUUID();
  const today = new Date();
  const reStatus = 'pending'; // Default status is pending : enum('cancelled','pending','completed','checkedIn')
  // Default type is reservation : enum('reservation','booking'). if type is not provided, default to reservation
  const payStatus = 'partial'; // Default status is unpaid : enum('paid','unpaid','partial')
  const payMethod = 'pending'; // Default method is cash : enum('pending', 'cash', 'credit_card', 'debit_card', 'paynow')

  const insertRoomresSql =
    'INSERT INTO room_reservations (reservation_id, guest_id, room_id, check_in_date, check_out_date, total_cost, status, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const insertPaymentSql =
    'INSERT INTO payments (payment_id, created_at, updated_at, guest_id, amount, payment_date, payment_status, type, method, reftransaction_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const checkConflictingReservationSql =
    'SELECT * FROM room_reservations WHERE room_id = ? AND ((check_in_date BETWEEN ? AND ?) OR (check_out_date BETWEEN ? AND ?))';

  db.query(
    checkConflictingReservationSql,
    [RoomID, CheckInDate, CheckOutDate, CheckInDate, CheckOutDate],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          error: 'Error checking for conflicting reservation in database',
        });
      } else {
        if (result.length > 0) {
          res.status(400).json({
            error: 'Error: Conflicting reservation found in database',
          });
        } else {
          db.query(
            insertRoomresSql,
            [
              ReservationID,
              GuestID,
              RoomID,
              CheckInDate,
              CheckOutDate,
              TotalCost,
              reStatus,
              resType(Type),
            ],
            (err, result) => {
              if (err) {
                res.status(500).json({
                  error: `Error inserting Data into database`,
                });
              } else {
                db.query(
                  insertPaymentSql,
                  [
                    paymentID,
                    today,
                    today,
                    GuestID,
                    TotalCost,
                    CheckInDate,
                    payStatus,
                    resType(Type),
                    payMethod,
                    ReservationID,
                  ],
                  (err, result) => {
                    if (err) {
                      res.status(500).json({
                        error: 'Error inserting payment into database',
                      });
                    } else {
                      res.status(200).json({
                        message: `Room data and payment inserted into database`,
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});

/**
 * Route to delete a reservation by reservation_id.
 * @name DELETE/roomRes/:reservationID
 * @function
 * @memberof module:routes/roomRes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.reservationID - The ID of the reservation to be deleted.
 * @param {Object} res - The response object.
 */

router.delete('/:reservationID', (req, res) => {
  const reservationID = req.params.reservationID;
  const deleteResSql = 'DELETE FROM room_reservations WHERE reservation_id = ?';
  const deletePaySql = 'DELETE FROM payments WHERE reftransaction_id = ?';
  db.query(deleteResSql, [reservationID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error deleting room reservation from database' });
    } else {
      db.query(deletePaySql, [reservationID], (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ error: 'Error deleting payment from database' });
        } else {
          res.status(200).json({
            message: 'Room reservation and payment deleted from database',
          });
        }
      });
    }
  });
});

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM room_reservations';
  db.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving room reservations from database' });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: 'No reservations found' });
      } else {
        res.status(200).json(result);
      }
    }
  });
});

/**
 * Route to get all reservations.
 * @name GET/roomRes
 * @function
 * @memberof module:routes/roomRes/reservations
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object[]} An array of objects containing information about each reservation.
 */

router.get('/reservations', (req, res) => {
  const sql = 'SELECT * FROM room_reservations WHERE type = "reservation"';
  db.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving room reservations from database' });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: 'No reservations found' });
      } else {
        res.status(200).json(result);
      }
    }
  });
});

/**
 * Route to get all bookings.
 * @name GET/roomRes
 * @function
 * @memberof module:routes/roomRes/bookings
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object[]} An array of objects containing information about each booking.
 */

router.get('/bookings', (req, res) => {
  const sql = 'SELECT * FROM room_reservations WHERE type = "booking"';
  db.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving room booking from database' });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: 'No bookings found' });
      } else {
        res.status(200).json(result);
      }
    }
  });
});

/**
 * Route to get all reservations with full information.
 * @name GET/roomRes/more
 * @function
 * @memberof module:routes/roomRes
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object[]} An array of objects containing full information about each reservation.
 */

router.get('/more', (req, res) => {
  const fullInfoSql = `
    SELECT 
        r.reservation_id, r.room_id, r.guest_id, r.check_in_date, r.check_out_date, r.total_cost, r.status, r.type,
        g.guest_id, g.last_name, g.first_name, g.email, g.phone, g.address,
        rd.room_id, rd.room_number, rd.type_id, rd.is_occupied,
        p.payment_id, p.created_at, p.updated_at, p.guest_id, p.amount, p.payment_date, p.payment_status, p.reftransaction_id
    FROM 
        room_reservations r
    JOIN 
        guest g ON r.guest_id = g.guest_id
    JOIN 
        room_details rd ON r.room_id = rd.room_id
    JOIN
        payments p ON r.reservation_id = p.reftransaction_id
  `;

  db.query(fullInfoSql, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: 'Error retrieving full information from database' });
    }

    const formattedResults = results.map((row) => {
      return {
        reservation_id: row.reservation_id,
        room_id: row.room_id,
        guest_id: row.guest_id,
        check_in_date: row.check_in_date,
        check_out_date: row.check_out_date,
        total_cost: row.total_cost,
        status: row.status,
        type: row.type,
        guest: {
          guest_id: row.guest_id,
          last_name: row.last_name,
          first_name: row.first_name,
          email: row.email,
          phone: row.phone,
          address: row.address,
        },
        room: {
          room_id: row.room_id,
          room_number: row.room_number,
          type_id: row.type_id,
          is_occupied: row.is_occupied,
        },
        payment: {
          payment_id: row.payment_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          guest_id: row.guest_id,
          amount: row.amount,
          payment_date: row.payment_date,
          payment_status: row.payment_status,
          payment_type: row.type,
          reftransaction_id: row.reftransaction_id,
        },
      };
    });

    // console.log(formattedResults);

    res.status(200).json(formattedResults);
  });
});

/**
 * Route to get a reservation by reservation_id.
 * @name GET/roomRes/:reservationID
 * @function
 * @memberof module:routes/roomRes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.reservationID - The ID of the reservation to be retrieved.
 * @param {Object} res - The response object.
 */

router.get('/:reservationID', (req, res) => {
  const reservationID = req.params.reservationID;
  const sql = 'SELECT * FROM room_reservations WHERE reservation_id = ?';
  db.query(sql, [reservationID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving room reservation from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to get a reservation by GuestID.
 * @name GET/roomRes/guest/:guestID
 * @function
 * @memberof module:routes/roomRes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.guestID - The ID of the guest for whom reservations are to be retrieved.
 * @param {Object} res - The response object.
 */

router.get('/guest/:guestID', (req, res) => {
  const guestID = req.params.guestID;
  const sql = 'SELECT * FROM room_reservations WHERE Guest_ID = ?';
  db.query(sql, [guestID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Error retrieving room reservation from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to update a reservation by reservation_id.
 * @name PUT/roomRes/:reservationID
 * @function
 * @memberof module:routes/roomRes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.reservationID - The ID of the reservation to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.GuestID - The ID of the guest making the reservation.
 * @param {string} req.body.RoomID - The ID of the room reserved.
 * @param {string} req.body.CheckInDate - The check-in date for the reservation.
 * @param {string} req.body.CheckOutDate - The check-out date for the reservation.
 * @param {number} req.body.TotalCost - The total cost of the reservation.
 * @param {Object} res - The response object.
 */

router.put('/:reservationID', (req, res) => {
  const reservationID = req.params.reservationID;
  const today = new Date();
  const { GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost, Type } =
    req.body;
  const updateResRoomSql =
    'UPDATE room_reservations SET guest_id = ?, room_id = ?, check_in_date = ?, check_out_date = ?, total_cost = ?, type = ? WHERE reservation_id = ?';
  const updatePaymentSql =
    'UPDATE payments SET updated_at = ?, amount = ?, type = ? WHERE reftransaction_id = ?';
  const checkConflictingReservationSql =
    'SELECT * FROM room_reservations WHERE room_id = ? AND reservation_id <> ? AND ((status = "pending" OR status = "checkedIn") AND ((check_in_date < ? AND check_out_date > ?) OR (check_in_date < ? AND check_out_date > ?)))';

  db.query(
    checkConflictingReservationSql,
    [
      RoomID,
      reservationID,
      CheckInDate,
      CheckOutDate,
      CheckInDate,
      CheckOutDate,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          error:
            'Error checking for conflicting reservation in database. Picked date may be unavailable',
        });
      } else {
        if (result.length > 0) {
          res.status(400).json({
            error: 'Conflicting reservation found in database',
          });
        } else {
          db.query(
            updateResRoomSql,
            [
              GuestID,
              RoomID,
              CheckInDate,
              CheckOutDate,
              TotalCost,
              resType(Type),
              reservationID,
            ],
            (err, updateResult) => {
              if (err) {
                res.status(500).json({
                  error: 'Error updating reservation in database',
                });
              } else {
                db.query(
                  updatePaymentSql,
                  [today, TotalCost, reservationID, resType(Type)],
                  (err, updateResult) => {
                    if (err) {
                      res.status(500).json({
                        error: 'Error updating payment in database',
                      });
                    } else {
                      res.status(200).json({
                        message: 'Room Data and payment updated in database',
                        affectedRows: updateResult.affectedRows,
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});

router.put('/:status/:reservationID', (req, res) => {
  const reservationID = req.params.reservationID.toLowerCase();
  const getRoomOccupancy = (roomID) => {
    const roomSql = 'SELECT is_occupied FROM room_details WHERE room_id = ?';
    return new Promise((resolve, reject) => {
      db.query(roomSql, [roomID], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0].is_occupied);
        }
      });
    });
  };

  let IsOccupied = 0;

  const determineStatus = () => {
    switch (req.params.status) {
      case 'pending':
        return 'pending';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      case 'checkedin':
        IsOccupied = 1;
        return 'checkedIn';
      default:
        return 'pending';
    }
  };

  const status = determineStatus();
  const statusSql =
    'UPDATE room_reservations SET status = ? WHERE reservation_id = ?';

  db.query(statusSql, [status, reservationID], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: 'Error updating reservation status in database' });
    }

    if (status !== 'cancelled' || status !== 'pending') {
      // Only update room occupancy status if status is not 'cancelled' or 'pending'
      const reservationSql = 'SELECT * FROM room_reservations'; // Modify this SQL query according to your schema
      db.query(reservationSql, (err, reservations) => {
        if (err) {
          return res
            .status(500)
            .json({ error: 'Error retrieving reservations from database' });
        }

        const updatedReservation = reservations.find(
          (reservation) =>
            reservation.reservation_id === parseInt(reservationID)
        );
        if (!updatedReservation) {
          return res.status(404).json({ error: 'Reservation not found' });
        }

        const roomSql =
          'UPDATE room_details SET is_occupied = ? WHERE room_id = ?';
        db.query(
          roomSql,
          [IsOccupied, updatedReservation.room_id],
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ error: 'Error updating room status in database' });
            }

            return res.status(200).json({
              message:
                'Room reservation status updated in database and room status updated',
            });
          }
        );
      });
    } else {
      return res.status(200).json({
        message:
          'Reservation cancelled, room occupancy status remains unchanged',
      });
    }
  });
});

module.exports = router;
