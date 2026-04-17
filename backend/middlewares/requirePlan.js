"use strict";

// ======================================================
// Middleware de verificação de plano
// Responsável por:
// - bloquear rotas premium para usuários free
// - usar req.usuario.plano (já preenchido pelo authMiddleware)
// - retornar 403 claro com plano atual e planos necessários
//
// Uso nas rotas (sempre após authMiddleware):
//   router.get('/', authMiddleware, requirePlan(['premium']), controller)
// ======================================================

function requirePlan(planosPermitidos = []) {
  return (req, res, next) => {
    // Se nenhum plano foi exigido, libera
    if (!planosPermitidos.length) {
      return next();
    }

    const planoAtual = String(req.usuario?.plano || "free").toLowerCase();

    if (!planosPermitidos.includes(planoAtual)) {
      return res.status(403).json({
        success: false,
        message: "Seu plano atual não permite acessar este recurso.",
        data: {
          plano_atual: planoAtual,
          planos_permitidos: planosPermitidos,
          upgrade_url: "/premium",
        },
      });
    }

    return next();
  };
}

module.exports = requirePlan;
