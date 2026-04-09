const progressoNutricionalService = require('../services/progressoNutricionalService');

const buscarProgressoNutricional = async (req, res) => {
  try {
    console.log('req.usuario =>', req.usuario);

    const usuarioId = req.usuario.id;

    const progresso = await progressoNutricionalService.obterProgressoNutricional(usuarioId);

    return res.status(200).json(progresso);
  } catch (error) {
    console.error('Erro completo ao buscar progresso nutricional:', error);

    return res.status(500).json({
      erro: 'Erro ao buscar progresso nutricional',
      detalhe: error.message
    });
  }
};

module.exports = {
  buscarProgressoNutricional
};