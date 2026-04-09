require('dotenv').config();

const db = require('./database/connection');

async function testarConexao() {
  try {

    const [rows] = await db.execute('SELECT 1');

    console.log('✅ Banco conectado com sucesso!');
    console.log(rows);

  } catch (error) {

    console.error('❌ Erro na conexão com o banco:');
    console.error(error);

  }
}

testarConexao();