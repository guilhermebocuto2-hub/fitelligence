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
// Definição compatível da tabela usuarios
// - Mantém o schema alinhado com o que o UsuarioModel já
//   consulta hoje no projeto
// - Separa colunas e índices para evitar constraints
//   duplicadas ou mal formadas em bancos já existentes
// ======================================================
const usuarioColumns = {
  nome: "VARCHAR(255) NULL",
  email: "VARCHAR(255) NOT NULL",
  senha: "VARCHAR(255) NULL",
  provider: "VARCHAR(50) NULL",
  provider_id: "VARCHAR(255) NULL",
  email_verificado: "TINYINT(1) DEFAULT 0",
  avatar_url: "TEXT NULL",
  idade: "INT NULL",
  peso: "DECIMAL(10,2) NULL",
  altura: "DECIMAL(10,2) NULL",
  objetivo: "VARCHAR(255) NULL",
  idioma: "VARCHAR(20) NULL",
  timezone: "VARCHAR(100) NULL",
  nivel_atividade: "VARCHAR(100) NULL",
  genero: "VARCHAR(50) NULL",
  tipo_usuario: "VARCHAR(50) NULL",
  plano: "VARCHAR(100) NULL",
  stripe_customer_id: "VARCHAR(255) NULL",
  stripe_subscription_id: "VARCHAR(255) NULL",
  stripe_billing_cycle: "VARCHAR(50) NULL",
  onboarding_status: "VARCHAR(50) NULL",
  onboarding_concluido_em: "DATETIME NULL",
  meta_calorica: "INT NULL",
  meta_agua: "INT NULL",
  meta_passos: "INT NULL",
  nivel_usuario: "VARCHAR(50) NULL",
  frequencia_treino_base: "VARCHAR(100) NULL",
  intensidade_treino_base: "VARCHAR(100) NULL",
  tipo_treino_base: "VARCHAR(100) NULL",
  criado_em: "DATETIME NULL",
  deleted_at: "DATETIME NULL",
  created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  updated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
};

// ======================================================
// Garante que a tabela usuarios exista com um schema base
// compatível com o projeto atual.
// ======================================================
async function ensureUsuariosTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NULL,
      email VARCHAR(255) NOT NULL,
      senha VARCHAR(255) NULL,
      provider VARCHAR(50) NULL,
      provider_id VARCHAR(255) NULL,
      email_verificado TINYINT(1) DEFAULT 0,
      avatar_url TEXT NULL,
      idade INT NULL,
      peso DECIMAL(10,2) NULL,
      altura DECIMAL(10,2) NULL,
      objetivo VARCHAR(255) NULL,
      idioma VARCHAR(20) NULL,
      timezone VARCHAR(100) NULL,
      nivel_atividade VARCHAR(100) NULL,
      genero VARCHAR(50) NULL,
      tipo_usuario VARCHAR(50) NULL,
      plano VARCHAR(100) NULL,
      stripe_customer_id VARCHAR(255) NULL,
      stripe_subscription_id VARCHAR(255) NULL,
      stripe_billing_cycle VARCHAR(50) NULL,
      onboarding_status VARCHAR(50) NULL,
      onboarding_concluido_em DATETIME NULL,
      meta_calorica INT NULL,
      meta_agua INT NULL,
      meta_passos INT NULL,
      nivel_usuario VARCHAR(50) NULL,
      frequencia_treino_base VARCHAR(100) NULL,
      intensidade_treino_base VARCHAR(100) NULL,
      tipo_treino_base VARCHAR(100) NULL,
      criado_em DATETIME NULL,
      deleted_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_usuarios_email (email)
    )
  `);
}

// ======================================================
// Validação incremental do schema da tabela usuarios
// - Preserva dados existentes
// - Adiciona apenas colunas ausentes
// - Evita depender de ADD COLUMN IF NOT EXISTS
// ======================================================
async function ensureUsuariosColumns(connection) {
  const [rows] = await connection.query(
    `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'usuarios'
    `
  );

  const existingColumns = new Set(rows.map((row) => row.COLUMN_NAME));

  for (const [columnName, columnDefinition] of Object.entries(usuarioColumns)) {
    if (existingColumns.has(columnName)) {
      continue;
    }

    await connection.query(
      `ALTER TABLE usuarios ADD COLUMN ${columnName} ${columnDefinition}`
    );

    console.log(`Coluna ${columnName} adicionada na tabela usuarios`);
  }
}

// ======================================================
// Garante índices essenciais sem criar constraints erradas
// - Valida a existência dos índices antes de criar
// - Mantém o email único para o fluxo de autenticação
// ======================================================
async function ensureUsuariosIndexes(connection) {
  const [rows] = await connection.query(
    `
      SELECT INDEX_NAME
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'usuarios'
    `
  );

  const existingIndexes = new Set(rows.map((row) => row.INDEX_NAME));

  if (!existingIndexes.has("uq_usuarios_email")) {
    await connection.query(
      "ALTER TABLE usuarios ADD CONSTRAINT uq_usuarios_email UNIQUE (email)"
    );
    console.log("Constraint uq_usuarios_email criada na tabela usuarios");
  }
}

// ======================================================
// Inicialização mínima da estrutura do banco
// - Garante a tabela usuarios
// - Valida e complementa colunas ausentes
// - Garante índices essenciais sem apagar dados
// - Não derruba o servidor se a criação falhar
// ======================================================
async function initializeDatabase() {
  let connection;

  try {
    connection = await pool.getConnection();

    await ensureUsuariosTable(connection);
    console.log("Tabela usuarios verificada/criada com sucesso");
    await ensureUsuariosColumns(connection);
    await ensureUsuariosIndexes(connection);
    console.log("Estrutura da tabela usuarios validada com sucesso");
  } catch (err) {
    console.error("Erro ao inicializar estrutura da tabela usuarios:", err);
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
