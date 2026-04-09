const connection = require('../database/connection');

exports.criarMeta = async (req, res) => {
    const { descricao, tipo, valor_meta, status, data_inicio, data_fim } = req.body;
    const usuario_id = req.usuario.id;

    try {
        console.log('Body recebido em metas:', req.body);
        console.log('Usuário autenticado em metas:', req.usuario);

        if (!descricao || !tipo || !valor_meta || !data_inicio) {
            return res.status(400).json({
                erro: 'descricao, tipo, valor_meta e data_inicio são obrigatórios'
            });
        }

        const valorMetaNum = Number(valor_meta);

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
            `INSERT INTO metas (usuario_id, descricao, tipo, valor_meta, status, data_inicio, data_fim)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                usuario_id,
                descricao,
                tipo,
                valorMetaNum,
                status || 'ativa',
                data_inicio,
                data_fim || null
            ]
        );

        return res.status(201).json({
            mensagem: 'Meta criada com sucesso',
            meta: {
                id: resultado.insertId,
                usuario_id,
                descricao,
                tipo,
                valor_meta: valorMetaNum,
                status: status || 'ativa',
                data_inicio,
                data_fim: data_fim || null
            }
        });

    } catch (error) {
        console.error('Erro ao criar meta:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};

exports.listarMetas = async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const [metas] = await connection.query(
            `SELECT id, descricao, tipo, valor_meta, status, data_inicio, data_fim, criado_em
             FROM metas
             WHERE usuario_id = ?
             ORDER BY id DESC`,
            [usuario_id]
        );

        return res.status(200).json({
            mensagem: 'Metas carregadas com sucesso',
            metas
        });

    } catch (error) {
        console.error('Erro ao listar metas:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};

exports.atualizarStatusMeta = async (req, res) => {
    const usuario_id = req.usuario.id;
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (!status) {
            return res.status(400).json({
                erro: 'status é obrigatório'
            });
        }

        const [metas] = await connection.query(
            `SELECT id FROM metas
             WHERE id = ? AND usuario_id = ?`,
            [id, usuario_id]
        );

        if (metas.length === 0) {
            return res.status(404).json({
                erro: 'Meta não encontrada'
            });
        }

        await connection.query(
            `UPDATE metas
             SET status = ?
             WHERE id = ? AND usuario_id = ?`,
            [status, id, usuario_id]
        );

        return res.status(200).json({
            mensagem: 'Status da meta atualizado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar meta:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};