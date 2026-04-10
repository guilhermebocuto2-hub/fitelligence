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
// Inicialização mínima da estrutura do banco
// - Garante a existência da tabela usuarios
// - Funciona tanto no Railway quanto no ambiente local
// - Não derruba o servidor se a criação falhar
// ======================================================
async function initializeDatabase() {
  let connection;

  try {
    connection = await pool.getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        senha VARCHAR(255) NULL,
        provider VARCHAR(50) NULL,
        provider_id VARCHAR(255) NULL,
        email_verificado TINYINT(1) DEFAULT 0,
        avatar_url TEXT NULL,
        deleted_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("Tabela usuarios verificada/criada com sucesso");
  } catch (err) {
    console.error("Erro ao inicializar tabela usuarios:", err);
  } finally {
    if (connection) connection.release();
  }
}

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
    await initializeDatabase();
  } catch (err) {
    console.error("Erro ao conectar no MySQL:", err);
  } finally {
    if (connection) connection.release();
  }
}

testConnection();

module.exports = pool;
