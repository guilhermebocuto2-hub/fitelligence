const connection = require('../database/connection');

exports.criarCheckin = async (req, res) => {
    const { humor, fome, energia, motivacao, observacao, data_registro } = req.body;
    const usuario_id = req.usuario.id;

    try {
        console.log('Body recebido em check-in:', req.body);
        console.log('Usuário autenticado em check-in:', req.usuario);

        if (!humor || !fome || !energia || !motivacao || !data_registro) {
            return res.status(400).json({
                erro: 'humor, fome, energia, motivacao e data_registro são obrigatórios'
            });
        }

        const [usuarios] = await connection.query(
            'SELECT id FROM usuarios WHERE id = ?',
            [usuario_id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        const [resultado] = await connection.query(
            `INSERT INTO checkins (usuario_id, humor, fome, energia, motivacao, observacao, data_registro)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [usuario_id, humor, fome, energia, motivacao, observacao || null, data_registro]
        );

        return res.status(201).json({
            mensagem: 'Check-in salvo com sucesso',
            checkin: {
                id: resultado.insertId,
                usuario_id,
                humor,
                fome,
                energia,
                motivacao,
                observacao: observacao || null,
                data_registro
            }
        });

    } catch (error) {
        console.error('Erro ao salvar check-in:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};

exports.listarCheckins = async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const [registros] = await connection.query(
            `SELECT id, humor, fome, energia, motivacao, observacao, data_registro, criado_em
             FROM checkins
             WHERE usuario_id = ?
             ORDER BY data_registro DESC, id DESC`,
            [usuario_id]
        );

        return res.status(200).json({
            mensagem: 'Histórico de check-ins carregado com sucesso',
            checkins: registros
        });

    } catch (error) {
        console.error('Erro ao listar check-ins:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};