const MetaModel = require("../models/metaModel");
const AppError = require("../utils/AppError");
const apiResponse = require("../utils/apiResponse");

class MetaController {
  // ======================================================
  // LISTAR METAS DO USUÁRIO AUTENTICADO
  // Responsável por:
  // - buscar o usuário autenticado com fallback seguro
  // - devolver todas as metas dele
  // ======================================================
  static async listar(req, res, next) {
    try {
      const usuarioId = req.usuario?.id || req.user?.id || req.usuarioId;

      if (!usuarioId) {
        throw new AppError("Usuário não autenticado", 401);
      }

      const metas = await MetaModel.listarPorUsuario(usuarioId);

      return res.status(200).json(
        apiResponse(true, "Metas carregadas com sucesso", {
          metas,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // ======================================================
  // CRIAR META MANUAL
  // Responsável por:
  // - validar campos obrigatórios
  // - criar meta manual respeitando o schema real da tabela
  // ======================================================
  static async criar(req, res, next) {
    try {
      const usuarioId = req.usuario?.id || req.user?.id || req.usuarioId;

      if (!usuarioId) {
        throw new AppError("Usuário não autenticado", 401);
      }

      const {
        descricao,
        tipo = "peso",
        valor_meta,
        status = "ativa",
        data_inicio,
        data_fim = null,
      } = req.body;

      if (!descricao || !tipo || valor_meta === undefined || !data_inicio) {
        throw new AppError(
          "descricao, tipo, valor_meta e data_inicio são obrigatórios",
          400
        );
      }

      const valorMetaNum = Number(valor_meta);

      if (Number.isNaN(valorMetaNum)) {
        throw new AppError("valor_meta precisa ser numérico", 400);
      }

      const meta = await MetaModel.criarMeta({
        usuarioId,
        descricao,
        tipoMeta: tipo,
        valorMeta: valorMetaNum,
        status,
        dataInicio: data_inicio,
        dataFim: data_fim,
      });

      return res.status(201).json(
        apiResponse(true, "Meta criada com sucesso", {
          meta,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // ======================================================
  // ATUALIZAR META
  // Responsável por:
  // - garantir que a meta pertence ao usuário
  // - atualizar apenas os campos enviados
  // ======================================================
  static async atualizar(req, res, next) {
    try {
      const usuarioId = req.usuario?.id || req.user?.id || req.usuarioId;

      if (!usuarioId) {
        throw new AppError("Usuário não autenticado", 401);
      }

      const { id } = req.params;

      const metaExistente = await MetaModel.buscarPorId({
        metaId: id,
        usuarioId,
      });

      if (!metaExistente) {
        throw new AppError("Meta não encontrada", 404);
      }

      const valorMetaConvertido =
        req.body.valor_meta !== undefined ? Number(req.body.valor_meta) : null;

      if (
        req.body.valor_meta !== undefined &&
        Number.isNaN(valorMetaConvertido)
      ) {
        throw new AppError("valor_meta precisa ser numérico", 400);
      }

      const metaAtualizada = await MetaModel.atualizarMeta({
        metaId: id,
        usuarioId,
        descricao: req.body.descricao ?? null,
        tipo: req.body.tipo ?? null,
        valorMeta: valorMetaConvertido,
        status: req.body.status ?? null,
        dataInicio: req.body.data_inicio ?? null,
        dataFim: req.body.data_fim ?? null,
      });

      return res.status(200).json(
        apiResponse(true, "Meta atualizada com sucesso", {
          meta: metaAtualizada,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // ======================================================
  // CONCLUIR META
  // Responsável por:
  // - localizar a meta do usuário
  // - marcar como concluída
  // ======================================================
  static async concluir(req, res, next) {
    try {
      const usuarioId = req.usuario?.id || req.user?.id || req.usuarioId;

      if (!usuarioId) {
        throw new AppError("Usuário não autenticado", 401);
      }

      const { id } = req.params;

      const metaExistente = await MetaModel.buscarPorId({
        metaId: id,
        usuarioId,
      });

      if (!metaExistente) {
        throw new AppError("Meta não encontrada", 404);
      }

      const metaConcluida = await MetaModel.concluirMeta({
        metaId: id,
        usuarioId,
      });

      return res.status(200).json(
        apiResponse(true, "Meta concluída com sucesso", {
          meta: metaConcluida,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MetaController;