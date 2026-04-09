const dailyPlanService = require("../services/dailyPlanService");
const dailyPlanExecutionService = require("../services/dailyPlanExecutionService");

async function getDailyPlan(req, res) {
  try {
    const usuarioId = req.usuario?.id || req.user?.id || req.usuarioId;

    if (!usuarioId) {
      return res.status(401).json({
        erro: "Usuario nao autenticado",
      });
    }

    const resultado = await dailyPlanService.obterPlanoDoDia(usuarioId);
    let executionPayload = {
      execution: null,
      score_dia: 0,
      streak_dias: 0,
      motivacao_do_dia: null,
    };

    try {
      executionPayload =
        await dailyPlanExecutionService.obterExecucaoDoDia(usuarioId);
    } catch (error) {
      console.warn(
        "[DAILY_PLAN] falha ao enriquecer execucao do dia:",
        usuarioId,
        error.message
      );
    }

    if (resultado?.status === "usuario_nao_encontrado") {
      return res.status(404).json({
        erro: "Usuario nao encontrado",
        plano_do_dia: null,
      });
    }

    return res.status(200).json({
      mensagem: "Plano do dia carregado com sucesso",
      plano_do_dia: resultado?.plano_do_dia || null,
      data: resultado?.data || null,
      status: resultado?.status || "gerado",
      refreshed: Boolean(resultado?.refreshed),
      execution: executionPayload?.execution || null,
      score_dia: executionPayload?.score_dia || 0,
      streak_dias: executionPayload?.streak_dias || 0,
      motivacao_do_dia: executionPayload?.motivacao_do_dia || null,
    });
  } catch (error) {
    console.error("Erro ao buscar plano do dia:", error);
    return res.status(500).json({
      erro: "Erro interno ao buscar plano do dia",
      detalhe: error.message,
    });
  }
}

module.exports = {
  getDailyPlan,
};
