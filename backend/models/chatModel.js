const connection = require("../database/connection");

function toSafeInt(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
}

class ChatModel {
  // ======================================================
  // Busca a conversa aberta atual do usuário.
  // Mantemos uma única conversa ativa por usuário.
  // ======================================================
  static async buscarConversaAbertaPorUsuario(usuarioId) {
    const [rows] = await connection.execute(
      `
      SELECT
        id,
        usuario_id,
        status,
        origem,
        created_at,
        updated_at
      FROM conversas
      WHERE usuario_id = ? AND status = 'aberta'
      ORDER BY updated_at DESC, id DESC
      LIMIT 1
      `,
      [usuarioId]
    );

    return rows[0] || null;
  }

  // ======================================================
  // Busca uma conversa específica garantindo ownership.
  // ======================================================
  static async buscarConversaPorIdEUsuario(conversaId, usuarioId) {
    const conversaIdSeguro = toSafeInt(conversaId);

    if (!conversaIdSeguro) {
      return null;
    }

    const [rows] = await connection.execute(
      `
      SELECT
        id,
        usuario_id,
        status,
        origem,
        created_at,
        updated_at
      FROM conversas
      WHERE id = ? AND usuario_id = ?
      LIMIT 1
      `,
      [conversaIdSeguro, usuarioId]
    );

    return rows[0] || null;
  }

  // ======================================================
  // Cria uma nova conversa aberta para o usuário.
  // ======================================================
  static async criarConversa({
    usuarioId,
    status = "aberta",
    origem = "ia",
  }) {
    const [result] = await connection.execute(
      `
      INSERT INTO conversas (
        usuario_id,
        status,
        origem,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, NOW(), NOW())
      `,
      [usuarioId, status, origem]
    );

    return this.buscarConversaPorIdEUsuario(result.insertId, usuarioId);
  }

  // ======================================================
  // Reutiliza a conversa aberta existente ou cria nova.
  // ======================================================
  static async criarOuObterConversaAberta(usuarioId) {
    const existente = await this.buscarConversaAbertaPorUsuario(usuarioId);

    if (existente) {
      return existente;
    }

    return this.criarConversa({ usuarioId });
  }

  // ======================================================
  // Atualiza status e data da conversa de forma simples.
  // ======================================================
  static async atualizarConversa({
    conversaId,
    usuarioId,
    status,
    origem,
  }) {
    const conversaIdSeguro = toSafeInt(conversaId);

    if (!conversaIdSeguro) {
      return null;
    }

    await connection.execute(
      `
      UPDATE conversas
      SET
        status = COALESCE(?, status),
        origem = COALESCE(?, origem),
        updated_at = NOW()
      WHERE id = ? AND usuario_id = ?
      `,
      [status || null, origem || null, conversaIdSeguro, usuarioId]
    );

    return this.buscarConversaPorIdEUsuario(conversaIdSeguro, usuarioId);
  }

  // ======================================================
  // Salva uma nova mensagem na conversa.
  // ======================================================
  static async criarMensagem({
    conversaId,
    remetente,
    mensagem,
    tipo = "texto",
  }) {
    const conversaIdSeguro = toSafeInt(conversaId);

    const [result] = await connection.execute(
      `
      INSERT INTO mensagens (
        conversa_id,
        remetente,
        mensagem,
        tipo,
        created_at
      ) VALUES (?, ?, ?, ?, NOW())
      `,
      [conversaIdSeguro, remetente, mensagem, tipo]
    );

    const [rows] = await connection.execute(
      `
      SELECT
        id,
        conversa_id,
        remetente,
        mensagem,
        tipo,
        created_at
      FROM mensagens
      WHERE id = ?
      LIMIT 1
      `,
      [result.insertId]
    );

    return rows[0] || null;
  }

  // ======================================================
  // Lista mensagens de uma conversa já validada.
  // ======================================================
  static async listarMensagensPorConversa(conversaId) {
    const conversaIdSeguro = toSafeInt(conversaId);

    const [rows] = await connection.execute(
      `
      SELECT
        id,
        conversa_id,
        remetente,
        mensagem,
        tipo,
        created_at
      FROM mensagens
      WHERE conversa_id = ?
      ORDER BY created_at ASC, id ASC
      `,
      [conversaIdSeguro]
    );

    return rows;
  }
}

module.exports = ChatModel;
