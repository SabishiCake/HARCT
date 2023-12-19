const express = require('express');
const db = require('../../db');
const router = express.Router();
const intUUID = require('../../utils/intUUID');

router.post('/', async (req, res) => {
  const {
    item_name,
    description,
    quantity,
    reorder_level,
    unit_price,
    refsupplier_id,
  } = req.body;

  const checkIfRefSupplierExists = (refsupplier_id) => {
    const sql = 'SELECT * FROM suppliers WHERE supplier_id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [refsupplier_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length === 0) {
            reject('Supplier not found');
          } else {
            resolve(result);
          }
        }
      });
    });
  };

  try {
    await checkIfRefSupplierExists(refsupplier_id);
  } catch (err) {
    res.status(404).json({ error: err });
    return;
  }

  const sql =
    'INSERT INTO inventory (item_id, item_name, description, quantity, reorder_level, unit_price, refsupplier_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(
    sql,
    [
      intUUID(),
      item_name,
      description,
      quantity,
      reorder_level,
      unit_price,
      refsupplier_id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: 'Error retrieving inventory from the database' });
      } else {
        res.status(200).json(result);
      }
    }
  );
});

router.get('/', (req, res) => {
  const sql = `
    SELECT
      item_id,
      item_name,
      description,
      quantity,
      reorder_level,
      unit_price,
      refsupplier_id,
      supplier_name
    FROM inventory
    INNER JOIN suppliers ON inventory.refsupplier_id = suppliers.supplier_id
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving inventory from the database' });
    } else {
      if (result.length === 0) {
        res.status(200).json({ message: 'No item found' });
      } else {
        res.status(200).json(result);
      }
    }
  });
});

router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM inventory WHERE item_id = ?';

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: 'Error retrieving inventory from the database' });
    } else {
      if (result.length === 0) {
        res.status(200).json({ message: 'No item found' });
      } else {
        res.status(200).json(result);
      }
    }
  });
});

router.put('/:id', (req, res) => {
  const {
    item_name,
    description,
    quantity,
    reorder_level,
    unit_price,
    refsupplier_id,
  } = req.body;
  const sql =
    'UPDATE inventory SET item_name = ?, description = ?, quantity = ?, reorder_level = ?, unit_price = ?, refsupplier_id = ? WHERE item_id = ?';
  db.query(
    sql,
    [
      item_name,
      description,
      quantity,
      reorder_level,
      unit_price,
      refsupplier_id,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: 'Error updating inventory in the database' });
      } else {
        res.status(200).json(result);
      }
    }
  );
});

module.exports = router;
