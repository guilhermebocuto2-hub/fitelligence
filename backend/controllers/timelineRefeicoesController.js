const connection = require('../database/connection');

exports.listarTimelineRefeicoes = async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const [imagens] = await connection.query(
            `SELECT id, tipo, caminho_arquivo, nome_arquivo, descricao, criado_em
             FROM imagens
             WHERE usuario_id = ? AND tipo = 'refeicao'
             ORDER BY criado_em DESC, id DESC`,
            [usuario_id]
        );

        return res.status(200).json({
            mensagem: 'Timeline de refeições carregada com sucesso',
            timeline: imagens
        });

    } catch (error) {
        console.error('Erro ao carregar timeline de refeições:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};