const resumoNutricionalService = require('../services/resumoNutricionalService');

const buscarResumoNutricional = async (req, res) => {
    try {
        const usuario_id =
            req.usuario?.id ||
            req.user?.id ||
            req.usuarioId;

        if (!usuario_id) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Usuário não autenticado'
            });
        }

        const resumo = await resumoNutricionalService.obterResumoNutricionalDiario(usuario_id);

        return res.status(200).json({
            sucesso: true,
            resumo_nutricional: {
                total_refeicoes: Number(resumo.total_refeicoes),
                total_calorias: Number(resumo.total_calorias),
                total_proteinas: Number(resumo.total_proteinas),
                total_carboidratos: Number(resumo.total_carboidratos),
                total_gorduras: Number(resumo.total_gorduras)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar resumo nutricional:', error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar resumo nutricional diário'
        });
    }
};

module.exports = {
    buscarResumoNutricional
};