const bcrypt = require("bcryptjs");
const connection = require("../database/connection");

class UsuarioModel {
  // ======================================================
  // CRIAR USUÁRIO LOCAL
  // ======================================================
  static async create(dados) {
    const {
      nome,
      email,
      senha,
      idade = null,
      peso = null,
      altura = null,
      objetivo = null,
      idioma = "pt-BR",
      timezone = "America/Sao_Paulo",
      nivel_atividade = null,
      genero = null,
      tipo_usuario = "usuario",
    } = dados;

    const senhaHash = await bcrypt.hash(senha, 10);

    const [result] = await connection.execute(
      `
      INSERT INTO usuarios (
        nome,
        email,
        senha,
        provider,
        provider_id,
        email_verificado,
        avatar_url,
        idade,
        peso,
        altura,
        objetivo,
        idioma,
        timezone,
        nivel_atividade,
        genero,
        tipo_usuario,
        plano,
        criado_em,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, 'local', NULL, 0, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'free', NOW(), NOW(), NOW())
      `,
      [
        nome,
        email,
        senhaHash,
        idade,
        peso,
        altura,
        objetivo,
        idioma,
        timezone,
        nivel_atividade,
        genero,
        tipo_usuario,
      ]
    );

    return this.findById(result.insertId);
  }

  static async findByEmail(email) {
    const [rows] = await connection.execute(
      `
      SELECT 
        id,
        nome,
        email,
        senha,
        provider,
        provider_id,
        email_verificado,
        avatar_url,
        idade,
        peso,
        altura,
        objetivo,
        idioma,
        timezone,
        nivel_atividade,
        genero,
        tipo_usuario,
        plano,
        stripe_customer_id,
        stripe_subscription_id,
        stripe_billing_cycle,
        onboarding_status,
        onboarding_concluido_em,
        meta_calorica,
        meta_agua,
        meta_passos,
        nivel_usuario,
        frequencia_treino_base,
        intensidade_treino_base,
        tipo_treino_base,
        criado_em,
        created_at,
        updated_at,
        deleted_at
      FROM usuarios
      WHERE email = ? AND deleted_at IS NULL
      LIMIT 1
      `,
      [email]
    );

    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await connection.execute(
      `
      SELECT 
        id,
        nome,
        email,
        provider,
        provider_id,
        email_verificado,
        avatar_url,
        idade,
        peso,
        altura,
        objetivo,
        idioma,
        timezone,
        nivel_atividade,
        genero,
        tipo_usuario,
        plano,
        stripe_customer_id,
        stripe_subscription_id,
        stripe_billing_cycle,
        onboarding_status,
        onboarding_concluido_em,
        meta_calorica,
        meta_agua,
        meta_passos,
        nivel_usuario,
        frequencia_treino_base,
        intensidade_treino_base,
        tipo_treino_base,
        criado_em,
        created_at,
        updated_at,
        deleted_at
      FROM usuarios
      WHERE id = ? AND deleted_at IS NULL
      LIMIT 1
      `,
      [id]
    );

    return rows[0] || null;
  }

  // ======================================================
  // BUSCAR POR PROVIDER SOCIAL
  // ======================================================
  static async findByProvider(provider, providerId) {
    const [rows] = await connection.execute(
      `
      SELECT 
        id,
        nome,
        email,
        senha,
        provider,
        provider_id,
        email_verificado,
        avatar_url,
        idade,
        peso,
        altura,
        objetivo,
        idioma,
        timezone,
        nivel_atividade,
        genero,
        tipo_usuario,
        plano,
        stripe_customer_id,
        stripe_subscription_id,
        stripe_billing_cycle,
        onboarding_status,
        onboarding_concluido_em,
        meta_calorica,
        meta_agua,
        meta_passos,
        nivel_usuario,
        frequencia_treino_base,
        intensidade_treino_base,
        tipo_treino_base,
        criado_em,
        created_at,
        updated_at,
        deleted_at
      FROM usuarios
      WHERE provider = ? AND provider_id = ? AND deleted_at IS NULL
      LIMIT 1
      `,
      [provider, providerId]
    );

    return rows[0] || null;
  }

  // ======================================================
  // CRIAR USUÁRIO SOCIAL
  // Mantemos hash interno apenas para compatibilidade
  // com a coluna senha, sem liberar login local.
  // ======================================================
  static async createSocial({
    nome,
    email,
    provider,
    provider_id,
    email_verificado = false,
    avatar_url = null,
    idioma = "pt-BR",
    timezone = "America/Sao_Paulo",
    tipo_usuario = "usuario",
    plano = "free",
  }) {
    const senhaInterna = await bcrypt.hash(
      `${provider}:${provider_id}:${Date.now()}`,
      10
    );

    const [result] = await connection.execute(
      `
      INSERT INTO usuarios (
        nome,
        email,
        senha,
        provider,
        provider_id,
        email_verificado,
        avatar_url,
        idioma,
        timezone,
        tipo_usuario,
        plano,
        criado_em,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
      `,
      [
        nome,
        email,
        senhaInterna,
        provider,
        provider_id,
        email_verificado ? 1 : 0,
        avatar_url,
        idioma,
        timezone,
        tipo_usuario,
        plano,
      ]
    );

    return this.findById(result.insertId);
  }

  // ======================================================
  // VINCULAR OU ATUALIZAR IDENTIDADE SOCIAL
  // ======================================================
  static async updateSocialIdentity({
    usuarioId,
    provider,
    provider_id,
    email_verificado = false,
    avatar_url = null,
    nome = null,
  }) {
    await connection.execute(
      `
      UPDATE usuarios
      SET
        provider = COALESCE(?, provider),
        provider_id = COALESCE(?, provider_id),
        email_verificado = ?,
        avatar_url = COALESCE(?, avatar_url),
        nome = COALESCE(?, nome),
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        provider,
        provider_id,
        email_verificado ? 1 : 0,
        avatar_url,
        nome,
        usuarioId,
      ]
    );

    return this.findById(usuarioId);
  }

  // ======================================================
  // ATUALIZAR DADOS-BASE DO USUÁRIO A PARTIR DO ONBOARDING
  // ======================================================
  static async updateDadosBaseFromOnboarding({
    usuarioId,
    nome = null,
    idade = null,
    peso = null,
    altura = null,
    objetivo = null,
    nivel_atividade = null,
    genero = null,
    meta_calorica = null,
    meta_agua = null,
    meta_passos = null,
    nivel_usuario = null,
    frequencia_treino_base = null,
    intensidade_treino_base = null,
    tipo_treino_base = null,
  }) {
    await connection.execute(
      `
      UPDATE usuarios
      SET
        nome = COALESCE(?, nome),
        idade = COALESCE(?, idade),
        peso = COALESCE(?, peso),
        altura = COALESCE(?, altura),
        objetivo = COALESCE(?, objetivo),
        nivel_atividade = COALESCE(?, nivel_atividade),
        genero = COALESCE(?, genero),
        meta_calorica = COALESCE(?, meta_calorica),
        meta_agua = COALESCE(?, meta_agua),
        meta_passos = COALESCE(?, meta_passos),
        nivel_usuario = COALESCE(?, nivel_usuario),
        frequencia_treino_base = COALESCE(?, frequencia_treino_base),
        intensidade_treino_base = COALESCE(?, intensidade_treino_base),
        tipo_treino_base = COALESCE(?, tipo_treino_base),
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        nome,
        idade,
        peso,
        altura,
        objetivo,
        nivel_atividade,
        genero,
        meta_calorica,
        meta_agua,
        meta_passos,
        nivel_usuario,
        frequencia_treino_base,
        intensidade_treino_base,
        tipo_treino_base,
        usuarioId,
      ]
    );
  }

  // ======================================================
  // ATUALIZAR PLANO DO USUÁRIO
  // ======================================================
  static async updatePlano({
    usuarioId,
    plano,
    stripeCustomerId = null,
    stripeSubscriptionId = null,
    stripeBillingCycle = null,
  }) {
    await connection.execute(
      `
      UPDATE usuarios
      SET
        plano = ?,
        stripe_customer_id = ?,
        stripe_subscription_id = ?,
        stripe_billing_cycle = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        plano,
        stripeCustomerId,
        stripeSubscriptionId,
        stripeBillingCycle,
        usuarioId,
      ]
    );
  }

  // ======================================================
  // SOFT DELETE DA CONTA
  // MantÃ©m integridade relacional:
  // - preserva o ID do usuÃ¡rio
  // - marca deleted_at
  // - anonimiza dados centrais para reduzir retenÃ§Ã£o
  // - torna o login futuro inutilizÃ¡vel
  // ======================================================
  static async softDeleteById(usuarioId) {
    const usuarioIdSeguro = Number(usuarioId);

    if (!Number.isFinite(usuarioIdSeguro) || usuarioIdSeguro <= 0) {
      return false;
    }

    const emailRemovido = `deleted+${usuarioIdSeguro}+${Date.now()}@fitelligence.local`;
    const senhaRemovida = await bcrypt.hash(
      `deleted:${usuarioIdSeguro}:${Date.now()}`,
      10
    );

    const [result] = await connection.execute(
      `
      UPDATE usuarios
      SET
        nome = 'Conta removida',
        email = ?,
        senha = ?,
        provider = 'deleted',
        provider_id = NULL,
        email_verificado = 0,
        avatar_url = NULL,
        idade = NULL,
        peso = NULL,
        altura = NULL,
        objetivo = NULL,
        nivel_atividade = NULL,
        genero = NULL,
        stripe_customer_id = NULL,
        stripe_subscription_id = NULL,
        stripe_billing_cycle = NULL,
        onboarding_concluido_em = NULL,
        meta_calorica = NULL,
        meta_agua = NULL,
        meta_passos = NULL,
        deleted_at = NOW(),
        updated_at = NOW()
      WHERE id = ? AND deleted_at IS NULL
      `,
      [emailRemovido, senhaRemovida, usuarioIdSeguro]
    );

    return result.affectedRows > 0;
  }
}

module.exports = UsuarioModel;
