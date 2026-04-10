const express = require('express');
const cors = require('cors');
const path = require('path');

const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const planoRoutes = require('./routes/planoRoutes');
const planoAjustadoRoutes = require('./routes/planoAjustadoRoutes');
const progressoRoutes = require('./routes/progressoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const recomendacaoRoutes = require('./routes/recomendacaoRoutes');
const habitosRoutes = require('./routes/habitosRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const metasRoutes = require('./routes/metasRoutes');
const alertasRoutes = require('./routes/alertasRoutes');
const imagemRoutes = require('./routes/imagemRoutes');
const timelineCorporalRoutes = require('./routes/timelineCorporalRoutes');
const comparacaoCorporalRoutes = require('./routes/comparacaoCorporalRoutes');
// const refeicaoRoutes = require('./routes/refeicaoRoutes');
const analiseRefeicaoRoutes = require('./routes/analiseRefeicaoRoutes');
const dailyPlanRoutes = require('./routes/dailyPlanRoutes');
const dailyPlanExecutionRoutes = require('./routes/dailyPlanExecutionRoutes');
const debugRoutes = require('./routes/debugRoutes');
const assinaturaRoutes = require('./routes/assinaturaRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const chatRoutes = require('./routes/chatRoutes');

const errorMiddleware = require('./middlewares/errorMiddleware');
const onboardingRoutes = require("./routes/onboardingRoutes");
const billingRoutes = require("./routes/billingRoutes");

const app = express();
const isDevelopment = process.env.NODE_ENV !== "production";

// ======================================================
// Helper de log de CORS para debug local Android/WebView:
// - ativo somente em desenvolvimento
// - ajuda a identificar origem, método e bloqueios de preflight
// ======================================================
const logCorsDebug = (...args) => isDevelopment && console.log("[CORS-DEBUG]", ...args);

// ======================================================
// CORS conservador por ambiente:
// - desenvolvimento: permite origens locais + WebView Capacitor + origin ausente
// - producao: restringe para FRONTEND_URL
// ======================================================
const corsOptions = {
  origin(origin, callback) {
    // Requisicoes sem Origin podem ocorrer em contextos nativos/WebView.
    if (!origin) {
      logCorsDebug("origin ausente aceito (webview/native request sem Origin)");
      return callback(null, true);
    }

    // ======================================================
    // Em alguns cenarios de WebView/arquivo local, a origem
    // pode chegar como string literal "null".
    // Permitimos apenas em desenvolvimento para evitar
    // bloqueio falso de CORS no app Android.
    // ======================================================
    const isNullOriginLiteral = origin === "null";

    logCorsDebug("origin recebida:", origin);

    if (isDevelopment) {
      const isCapacitorLocal = origin === "capacitor://localhost";
      const isLocalhost =
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1");
      
        const isPrivateLanIp =
        /^http:\/\/192\.168\.\d+\.\d+(?::\d+)?$/i.test(origin) ||
        /^http:\/\/10\.\d+\.\d+\.\d+(?::\d+)?$/i.test(origin) ||
        /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+(?::\d+)?$/i.test(origin);

      
        if (isCapacitorLocal || isLocalhost || isPrivateLanIp || isNullOriginLiteral) {
        logCorsDebug("origin de desenvolvimento permitida:", origin);
        return callback(null, true);
      }

      logCorsDebug("origin bloqueada no modo desenvolvimento:", origin);
      return callback(new Error("CORS bloqueado para origem de desenvolvimento."));
    }

    // Producao: restringe para a URL oficial do frontend.
    const allowedOrigins = new Set(
      [process.env.FRONTEND_URL].filter(Boolean)
    );

    if (allowedOrigins.has(origin)) {
      logCorsDebug("origin permitida em producao:", origin);
      return callback(null, true);
    }

    logCorsDebug("origin bloqueada em producao:", origin);
    return callback(new Error("CORS bloqueado para origem nao autorizada."));
  },
};

// ======================================================
// Tratamento explicito de preflight:
// - ajuda o app Android/WebView a concluir OPTIONS com sucesso
// ======================================================
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    // ======================================================
    // Navegadores/WebView podem enviar preflight com
    // Access-Control-Request-Private-Network: true
    // ao chamar API em IP privado (rede local).
    // Em dev, retornamos o cabecalho de aceite.
    // ======================================================
    if (
      isDevelopment &&
      req.headers["access-control-request-private-network"] === "true"
    ) {
      res.header("Access-Control-Allow-Private-Network", "true");
    }

    return cors(corsOptions)(req, res, next);
  }
  next();
});

// ======================================================
// Log temporário de requisições sensíveis de auth:
// - cadastro e login
// ======================================================
app.use((req, res, next) => {
  if (isDevelopment && (req.path.startsWith("/usuarios") || req.path.startsWith("/auth"))) {
    console.log("[HTTP-DEBUG]", { method: req.method, path: req.path, origin: req.headers.origin || null });
  }
  next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  return res.status(200).send('Fitelligence backend online');
});

app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
  });
});

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/planos', planoRoutes);
app.use('/planos-ajustados', planoAjustadoRoutes);
app.use('/progresso', progressoRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/recomendacoes', recomendacaoRoutes);
app.use('/habitos', habitosRoutes);
app.use('/checkins', checkinRoutes);
app.use('/metas', metasRoutes);
app.use('/alertas', alertasRoutes);
app.use('/imagens', imagemRoutes);
app.use('/timeline-corporal', timelineCorporalRoutes);
app.use('/comparacao-corporal', comparacaoCorporalRoutes);
// app.use('/refeicoes', refeicaoRoutes);
app.use('/analises-refeicao', analiseRefeicaoRoutes);
app.use('/daily-plan', dailyPlanRoutes);
app.use('/daily-plan/execution', dailyPlanExecutionRoutes);
app.use('/assinaturas', assinaturaRoutes);
app.use('/billing', billingRoutes);
app.use('/stripe', stripeRoutes);
app.use('/chat', chatRoutes);

app.use('/debug', debugRoutes);

app.use("/onboarding", onboardingRoutes);
app.use(errorMiddleware);

module.exports = app;
