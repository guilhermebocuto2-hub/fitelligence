const assinaturaModel = require('../models/assinaturaModel');

function requirePlan(planosPermitidos = []) {
  return async (req, res, next) => {
    try {
      const usuarioId = req.user.id;

      const assinatura = await assinaturaModel.buscarAssinaturaAtivaPorUsuario(usuarioId);

      if (!assinatura) {
        return res.status(403).json({
          success: false,
          message: 'Este recurso exige uma assinatura ativa'
        });
      }

      if (
        Array.isArray(planosPermitidos) &&
        planosPermitidos.length > 0 &&
        !planosPermitidos.includes(assinatura.plano_slug)
      ) {
        return res.status(403).json({
          success: false,
          message: 'Seu plano atual não permite acessar este recurso',
          data: {
            plano_atual: assinatura.plano_slug,
            planos_permitidos: planosPermitidos
          }
        });
      }

      req.assinatura = assinatura;
      next();
    } catch (error) {
      console.error('Erro no middleware requirePlan:', error);

      return res.status(500).json({
        success: false,
        message: 'Erro interno ao validar assinatura'
      });
    }
  };
}

module.exports = requirePlan;