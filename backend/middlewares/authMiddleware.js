const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const connection = require("../database/connection");

// ======================================================
// Middleware de autenticação
// Responsável por:
// - validar o token JWT enviado no header Authorization
// - buscar o usuário autenticado no banco
// - anexar os dados do usuário na requisição
// - disponibilizar plano, perfil e assinatura
//   para o restante do sistema
// ======================================================
async function authMiddleware(req, res, next) {
  // ====================================================
  // Lê o header Authorization
  // Esperado no formato:
  // Bearer SEU_TOKEN
  // ====================================================
  const authHeader = req.headers.authorization;

  // ====================================================
  // Valida se o token foi enviado
  // ====================================================
  if (!authHeader) {
    return next(new AppError("Token não informado", 401));
  }

  // ====================================================
  // Separa o prefixo "Bearer" do token real
  // Exemplo:
  // "Bearer abc123" -> ["Bearer", "abc123"]
  // ====================================================
  const [, token] = authHeader.split(" ");

  // ====================================================
  // Valida se o token existe de fato
  // ====================================================
  if (!token) {
    return next(new AppError("Token mal formatado", 401));
  }

  try {
    // ==================================================
    // Decodifica e valida o JWT
    // O token deve ter sido assinado com JWT_SECRET
    // ==================================================
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ==================================================
    // Busca o usuário no banco para garantir que ele
    // ainda existe e para obter os dados mais atuais
    // do sistema:
    // - nome
    // - email
    // - tipo_usuario
    // - plano
    // - stripe_billing_cycle
    // ==================================================
    const [userRows] = await connection.query(
      `
      SELECT
        id,
        nome,
        email,
        tipo_usuario,
        plano,
        stripe_customer_id,
        stripe_subscription_id,
        stripe_billing_cycle,
        deleted_at
      FROM usuarios
      WHERE id = ?
      LIMIT 1
      `,
      [decoded.id]
    );

    // ==================================================
    // Pega o primeiro usuário encontrado
    // ==================================================
    const usuario = userRows[0];

    // ==================================================
    // Se não encontrou usuário, o token não deve seguir
    // ==================================================
    if (!usuario) {
      return next(new AppError("Usuário não encontrado", 401));
    }

    // ==================================================
    // Se o usuário estiver marcado como removido/inativo,
    // não permite seguir autenticado
    // ==================================================
    if (usuario.deleted_at) {
      return next(new AppError("Usuário indisponível para acesso", 401));
    }

    // ==================================================
    // Anexa o usuário autenticado na requisição
    // Isso permite acessar em qualquer controller:
    //
    // req.usuario.id
    // req.usuario.nome
    // req.usuario.email
    // req.usuario.tipo_usuario
    // req.usuario.plano
    // req.usuario.stripe_billing_cycle
    // ==================================================
    req.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,

      // ================================================
      // Perfil do usuário
      // Pode ser:
      // - usuario
      // - personal
      // - nutricionista
      // ================================================
      tipo_usuario: usuario.tipo_usuario || "usuario",

      // ================================================
      // Plano atual
      // Pode ser:
      // - free
      // - premium
      // ================================================
      plano: usuario.plano || "free",

      // ================================================
      // Dados de assinatura Stripe
      // ================================================
      stripe_customer_id: usuario.stripe_customer_id || null,
      stripe_subscription_id: usuario.stripe_subscription_id || null,
      stripe_billing_cycle: usuario.stripe_billing_cycle || null,
    };

    // ==================================================
    // Compatibilidade extra:
    // Alguns controllers antigos podem usar req.user
    // Mantemos ambos para evitar quebra no projeto
    // ==================================================
    req.user = req.usuario;

    // ==================================================
    // Também mantemos req.usuarioId para compatibilidade
    // com trechos antigos do sistema
    // ==================================================
    req.usuarioId = req.usuario.id;

    // ==================================================
    // Libera a execução para o próximo middleware/controller
    // ==================================================
    return next();
  } catch (error) {
    // ==================================================
    // Qualquer erro aqui normalmente significa:
    // - token inválido
    // - token expirado
    // - assinatura incorreta
    // ==================================================
    return next(new AppError("Token inválido ou expirado", 401));
  }
}

module.exports = authMiddleware;