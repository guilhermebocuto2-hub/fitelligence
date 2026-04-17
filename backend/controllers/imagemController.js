const imagemService = require("../services/imagemService");
const analisadorRefeicao = require("../services/analisadorRefeicao");
const analiseRefeicaoModel = require("../models/analiseRefeicaoModel");
const analiseCorporalModel = require("../models/analiseCorporalModel");
const { analisarCorpo } = require("../services/analisadorCorporal");

const obterUsuarioId = (req) => {
  return req.usuario?.id || req.user?.id || req.usuarioId || null;
};

const enviarImagemCorporal = async (req, res) => {
  try {
    const usuario_id = obterUsuarioId(req);

    if (!usuario_id) {
      return res.status(401).json({
        success: false,
        message: "Usuario nao autenticado",
      });
    }

    const { descricao } = req.body;
    const arquivo = req.file;

    if (!arquivo) {
      return res.status(400).json({
        success: false,
        message: "Nenhuma imagem enviada",
      });
    }

    const nome_arquivo = arquivo.filename;
    const caminho_arquivo = arquivo.path.replace(/\\/g, "/");

    const imagensUsuario = await imagemService.listarImagensUsuario(usuario_id);
    const imagensCorporais = Array.isArray(imagensUsuario)
      ? imagensUsuario.filter(
          (item) => String(item?.tipo || "").toLowerCase() === "corporal"
        )
      : [];
    const imagemAnterior = imagensCorporais[0] || null;

    const imagemSalva = await imagemService.salvarImagem({
      usuario_id,
      tipo: "corporal",
      nome_arquivo,
      caminho_arquivo,
      descricao: descricao || null,
    });

    const analiseCorporal = await analisarCorpo({
      totalFotos: imagensCorporais.length + 1,
      possuiComparacao: Boolean(imagemAnterior),
      descricaoAtual: descricao || "",
      filePath: arquivo.path,
    });

    const analiseSalva = await analiseCorporalModel.criar({
      usuario_id,
      imagem_id: imagemSalva.id,
      imagem_anterior_id: imagemAnterior?.id || null,
      ...analiseCorporal,
    });

    return res.status(201).json({
      success: true,
      message: "Imagem corporal enviada com sucesso",
      data: {
        imagem: imagemSalva,
        analise_corporal: analiseSalva,
      },
    });
  } catch (error) {
    console.error("Erro ao enviar imagem corporal:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao enviar imagem corporal",
      error: error.message,
    });
  }
};

const enviarImagemRefeicao = async (req, res) => {
  try {
    const usuario_id = obterUsuarioId(req);

    if (!usuario_id) {
      return res.status(401).json({
        success: false,
        message: "Usuario nao autenticado",
      });
    }

    const { descricao } = req.body;
    const arquivo = req.file;

    if (!arquivo) {
      return res.status(400).json({
        success: false,
        message: "Nenhuma imagem enviada",
      });
    }

    const nome_arquivo = arquivo.filename;
    const caminho_arquivo = arquivo.path.replace(/\\/g, "/");

    const imagemSalva = await imagemService.salvarImagem({
      usuario_id,
      tipo: "refeicao",
      nome_arquivo,
      caminho_arquivo,
      descricao: descricao || null,
    });

    const analise = await analisadorRefeicao.analisar({
      nomeArquivo: nome_arquivo,
      descricao: descricao || "",
      filePath: arquivo.path,
    });

    const analiseSalva = await analiseRefeicaoModel.criar({
      usuario_id,
      imagem_id: imagemSalva.id,
      calorias_estimadas: analise.calorias_estimadas,
      proteinas: analise.proteinas,
      carboidratos: analise.carboidratos,
      gorduras: analise.gorduras,
      classificacao: analise.classificacao,
      descricao: analise.descricao,
      observacoes: analise.observacoes,
      tipo_refeicao: analise.tipo_refeicao,
      sugestao_proximo_passo: analise.sugestao_proximo_passo,
    });

    return res.status(201).json({
      success: true,
      message: "Imagem de refeicao enviada e analisada com sucesso",
      data: {
        imagem: imagemSalva,
        analise: analiseSalva,
      },
    });
  } catch (error) {
    console.error("Erro ao enviar imagem de refeicao:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao enviar imagem de refeicao",
      error: error.message,
    });
  }
};

const listarImagens = async (req, res) => {
  try {
    const usuario_id = obterUsuarioId(req);

    if (!usuario_id) {
      return res.status(401).json({
        success: false,
        message: "Usuario nao autenticado",
      });
    }

    const imagens = await imagemService.listarImagensUsuario(usuario_id);

    return res.status(200).json({
      success: true,
      data: imagens,
    });
  } catch (error) {
    console.error("Erro ao listar imagens:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao listar imagens",
      error: error.message,
    });
  }
};

module.exports = {
  enviarImagemCorporal,
  enviarImagemRefeicao,
  listarImagens,
};
