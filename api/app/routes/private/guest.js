/**
 * @fileoverview Provides routes to manage guest data in the database.
 * @module routes/guest
 * @requires express
 * @requires ../../db
 * @requires ../../utils/intUUID
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();
const intUUID = require('../../utils/intUUID');

/**
 * Route to create a new guest.
 * @name POST/guest
 * @function
 * @memberof module:routes/guest
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.LastName - The last name of the guest.
 * @param {string} req.body.FirstName - The first name of the guest.
 * @param {string} req.body.Email - The email address of the guest.
 * @param {string} req.body.Phone - The phone number of the guest.
 * @param {string} req.body.Address - The address of the guest.
 * @param {string} req.body.Username - The username of the guest.
 * @param {string} req.body.Password - The password of the guest.
 * @param {Object} res - The response object.
 */

router.post('/', (req, res) => {
  const GuestID = intUUID();
  console.log(`GuestID: ${GuestID}`);
  const { LastName, FirstName, Email, Phone, Address, Username, Password } =
    req.body;
  const sqlGuest =
    'INSERT INTO Guest (guest_id, last_name, first_name, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)';
  const sqlAccount =
    'INSERT INTO Account (guest_id, Username, Password) VALUES (?, ?, ?)';

  db.beginTransaction((err) => {
    if (err) {
      res.status(500).send({
        status: 500,
        message: `Error in beginning transaction: ${err}`,
      });
      return;
    }

    db.query(
      sqlGuest,
      [GuestID, LastName, FirstName, Email, Phone, Address],
      (err, guestResult) => {
        if (err) {
          db.rollback(() => {
            res.status(500).send({
              status: 500,
              message: `Error in saving guest to database: ${err}`,
            });
          });
        } else {
          const AccountData = [GuestID, Username, Password];
          db.query(sqlAccount, AccountData, (err, accountResult) => {
            if (err) {
              db.rollback(() => {
                res.status(500).send({
                  status: 500,
                  message: `Error in saving account to database: ${err}`,
                });
              });
            } else {
              db.commit((err) => {
                if (err) {
                  db.rollback(() => {
                    res.status(500).send({
                      status: 500,
                      message: `Error in committing transaction: ${err}`,
                    });
                  });
                } else {
                  console.log('Guest and Account added to database');
                  res.status(200).json({
                    status: 200,
                    message: `Guest and Account added to database with GuestID ${GuestID}`,
                    createdGuest: guestResult,
                    createdAccount: accountResult,
                  });
                }
              });
            }
          });
        }
      }
    );
  });
});

/**
 * Route to delete a guest by GuestID.
 * @name DELETE/guest/:guestId
 * @function
 * @memberof module:routes/guest
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.guestId - The ID of the guest to be deleted.
 * @param {Object} res - The response object.
 */

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

/**
 * Route to get all guests.
 * @name GET/guest
 * @function
 * @memberof module:routes/guest
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM guest';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: 'Error retrieving guests from database',
        error: err,
      });
    } else {
      res.status(200).json({
        message: 'Guests retrieved from database',
        guests: result,
      });
    }
  });
});

/**
 * Route to get all data related to a specific GuestID.
 * @name GET/guest/:guestId
 * @function
 * @memberof module:routes/guest
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.guestId - The ID of the guest to retrieve data for.
 * @param {Object} res - The response object.
 */

router.get('/:guestId', (req, res) => {
  const guestId = req.params.guestId;
  const sql = `
    SELECT * FROM Guest WHERE Guest_ID = ?;
    SELECT * FROM Account WHERE Guest_ID = ?;
    SELECT * FROM Room_reservations WHERE Guest_ID = ?;
    SELECT * FROM Table_reservations WHERE Guest_ID = ?;
    SELECT * FROM Orders WHERE guest_id = ?;
    SELECT * FROM Payments WHERE guest_id = ?;
    SELECT * FROM Feedback WHERE guest_id = ?;
  `;

  db.query(
    sql,
    [guestId, guestId, guestId, guestId, guestId, guestId, guestId],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: 'Error retrieving guest data from database' });
      } else {
        const [
          guestInfo,
          accountInfo,
          roomReservations,
          tableReservations,
          orders,
          payments,
          feedback,
        ] = result;

        const responseData = {
          guestInfo: guestInfo[0],
          accountInfo: accountInfo[0],
          room_reservations: roomReservations,
          table_reservations: tableReservations,
          orders,
          payments,
          feedback,
        };

        res.status(200).json({
          message: `Guest data retrieved from database for GuestID ${guestId}`,
          guestData: responseData,
        });
      }
    }
  );
});

/**
 * Route to get all reservations for a specific GuestID.
 * @name GET/guest/:guestId/roomres
 * @function
 * @memberof module:routes/guest
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.guestId - The ID of the guest to retrieve reservations for.
 * @param {Object} res - The response object.
 * @returns {Object} - The reservations for the specified guest.
 */

router.get('/:guestId/roomres', (req, res) => {
  const guestId = req.params.guestId;
  const sql = `SELECT * FROM room_reservations WHERE Guest_ID = ?`;
  db.query(sql, [guestId], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving guest data from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

router.get('/:guestId/roomres/more', (req, res) => {
  const guestId = req.params.guestId;
  const sql = `
    SELECT
      rr.reservation_id,
      rr.check_in_date,
      rr.check_out_date,
      rr.total_cost,
      rd.room_number,
      rt.type_name,
      rt.description AS room_description,
      rt.rate,
      r.description AS general_room_description,
      r.price
    FROM
      room_reservations rr
    LEFT JOIN
      room_details rd ON rr.room_id = rd.room_id
    LEFT JOIN
      room_types rt ON rd.type_id = rt.type_id
    LEFT JOIN
      room r ON rd.room_id = r.room_id
    WHERE
      rr.guest_id = ?
  `;
  db.query(sql, [guestId], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving guest data from database' });
    } else {
      if (result.length === 0) {
        console.log('No data found for the specified guest ID');
      }
      res.status(200).json(result);
    }
  });
});

/**
 * Route to get all Table reservations for a specific GuestID.
 * @name GET/guest/:guestId/tableRes
 * @function
 * @memberof module:routes/guest
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.guestId - The ID of the guest to retrieve table reservationss for.
 * @param {Object} res - The response object.
 * @returns {Object} - The table reservationss for the specified guest.
 */

router.get('/:guestId/tableRes', (req, res) => {
  const guestId = req.params.guestId;
  const sql = `SELECT * FROM table_reservations WHERE GuestID = ?`;
  db.query(sql, [guestId], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving guest data from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to get all orders for a specific GuestID.
 * @name GET/guest/:guestId/order
 * @function
 * @memberof module:routes/guest
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.guestId - The ID of the guest to retrieve orders for.
 * @param {Object} res - The response object.
 * @returns {Object} - The orders for the specified guest.
 */
router.get('/:guestId/orders', (req, res) => {
  const guestId = req.params.guestId;
  const sql = `SELECT * FROM Orders WHERE GuestID = ?`;
  db.query(sql, [guestId], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving guest data from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to get all payments for a specific GuestID.
 * @name GET/guest/:guestId/payment
 * @function
 * @memberof module:routes/guest
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.guestId - The ID of the guest to retrieve payments for.
 * @param {Object} res - The response object.
 * @returns {Object} - The payments for the specified guest.
 */

router.get('/:guestId/payments', (req, res) => {
  const guestId = req.params.guestId;
  const sql = `SELECT * FROM Payments WHERE GuestID = ?`;
  db.query(sql, [guestId], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving guest data from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to get all feedback for a specific GuestID.
 * @name GET/guest/:guestId/feedback
 * @function
 * @memberof module:routes/guest
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.guestId - The ID of the guest to retrieve feedback for.
 * @param {Object} res - The response object.
 * @returns {Object} - The feedback for the specified guest.
 */

router.get('/:guestId/feedback', (req, res) => {
  const guestId = req.params.guestId;
  const sql = `SELECT * FROM Feedback WHERE GuestID = ?`;
  db.query(sql, [guestId], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving guest data from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to update a guest by GuestID.
 * @name PUT/guest/:guestId
 * @function
 * @memberof module:routes/guest
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.guestId - The ID of the guest to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.LastName - The last name of the guest.
 * @param {string} req.body.FirstName - The first name of the guest.
 * @param {string} req.body.Email - The email address of the guest.
 * @param {string} req.body.Phone - The phone number of the guest.
 * @param {string} req.body.Address - The address of the guest.
 * @param {string} req.body.Username - The username of the guest.
 * @param {string} req.body.Password - The password of the guest.
 * @param {Object} res - The response object.
 */

router.put('/:guestId', (req, res) => {
  const guestId = req.params.guestId;
  const { LastName, FirstName, Email, Phone, Address, Username, Password } =
    req.body;

  const guestUpdateSQL = `
    UPDATE guest 
    SET last_name = ?, first_name = ?, email = ?, phone = ?, address = ?
    WHERE guest_id = ?
  `;

  const accountUpdateSQL = `
    UPDATE account 
    SET username = ?, password = ?
    WHERE guest_id = ?
  `;

  db.query(
    guestUpdateSQL,
    [LastName, FirstName, Email, Phone, Address, guestId],
    (err, guestResult) => {
      if (err) {
        return res
          .status(500)
          .send({ status: 500, message: `Error updating guest: ${err}` });
      }

      db.query(
        accountUpdateSQL,
        [Username, Password, guestId],
        (err, accountResult) => {
          if (err) {
            return res.status(500).send({
              status: 500,
              message: `Error updating account in the database: ${err}`,
            });
          }

          res.status(200).json({
            status: 200,
            message: `Guest and Account updated with GuestID ${guestId}`,
            updatedGuest: guestResult,
            updatedAccount: accountResult,
          });
        }
      );
    }
  );
});

module.exports = router;
