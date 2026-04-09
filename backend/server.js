require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0";

// ======================================================
// HOST em 0.0.0.0 permite acesso pela rede local,
// necessario para o app Android em dispositivo fisico.
// ======================================================
app.listen(PORT, HOST, () => {
  console.log(`[SERVER] Servidor rodando em http://${HOST}:${PORT}`);
});
