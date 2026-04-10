require("dotenv").config();
const mysql = require("mysql2/promise");

// ======================================================
// Configuração do pool de conexão
// - Em produção no Railway, usamos MYSQL_URL e extraímos
//   os dados da connection string para aplicar ajustes de
//   pool de forma explícita.
// - Em desenvolvimento local, mantemos fallback via DB_*.
// ======================================================
const railwayDatabaseUrl = process.env.MYSQL_URL;

const pool = railwayDatabaseUrl
  ? (() => {
      const parsedUrl = new URL(railwayDatabaseUrl);

      return mysql.createPool({
        host: parsedUrl.hostname,
        port: Number(parsedUrl.port || 3306),
        user: decodeURIComponent(parsedUrl.username),
        password: decodeURIComponent(parsedUrl.password),
        database: parsedUrl.pathname.replace(/^\//, ""),
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });
    })()
  : mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "saas_emagrecimento",
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

// ======================================================
// Teste inicial da conexão
// No Railway, se o banco estiver indisponível no boot,
// registramos o erro sem derrubar o servidor para evitar
// indisponibilidade HTTP desnecessária.
// ======================================================
async function testConnection() {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.ping();
    console.log("Conectado ao MySQL com sucesso");
  } catch (err) {
    console.error("Erro ao conectar no MySQL:", err);
  } finally {
    if (connection) connection.release();
  }
}

testConnection();

module.exports = pool;
