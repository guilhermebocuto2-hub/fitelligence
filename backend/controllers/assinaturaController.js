const assinaturaService = require('../services/assinaturaService');

async function listarPlanos(req, res) {

  const planos = await assinaturaService.listarPlanos();

  return res.json({
    success: true,
    data: planos
  });
}

async function assinarPlano(req, res) {

  try {

    const usuarioId = req.user.id;
    const { plano_id } = req.body;

    const assinatura = await assinaturaService.assinarPlano(usuarioId, plano_id);

    return res.status(201).json({
      success: true,
      message: 'Assinatura criada com sucesso',
      data: assinatura
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

}

async function minhaAssinatura(req, res) {

  const usuarioId = req.user.id;

  const assinatura = await assinaturaService.minhaAssinatura(usuarioId);

  return res.json({
    success: true,
    data: assinatura
  });
}

module.exports = {
  listarPlanos,
  assinarPlano,
  minhaAssinatura
};