const express = require('express');
const connection = require('../database/connection');

const router = express.Router();

router.get('/db-check', async (req, res, next) => {
  try {
    const [dbRows] = await connection.query('SELECT DATABASE() AS banco');
    const [columns] = await connection.query('SHOW COLUMNS FROM usuarios');

    return res.status(200).json({
      success: true,
      banco_em_uso: dbRows[0].banco,
      colunas_usuarios: columns.map(col => col.Field)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;