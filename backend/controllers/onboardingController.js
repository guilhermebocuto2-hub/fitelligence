const onboardingService = require("../services/onboardingService");

// ======================================================
// Buscar onboarding completo do usuário autenticado
// ======================================================
exports.buscarOnboarding = async (req, res) => {
  try {
    // ======================================================
    // O authMiddleware salva o usuário autenticado em req.user
    // ======================================================
    const usuarioId = req.user.id;

    const resultado = await onboardingService.buscarOnboardingCompleto(usuarioId);

    return res.status(200).json({
      mensagem: "Onboarding carregado com sucesso",
      onboarding: resultado,
    });
  } catch (error) {
    console.error("Erro ao buscar onboarding:", error);

    return res.status(500).json({
      mensagem: "Erro interno ao buscar onboarding",
      erro: error.message,
    });
  }
};

// ======================================================
// Iniciar onboarding
// ======================================================
exports.iniciarOnboarding = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { perfil_tipo } = req.body;

    const resultado = await onboardingService.iniciarOnboarding({
      usuarioId,
      // Compatibilidade com clientes legados sem perfil explicito.
      perfilTipo: perfil_tipo || "usuario",
    });

    return res.status(201).json({
      mensagem: "Onboarding iniciado com sucesso",
      onboarding: resultado,
    });
  } catch (error) {
    console.error("Erro ao iniciar onboarding:", error);

    return res.status(400).json({
      mensagem: "Erro ao iniciar onboarding",
      erro: error.message,
    });
  }
};

// ======================================================
// Salvar etapa do onboarding
// ======================================================
exports.salvarEtapa = async (req, res) => {
  try {
    // ======================================================
    // Logs temporários para debug
    // Depois você pode remover
    // ======================================================
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);

    // ======================================================
    // Validação defensiva para evitar quebra
    // ======================================================
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        mensagem: "Usuário não autenticado",
        erro: "req.user.id não encontrado",
      });
    }

    const usuarioId = req.user.id;

    const { perfil_tipo, secao, etapa_atual, respostas } = req.body;

    // ======================================================
    // Validação básica do payload
    // ======================================================
    if (!secao || !etapa_atual || !respostas) {
      return res.status(400).json({
        mensagem: "Dados obrigatórios não enviados",
        erro: "secao, etapa_atual e respostas são obrigatórios",
      });
    }

    const resultado = await onboardingService.salvarEtapa({
      usuarioId,
      // Fluxo unico ativo no app: perfil padrao "usuario".
      perfilTipo: perfil_tipo || "usuario",
      secao,
      etapaAtual: etapa_atual,
      respostas,
    });

    return res.status(200).json({
      mensagem: "Etapa salva com sucesso",
      onboarding: resultado,
    });
  } catch (error) {
    console.error("Erro ao salvar etapa:", error);

    return res.status(400).json({
      mensagem: "Erro ao salvar etapa do onboarding",
      erro: error.message,
    });
  }
};

// ======================================================
// Concluir onboarding
// ======================================================
exports.concluirOnboarding = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { perfil_tipo } = req.body;

    const resultado = await onboardingService.concluirOnboarding({
      usuarioId,
      // Compatibilidade sem quebrar contrato de payload atual.
      perfilTipo: perfil_tipo || "usuario",
    });

    return res.status(200).json({
      mensagem: "Onboarding concluído com sucesso",
      onboarding: resultado.onboarding,
      redirecionar_para: resultado.redirecionarPara,
    });
  } catch (error) {
    console.error("Erro ao concluir onboarding:", error);

    return res.status(400).json({
      mensagem: "Erro ao concluir onboarding",
      erro: error.message,
    });
  }
};

// ======================================================
// Atualizar uma etapa específica do onboarding
// ======================================================
exports.atualizarEtapa = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { secao } = req.params;
    const { respostas } = req.body;

    const resultado = await onboardingService.atualizarEtapa({
      usuarioId,
      secao,
      respostas,
    });

    return res.status(200).json({
      mensagem: "Etapa atualizada com sucesso",
      onboarding: resultado,
    });
  } catch (error) {
    console.error("Erro ao atualizar etapa:", error);

    return res.status(400).json({
      mensagem: "Erro ao atualizar etapa",
      erro: error.message,
    });
  }
};
