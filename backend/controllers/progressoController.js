const connection = require('../database/connection');

exports.criarProgresso = async (req, res) => {
    const { peso, cintura, observacao, data_registro } = req.body;
    const usuario_id = req.usuario.id;

    try {
        console.log('Body recebido no progresso:', req.body);
        console.log('Usuário autenticado no progresso:', req.usuario);

        if (!peso || !data_registro) {
            return res.status(400).json({
                erro: 'peso e data_registro são obrigatórios'
            });
        }

        const pesoNum = Number(peso);
        const cinturaNum = cintura ? Number(cintura) : null;

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
            `INSERT INTO progresso (usuario_id, peso, cintura, observacao, data_registro)
             VALUES (?, ?, ?, ?, ?)`,
            [usuario_id, pesoNum, cinturaNum, observacao || null, data_registro]
        );

        return res.status(201).json({
            mensagem: 'Progresso salvo com sucesso',
            progresso: {
                id: resultado.insertId,
                usuario_id,
                peso: pesoNum,
                cintura: cinturaNum,
                observacao: observacao || null,
                data_registro
            }
        });

    } catch (error) {
        console.error('Erro ao salvar progresso:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};

exports.listarProgresso = async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const [registros] = await connection.query(
            `SELECT id, peso, cintura, observacao, data_registro, criado_em
             FROM progresso
             WHERE usuario_id = ?
             ORDER BY data_registro DESC, id DESC`,
            [usuario_id]
        );

        return res.status(200).json({
            mensagem: 'Histórico de progresso carregado com sucesso',
            progresso: registros
        });

    } catch (error) {
        console.error('Erro ao listar progresso:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};