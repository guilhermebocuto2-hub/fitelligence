const connection = require("../database/connection");

class MetaModel {
  // ======================================================
  // LISTAR METAS DO USUÁRIO
  // Responsável por:
  // - retornar todas as metas do usuário autenticado
  // - usar a estrutura real da tabela metas
  // ======================================================
  static async listarPorUsuario(usuarioId) {
    const [rows] = await connection.execute(
      `
      SELECT
        id,
        usuario_id,
        descricao,
        tipo,
        valor_meta,
        status,
        data_inicio,
        data_fim,
        criado_em
      FROM metas
      WHERE usuario_id = ?
      ORDER BY id DESC
      `,
      [usuarioId]
    );

    return rows;
  }

  // ======================================================
  // BUSCAR META POR ID
  // Responsável por:
  // - localizar uma meta específica do usuário
  // - impedir acesso a meta de outro usuário
  // ======================================================
  static async buscarPorId({ metaId, usuarioId }) {
    const [rows] = await connection.execute(
      `
      SELECT
        id,
        usuario_id,
        descricao,
        tipo,
        valor_meta,
        status,
        data_inicio,
        data_fim,
        criado_em
      FROM metas
      WHERE id = ? AND usuario_id = ?
      LIMIT 1
      `,
      [metaId, usuarioId]
    );

    return rows[0] || null;
  }

  // ======================================================
  // BUSCAR META AUTOMÁTICA ATIVA
  // Responsável por:
  // - evitar duplicação da meta criada pelo onboarding
  // - como a tabela atual não possui coluna "origem",
  //   usamos a descrição com prefixo padronizado
  // ======================================================
  static async buscarMetaAutomaticaAtiva({ usuarioId, tipoMeta = "peso" }) {
    const [rows] = await connection.execute(
      `
      SELECT
        id,
        usuario_id,
        descricao,
        tipo,
        valor_meta,
        status,
        data_inicio,
        data_fim,
        criado_em
      FROM metas
      WHERE usuario_id = ?
        AND tipo = ?
        AND status = 'ativa'
        AND descricao LIKE 'Meta criada automaticamente a partir do onboarding:%'
      ORDER BY id DESC
      LIMIT 1
      `,
      [usuarioId, tipoMeta]
    );

    return rows[0] || null;
  }

  // ======================================================
  // CRIAR META
  // Responsável por:
  // - criar meta manual ou automática
  // - respeitar o schema atual da tabela metas
  // ======================================================
  static async criarMeta({
    usuarioId,
    descricao,
    tipoMeta = "peso",
    valorMeta,
    status = "ativa",
    dataInicio,
    dataFim = null,
  }) {
    const [result] = await connection.execute(
      `
      INSERT INTO metas (
        usuario_id,
        descricao,
        tipo,
        valor_meta,
        status,
        data_inicio,
        data_fim
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [usuarioId, descricao, tipoMeta, valorMeta, status, dataInicio, dataFim]
    );

    return this.buscarPorId({
      metaId: result.insertId,
      usuarioId,
    });
  }

  // ======================================================
  // ATUALIZAR META
  // Responsável por:
  // - atualizar campos editáveis da meta
  // - manter segurança por usuário
  // ======================================================
  static async atualizarMeta({
    metaId,
    usuarioId,
    descricao = null,
    tipo = null,
    valorMeta = null,
    status = null,
    dataInicio = null,
    dataFim = null,
  }) {
    await connection.execute(
      `
      UPDATE metas
      SET
        descricao = COALESCE(?, descricao),
        tipo = COALESCE(?, tipo),
        valor_meta = COALESCE(?, valor_meta),
        status = COALESCE(?, status),
        data_inicio = COALESCE(?, data_inicio),
        data_fim = COALESCE(?, data_fim)
      WHERE id = ? AND usuario_id = ?
      `,
      [
        descricao,
        tipo,
        valorMeta,
        status,
        dataInicio,
        dataFim,
        metaId,
        usuarioId,
      ]
    );

    return this.buscarPorId({ metaId, usuarioId });
  }

  // ======================================================
  // CONCLUIR META
  // Responsável por:
  // - marcar a meta como concluída
  // - preencher data_fim caso ainda não exista
  // ======================================================
  static async concluirMeta({ metaId, usuarioId }) {
    await connection.execute(
      `
      UPDATE metas
      SET
        status = 'concluida',
        data_fim = COALESCE(data_fim, CURDATE())
      WHERE id = ? AND usuario_id = ?
      `,
      [metaId, usuarioId]
    );

    return this.buscarPorId({ metaId, usuarioId });
  }
}

module.exports = MetaModel;