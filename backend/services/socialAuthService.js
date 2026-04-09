const UsuarioModel = require("../models/usuarioModel");
const AppError = require("../utils/AppError");

const SUPPORTED_PROVIDERS = new Set(["google", "apple"]);

function normalizeProvider(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeBoolean(value) {
  return value === true || value === 1 || value === "true";
}

function normalizeText(value) {
  const text = String(value || "").trim();
  return text || null;
}

async function findOrCreateFromSocialIdentity(payload = {}) {
  const provider = normalizeProvider(payload.provider);
  const provider_id = normalizeText(payload.provider_id);
  const email = normalizeText(payload.email)?.toLowerCase() || null;
  const nome = normalizeText(payload.nome);
  const avatar_url = normalizeText(payload.avatar_url);
  const email_verificado = normalizeBoolean(payload.email_verificado);

  // ====================================================
  // Arquitetura preparada para Google agora
  // e Apple no futuro sem retrabalho estrutural.
  // ====================================================
  if (!SUPPORTED_PROVIDERS.has(provider)) {
    throw new AppError("Provider social inválido", 400);
  }

  if (!provider_id || !email || !nome) {
    throw new AppError(
      "provider, provider_id, email e nome são obrigatórios no login social",
      400
    );
  }

  let usuario = await UsuarioModel.findByProvider(provider, provider_id);

  if (usuario) {
    return UsuarioModel.updateSocialIdentity({
      usuarioId: usuario.id,
      provider,
      provider_id,
      email_verificado,
      avatar_url,
      nome,
    });
  }

  usuario = await UsuarioModel.findByEmail(email);

  if (usuario) {
    // ==================================================
    // Compatibilidade com contas locais antigas:
    // vinculamos a identidade social ao mesmo usuário.
    // ==================================================
    return UsuarioModel.updateSocialIdentity({
      usuarioId: usuario.id,
      provider,
      provider_id,
      email_verificado,
      avatar_url,
      nome,
    });
  }

  return UsuarioModel.createSocial({
    nome,
    email,
    provider,
    provider_id,
    email_verificado,
    avatar_url,
  });
}

module.exports = {
  findOrCreateFromSocialIdentity,
};
