const connection = require('../database/connection');

exports.listarTimelineCorporal = async (req, res) => {

    const usuario_id = req.usuario.id;

    try {

        const [imagens] = await connection.query(
            `SELECT id, tipo, caminho_arquivo, nome_arquivo, descricao, criado_em
             FROM imagens
             WHERE usuario_id = ? AND tipo = 'corpo'
             ORDER BY criado_em ASC`,
            [usuario_id]
        );

        return res.status(200).json({
            mensagem: 'Timeline corporal carregada com sucesso',
            timeline: imagens
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });

    }
};