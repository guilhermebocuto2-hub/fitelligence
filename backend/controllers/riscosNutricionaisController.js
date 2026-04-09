const riscosNutricionaisService = require('../services/riscosNutricionaisService');

const buscarRiscosNutricionais = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const resultado = await riscosNutricionaisService.obterRiscosNutricionais(usuarioId);

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao buscar riscos nutricionais:', error);

    return res.status(500).json({
      erro: 'Erro ao buscar riscos nutricionais',
      detalhe: error.message
    });
  }
};

module.exports = {
  buscarRiscosNutricionais
};