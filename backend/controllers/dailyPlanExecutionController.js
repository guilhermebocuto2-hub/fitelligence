const dailyPlanExecutionService = require("../services/dailyPlanExecutionService");

async function getExecution(req, res) {
  try {
    const usuarioId = req.usuario?.id || req.user?.id || req.usuarioId;

    if (!usuarioId) {
      return res.status(401).json({ erro: "Usuario nao autenticado" });
    }

    const resultado = await dailyPlanExecutionService.obterExecucaoDoDia(usuarioId);

    if (resultado.status === "usuario_nao_encontrado") {
      return res.status(404).json({
        erro: "Usuario nao encontrado",
        execution: null,
      });
    }

    return res.status(200).json({
      mensagem: "Execucao do dia carregada com sucesso",
      data: resultado.data,
      execution: resultado.execution,
      score_dia: resultado.score_dia,
      streak_dias: resultado.streak_dias,
      motivacao_do_dia: resultado.motivacao_do_dia,
    });
  } catch (error) {
    console.error("Erro ao carregar execucao do plano:", error);
    return res.status(500).json({
      erro: "Erro interno ao carregar execucao do plano",
      detalhe: error.message,
    });
  }
}

async function postExecution(req, res) {
  try {
    const usuarioId = req.usuario?.id || req.user?.id || req.usuarioId;

    if (!usuarioId) {
      return res.status(401).json({ erro: "Usuario nao autenticado" });
    }

    const resultado = await dailyPlanExecutionService.atualizarExecucaoDoDia(
      usuarioId,
      req.body || {}
    );

    if (resultado.status === "usuario_nao_encontrado") {
      return res.status(404).json({
        erro: "Usuario nao encontrado",
        execution: null,
      });
    }

    return res.status(200).json({
      mensagem: "Execucao do dia atualizada com sucesso",
      data: resultado.data,
      execution: resultado.execution,
      score_dia: resultado.score_dia,
      streak_dias: resultado.streak_dias,
      motivacao_do_dia: resultado.motivacao_do_dia,
    });
  } catch (error) {
    console.error("Erro ao atualizar execucao do plano:", error);
    return res.status(500).json({
      erro: "Erro interno ao atualizar execucao do plano",
      detalhe: error.message,
    });
  }
}

module.exports = {
  getExecution,
  postExecution,
};
