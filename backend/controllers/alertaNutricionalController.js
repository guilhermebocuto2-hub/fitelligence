const alertaNutricionalService = require('../services/alertaNutricionalService');

const buscarAlertaNutricional = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const alerta = await alertaNutricionalService.obterAlertaNutricional(usuarioId);

    return res.status(200).json(alerta);
  } catch (error) {
    console.error('Erro ao buscar alerta nutricional:', error);
    return res.status(500).json({
      erro: 'Erro ao buscar alerta nutricional',
      detalhe: error.message
    });
  }
};

module.exports = {
  buscarAlertaNutricional
};