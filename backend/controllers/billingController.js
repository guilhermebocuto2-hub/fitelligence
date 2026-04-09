const billingService = require("../services/billing/billingService");

function obterUsuarioId(req) {
  // Compatibilidade com padrões já existentes no projeto.
  return req.usuario?.id || req.user?.id || req.usuarioId || null;
}

async function getBillingMe(req, res) {
  try {
    const userId = obterUsuarioId(req);

    if (!userId) {
      return res.status(401).json({
        erro: "Usuário não autenticado",
      });
    }

    const billing = await billingService.obterResumoAssinaturaPorUsuario(userId);

    return res.status(200).json(billing);
  } catch (error) {
    console.error("[BILLING] erro ao consultar /billing/me:", error);
    return res.status(500).json({
      erro: "Erro interno ao consultar status de assinatura",
      detalhe: error.message,
    });
  }
}

async function postMobileValidate(req, res) {
  try {
    const userId = obterUsuarioId(req);

    if (!userId) {
      return res.status(401).json({
        erro: "Usuário não autenticado",
      });
    }

    const resultado = await billingService.registrarEventoValidacaoMobile({
      userId,
      payload: req.body || {},
    });

    return res.status(202).json(resultado);
  } catch (error) {
    console.error("[BILLING] erro ao processar /billing/mobile/validate:", error);

    // Erros de validação retornam 400 com mensagem clara.
    if (error?.statusCode === 400) {
      return res.status(400).json({
        erro: error.message,
      });
    }

    return res.status(500).json({
      erro: "Erro interno ao registrar evento de validação mobile",
      detalhe: error.message,
    });
  }
}

module.exports = {
  getBillingMe,
  postMobileValidate,
};
