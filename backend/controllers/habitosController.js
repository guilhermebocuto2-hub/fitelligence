const connection = require('../database/connection');

exports.criarHabito = async (req, res) => {
    const { agua_ml, horas_sono, passos, treino_realizado, data_registro } = req.body;
    const usuario_id = req.usuario.id;

    try {
        console.log('Body recebido em hábitos:', req.body);
        console.log('Usuário autenticado em hábitos:', req.usuario);

        if (!data_registro) {
            return res.status(400).json({
                erro: 'data_registro é obrigatório'
            });
        }

        const agua = agua_ml ? Number(agua_ml) : 0;
        const sono = horas_sono ? Number(horas_sono) : 0;
        const totalPassos = passos ? Number(passos) : 0;
        const treino = treino_realizado === true || treino_realizado === 'true';

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
            `INSERT INTO habitos (usuario_id, agua_ml, horas_sono, passos, treino_realizado, data_registro)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [usuario_id, agua, sono, totalPassos, treino, data_registro]
        );

        return res.status(201).json({
            mensagem: 'Hábitos salvos com sucesso',
            habito: {
                id: resultado.insertId,
                usuario_id,
                agua_ml: agua,
                horas_sono: sono,
                passos: totalPassos,
                treino_realizado: treino,
                data_registro
            }
        });

    } catch (error) {
        console.error('Erro ao salvar hábitos:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};

exports.listarHabitos = async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const [registros] = await connection.query(
            `SELECT id, agua_ml, horas_sono, passos, treino_realizado, data_registro, criado_em
             FROM habitos
             WHERE usuario_id = ?
             ORDER BY data_registro DESC, id DESC`,
            [usuario_id]
        );

        return res.status(200).json({
            mensagem: 'Histórico de hábitos carregado com sucesso',
            habitos: registros
        });

    } catch (error) {
        console.error('Erro ao listar hábitos:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};