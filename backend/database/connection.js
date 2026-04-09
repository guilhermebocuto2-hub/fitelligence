const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT DATABASE() AS banco');
    console.log('✅ MySQL conectado com sucesso');
    console.log('📌 Banco em uso:', rows[0].banco);
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar no MySQL:', error.message);
  }
}

testConnection();

module.exports = pool;
