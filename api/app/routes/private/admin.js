const express = require('express');
const db = require('../../db');
const router = express.Router();
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

router.post('/create', (req, res) => {
  const id = uuidv4();
  const username = req.body.username;
  const password = req.body.password;

  console.log(username);
  console.log(password);

  // Generate a salt
  const salt = crypto.randomBytes(16).toString('hex');

  // Hash the password with the salt
  const hash = crypto
    .pbkdf2Sync(password, salt, 2048, 32, 'sha512')
    .toString('hex');

  // Store the salt and hash in the database
  const sql =
    'INSERT INTO admin_creds (id, username, password, salt) VALUES (?, ?, ?, ?)';
  db.query(sql, [id, username, hash, salt], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error adding admin to database' });
    } else {
      res.status(200).json({ message: 'Admin added to database' });
    }
  });
});

router.post('/auth', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);
  const sql = 'SELECT * FROM admin_creds WHERE username = ?';
  try {
    db.query(sql, [username], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error retrieving admin from database' });
      } else {
        if (result.length > 0) {
          const storedHash = result[0].password;
          const storedSalt = result[0].salt;

          // Hash the provided password with the stored salt
          const hashAttempt = crypto
            .pbkdf2Sync(password, storedSalt, 2048, 32, 'sha512')
            .toString('hex');

          // Compare the hashes
          if (storedHash === hashAttempt) {
            res.status(200).json({
              message: 'Authentication successful',
              authenticated: true,
            });
          } else {
            res
              .status(401)
              .json({ error: 'Authentication failed', authenticated: false });
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM admin_creds';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving admin from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM admin_creds WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving admin from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'UPDATE admin_creds SET ? WHERE id = ?';
  db.query(sql, [req.body, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error updating admin in database' });
    } else {
      res.status(200).json({ message: 'Admin updated in database' });
    }
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM admin_creds WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting admin from database' });
    } else {
      res.status(200).json({ message: 'Admin deleted from database' });
    }
  });
});

module.exports = router;
