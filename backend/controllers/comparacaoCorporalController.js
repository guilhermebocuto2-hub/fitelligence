const connection = require("../database/connection");
const analiseCorporalModel = require("../models/analiseCorporalModel");

exports.buscarComparacaoCorporal = async (req, res) => {
  const usuario_id = req.usuario?.id || req.user?.id || req.usuario_id;

  if (!usuario_id) {
    return res.status(401).json({
      erro: "Usuario nao autenticado",
    });
  }

  try {
    const analises = await analiseCorporalModel.listarPorUsuario(usuario_id);

    const [imagens] = await connection.query(
      `SELECT id, tipo, caminho_arquivo, nome_arquivo, descricao, criado_em
       FROM imagens
       WHERE usuario_id = ? AND (tipo = 'corpo' OR tipo = 'corporal')
       ORDER BY criado_em ASC`,
      [usuario_id]
    );

    if (!imagens || imagens.length === 0) {
      return res.status(200).json({
        mensagem: "Nenhuma imagem corporal encontrada",
        comparacao: null,
        analises_corporais: analises,
      });
    }

    if (imagens.length === 1) {
      return res.status(200).json({
        mensagem: "Apenas uma foto corporal encontrada",
        comparacao: {
          antes: imagens[0],
          depois: null,
          total_fotos: imagens.length,
          timeline: imagens,
          analise_atual: analises[0] || null,
        },
        analises_corporais: analises,
      });
    }

    const antes = imagens[0];
    const depois = imagens[imagens.length - 1];

    return res.status(200).json({
      mensagem: "Comparacao corporal carregada com sucesso",
      comparacao: {
        antes,
        depois,
        total_fotos: imagens.length,
        timeline: imagens,
        analise_atual: analises[0] || null,
      },
      analises_corporais: analises,
    });
  } catch (error) {
    console.error("Erro na comparacao corporal:", error);

    return res.status(500).json({
      erro: "Erro interno do servidor",
      detalhe: error.message,
    });
  }
};
