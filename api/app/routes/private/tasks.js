/**
 * @fileoverview Provides routes to manage tasks
 * @module routes/tasks
 * @requires express
 * @requires ../../db
 * @requires ../../utils/intUUID
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();
const intUUID = require('../../utils/intUUID');

/**
 * Route to get all tasks.
 * @name GET/tasks/
 * @function
 * @memberof module:routes/tasks
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM tasks';
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving tasks from the database' });
    } else {
      res.status(200).json(result);
    }
  });
});

router.post('/', (req, res) => {
  const TaskID = intUUID();
  const {
    TaskName,
    TaskDescription,
    RoomNumber,
    Status,
    Created_at: CreatedAt,
  } = req.body;
  const UpdatedAt = CreatedAt;
  const sql =
    'INSERT INTO tasks (task_id, task_name, description, room_number, status, created_at, updated_at) VALUES (?, ?, ?, ?, ? ,?, ?)';
  db.query(
    sql,
    [
      TaskID,
      TaskName,
      TaskDescription,
      RoomNumber,
      Status,
      CreatedAt,
      UpdatedAt,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Error adding task to the database' });
      } else {
        res.status(200).json({ message: 'Task added successfully' });
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { TaskName, TaskDescription, RoomNumber, Status } = req.body;
  const UpdatedAt = new Date();
  const sql =
    'UPDATE tasks SET task_name = ?, description = ?, room_number = ?, status = ?, updated_at = ? WHERE task_id = ?';
  db.query(
    sql,
    [TaskName, TaskDescription, RoomNumber, Status, UpdatedAt, id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Error updating task in the database' });
      } else {
        res.status(200).json({ message: 'Task updated successfully' });
      }
    }
  );
});

router.put('/:status/:id', (req, res) => {
  const status = req.params.status.toLowerCase();
  const id = req.params.id;

  const determineStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'inprogress':
        return 'inProgress';
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      default:
        return 'To Do';
    }
  };

  const newStatus = determineStatus(status);

  const sql = 'UPDATE tasks SET status = ? WHERE task_id = ?';
  db.query(sql, [newStatus, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error updating task in the database' });
    } else {
      res.status(200).json({ message: 'Task updated successfully' });
    }
  });
});

module.exports = router;
