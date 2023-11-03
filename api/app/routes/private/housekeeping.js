/**
 * @fileoverview Provides routes to manage housekeeping tasks in the database.
 * @module routes/housekeeping
 * @requires express
 * @requires ../../db
 */

const express = require('express');
const db = require('../../db');
const router = express.Router();

/**
 * Route to get all housekeeping tasks.
 * @name GET/housekeeping/tasks
 * @function
 * @memberof module:routes/housekeeping
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

router.get('/tasks', (req, res) => {
  const sql = 'SELECT * FROM housekeepingtasks';
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving housekeeping tasks from database' });
    } else {
      res.status(200).json(result);
    }
  });
});

/**
 * Route to add a new housekeeping task.
 * @name POST/housekeeping/tasks
 * @function
 * @memberof module:routes/housekeeping
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.TaskName - The name of the housekeeping task.
 * @param {string} req.body.Description - The description of the housekeeping task.
 * @param {string} req.body.RoomNumber - The room number associated with the task.
 * @param {string} req.body.Status - The status of the housekeeping task.
 * @param {Object} res - The response object.
 */

router.post('/tasks', (req, res) => {
  const { TaskName, Description, RoomNumber, Status } = req.body;
  const sql =
    'INSERT INTO housekeepingtasks (TaskName, Description, RoomNumber, Status) VALUES (?, ?, ?, ?)';
  db.query(sql, [TaskName, Description, RoomNumber, Status], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error adding housekeeping task to the database' });
    } else {
      res.status(200).json({ message: 'Housekeeping task added successfully' });
    }
  });
});

/**
 * Route to update a housekeeping task by TaskID.
 * @name PUT/housekeeping/tasks/:id
 * @function
 * @memberof module:routes/housekeeping
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the housekeeping task to be updated.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.TaskName - The name of the housekeeping task.
 * @param {string} req.body.Description - The description of the housekeeping task.
 * @param {string} req.body.RoomNumber - The room number associated with the task.
 * @param {string} req.body.Status - The status of the housekeeping task.
 * @param {Object} res - The response object.
 */

router.put('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { TaskName, Description, RoomNumber, Status } = req.body;
  const sql =
    'UPDATE housekeepingtasks SET TaskName = ?, Description = ?, RoomNumber = ?, Status = ? WHERE TaskID = ?';
  db.query(
    sql,
    [TaskName, Description, RoomNumber, Status, taskId],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: 'Error updating housekeeping task in the database' });
      } else {
        res
          .status(200)
          .json({ message: 'Housekeeping task updated successfully' });
      }
    }
  );
});

/**
 * Route to delete a housekeeping task by TaskID.
 * @name DELETE/housekeeping/tasks/:id
 * @function
 * @memberof module:routes/housekeeping
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the housekeeping task to be deleted.
 * @param {Object} res - The response object.
 */

router.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const sql = 'DELETE FROM housekeepingtasks WHERE TaskID = ?';
  db.query(sql, [taskId], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error deleting housekeeping task from the database' });
    } else {
      res
        .status(200)
        .json({ message: 'Housekeeping task deleted successfully' });
    }
  });
});

module.exports = router;
