const consumoService = require('../services/consumoService');

function checkLimitePlano(recurso) {
  return async (req, res, next) => {

    try {

      await consumoService.verificarLimite(req.user.id, recurso);

      next();

    } catch (error) {

      return res.status(403).json({
        success:false,
        message:error.message
      });

    }

  };
}

module.exports = checkLimitePlano;