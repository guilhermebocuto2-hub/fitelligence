const connection = require('../database/connection');
const ajustarCalorias = require('../services/ajusteCalorico');

exports.buscarRecomendacao = async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const [progresso] = await connection.query(
            `SELECT id, peso, data_registro
             FROM progresso
             WHERE usuario_id = ?
             ORDER BY data_registro ASC, id ASC`,
            [usuario_id]
        );

        const [planos] = await connection.query(
            `SELECT id, calorias, dieta, criado_em
             FROM planos
             WHERE usuario_id = ?
             ORDER BY id DESC
             LIMIT 1`,
            [usuario_id]
        );

        if (progresso.length < 2) {
            return res.status(400).json({
                erro: 'É necessário ter pelo menos 2 registros de progresso para gerar recomendação'
            });
        }

        if (planos.length === 0) {
            return res.status(400).json({
                erro: 'Nenhum plano alimentar encontrado para este usuário'
            });
        }

        const pesoInicial = Number(progresso[0].peso);
        const pesoAtual = Number(progresso[progresso.length - 1].peso);
        const caloriasAtuais = Number(planos[0].calorias);

        const ajuste = ajustarCalorias(pesoInicial, pesoAtual, caloriasAtuais);

        return res.status(200).json({
            mensagem: 'Recomendação gerada com sucesso',
            recomendacao: {
                peso_inicial: pesoInicial,
                peso_atual: pesoAtual,
                diferenca_peso: ajuste.diferencaPeso,
                calorias_atuais: ajuste.caloriasAtuais,
                nova_meta_calorica: ajuste.novaMetaCalorica,
                status: ajuste.status,
                orientacao: ajuste.orientacao
            }
        });

    } catch (error) {
        console.error('Erro ao gerar recomendação:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};