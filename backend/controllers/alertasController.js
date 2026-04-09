const connection = require('../database/connection');

exports.buscarAlertas = async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const alertas = [];

        const [metas] = await connection.query(
            `SELECT id, descricao, tipo, valor_meta, status
             FROM metas
             WHERE usuario_id = ? AND status = 'ativa'`,
            [usuario_id]
        );

        const [habitos] = await connection.query(
            `SELECT agua_ml, horas_sono, passos, treino_realizado
             FROM habitos
             WHERE usuario_id = ?
             ORDER BY data_registro DESC, id DESC`,
            [usuario_id]
        );

        const [progresso] = await connection.query(
            `SELECT peso, data_registro
             FROM progresso
             WHERE usuario_id = ?
             ORDER BY data_registro ASC, id ASC`,
            [usuario_id]
        );

        const [checkins] = await connection.query(
            `SELECT id
             FROM checkins
             WHERE usuario_id = ?`,
            [usuario_id]
        );

        let mediaAgua = 0;
        let mediaSono = 0;
        let mediaPassos = 0;

        if (habitos.length > 0) {
            mediaAgua = Math.round(
                habitos.reduce((acc, item) => acc + Number(item.agua_ml || 0), 0) / habitos.length
            );

            mediaSono = Number(
                (
                    habitos.reduce((acc, item) => acc + Number(item.horas_sono || 0), 0) / habitos.length
                ).toFixed(2)
            );

            mediaPassos = Math.round(
                habitos.reduce((acc, item) => acc + Number(item.passos || 0), 0) / habitos.length
            );
        }

        let scoreConsistencia = 0;
        scoreConsistencia += Math.min(habitos.length * 5, 30);
        scoreConsistencia += Math.min(checkins.length * 5, 30);
        scoreConsistencia += Math.min(progresso.length * 10, 40);

        for (const meta of metas) {
            const valorMeta = Number(meta.valor_meta);

            if (meta.tipo === 'agua' && mediaAgua > 0 && mediaAgua < valorMeta) {
                alertas.push({
                    tipo: 'agua_baixa',
                    mensagem: `Sua média de água está abaixo da meta diária de ${valorMeta} ml.`
                });
            }

            if (meta.tipo === 'sono' && mediaSono > 0 && mediaSono < valorMeta) {
                alertas.push({
                    tipo: 'sono_baixo',
                    mensagem: `Seu sono médio está abaixo da meta de ${valorMeta} horas.`
                });
            }

            if (meta.tipo === 'passos' && mediaPassos > 0 && mediaPassos < valorMeta) {
                alertas.push({
                    tipo: 'passos_baixos',
                    mensagem: `Sua média de passos está abaixo da meta diária de ${valorMeta} passos.`
                });
            }
        }

        if (progresso.length >= 2) {
            const pesoInicial = Number(progresso[0].peso);
            const pesoAtual = Number(progresso[progresso.length - 1].peso);

            if (pesoAtual >= pesoInicial) {
                alertas.push({
                    tipo: 'peso_travado',
                    mensagem: 'Seu peso ficou estável ou aumentou. Pode ser hora de revisar sua estratégia.'
                });
            }
        }

        if (scoreConsistencia < 50) {
            alertas.push({
                tipo: 'baixa_consistencia',
                mensagem: 'Sua consistência recente está baixa. Tente registrar mais hábitos, check-ins e progresso.'
            });
        }

        const [metasConcluidas] = await connection.query(
            `SELECT id, descricao
             FROM metas
             WHERE usuario_id = ? AND status = 'concluida'
             ORDER BY id DESC
             LIMIT 3`,
            [usuario_id]
        );

        for (const meta of metasConcluidas) {
            alertas.push({
                tipo: 'meta_concluida',
                mensagem: `Parabéns! Você concluiu a meta: ${meta.descricao}`
            });
        }

        return res.status(200).json({
            mensagem: 'Alertas gerados com sucesso',
            alertas
        });

    } catch (error) {
        console.error('Erro ao gerar alertas:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};