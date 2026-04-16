require("dotenv").config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// ================= ROTAS =================
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
const analiseRefeicaoRoutes = require('./routes/analiseRefeicaoRoutes');
const dailyPlanRoutes = require('./routes/dailyPlanRoutes');
const dailyPlanExecutionRoutes = require('./routes/dailyPlanExecutionRoutes');
const debugRoutes = require('./routes/debugRoutes');
const assinaturaRoutes = require('./routes/assinaturaRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const chatRoutes = require('./routes/chatRoutes');
const onboardingRoutes = require("./routes/onboardingRoutes");
const billingRoutes = require("./routes/billingRoutes");

// ================= MIDDLEWARE =================
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const isDevelopment = process.env.NODE_ENV !== "production";

// ================= CORS DEBUG =================
const logCorsDebug = (...args) => isDevelopment && console.log("[CORS-DEBUG]", ...args);

// ================= CORS =================
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://fitelligence-production.up.railway.app',
  'https://fitelligence-git-main-guilhermebocuto2-hubs-projects.vercel.app',
];

const allowedOriginPatterns = [
  /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/,
];

const corsOptions = {
  origin(origin, callback) {
  if (!origin) return callback(null, true);

  // 🔥 libera tudo temporariamente (fase dev)
  if (isDevelopment) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  if (allowedOriginPatterns.some((pattern) => pattern.test(origin))) {
    return callback(null, true);
  }

  console.warn("CORS bloqueado para:", origin);
  return callback(null, false);
},
  credentials: true
};

// ================= PRE-FLIGHT =================
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
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

// ================= LOG DEBUG =================
app.use((req, res, next) => {
  if (isDevelopment && (req.path.startsWith("/usuarios") || req.path.startsWith("/auth"))) {
    console.log("[HTTP-DEBUG]", {
      method: req.method,
      path: req.path,
      origin: req.headers.origin || null
    });
  }
  next();
});

// ================= MIDDLEWARES =================
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ======================================================
// ROTA PRINCIPAL
// ======================================================
app.get('/', (req, res) => {
  res.status(200).send('Fitelligence API rodando com sucesso');
});

// ======================================================
// HEALTH CHECK
// ======================================================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ================= ROTAS =================
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
app.use('/analises-refeicao', analiseRefeicaoRoutes);
app.use('/daily-plan', dailyPlanRoutes);
app.use('/daily-plan/execution', dailyPlanExecutionRoutes);
app.use('/assinaturas', assinaturaRoutes);
app.use('/billing', billingRoutes);
app.use('/stripe', stripeRoutes);
app.use('/chat', chatRoutes);
app.use('/debug', debugRoutes);
app.use("/onboarding", onboardingRoutes);


// ================= ERROR HANDLER =================
app.use(errorMiddleware);

module.exports = app;
