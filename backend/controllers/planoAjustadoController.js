const connection = require('../database/connection');
const ajustarCalorias = require('../services/ajusteCalorico');
const gerarPlanoAjustado = require('../services/geradorPlanoAjustado');

exports.gerarPlanoAjustado = async (req, res) => {
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

        const [usuarios] = await connection.query(
            `SELECT id, objetivo
             FROM usuarios
             WHERE id = ?`,
            [usuario_id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        if (progresso.length < 2) {
            return res.status(400).json({
                erro: 'É necessário ter pelo menos 2 registros de progresso para gerar um plano ajustado'
            });
        }

        if (planos.length === 0) {
            return res.status(400).json({
                erro: 'Nenhum plano alimentar encontrado para este usuário'
            });
        }

        const objetivo = usuarios[0].objetivo || 'emagrecer';
        const pesoInicial = Number(progresso[0].peso);
        const pesoAtual = Number(progresso[progresso.length - 1].peso);
        const caloriasAtuais = Number(planos[0].calorias);

        const ajuste = ajustarCalorias(pesoInicial, pesoAtual, caloriasAtuais);

        const novaDieta = gerarPlanoAjustado(objetivo, ajuste.novaMetaCalorica);

        const [resultado] = await connection.query(
            `INSERT INTO planos (usuario_id, calorias, dieta)
             VALUES (?, ?, ?)`,
            [usuario_id, ajuste.novaMetaCalorica, novaDieta]
        );

        return res.status(201).json({
            mensagem: 'Plano ajustado gerado com sucesso',
            plano_ajustado: {
                id: resultado.insertId,
                usuario_id,
                objetivo,
                peso_inicial: pesoInicial,
                peso_atual: pesoAtual,
                diferenca_peso: ajuste.diferencaPeso,
                calorias_anteriores: caloriasAtuais,
                nova_meta_calorica: ajuste.novaMetaCalorica,
                status: ajuste.status,
                orientacao: ajuste.orientacao,
                dieta: novaDieta
            }
        });

    } catch (error) {
        console.error('Erro ao gerar plano ajustado:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};