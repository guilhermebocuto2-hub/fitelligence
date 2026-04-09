const connection = require("../database/connection");
const { analisarRefeicao } = require("../services/analisadorRefeicao");

exports.criarAnaliseRefeicao = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        const { imagem_id, nome_arquivo, descricao } = req.body;

        if (!nome_arquivo) {
            return res.status(400).json({
                erro: "O campo nome_arquivo é obrigatório."
            });
        }

        const resultadoAnalise = await analisarRefeicao({
            nomeArquivo: nome_arquivo,
            descricao
        });

        const sql = `
            INSERT INTO analises_refeicao (
                usuario_id,
                imagem_id,
                nome_arquivo,
                tipo_refeicao,
                descricao,
                calorias_estimadas,
                proteinas,
                carboidratos,
                gorduras,
                classificacao,
                observacoes,
                sugestao_proximo_passo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            usuario_id,
            imagem_id || null,
            nome_arquivo,
            resultadoAnalise.tipo_refeicao,
            resultadoAnalise.descricao,
            resultadoAnalise.calorias_estimadas,
            resultadoAnalise.proteinas,
            resultadoAnalise.carboidratos,
            resultadoAnalise.gorduras,
            resultadoAnalise.classificacao,
            resultadoAnalise.observacoes,
            resultadoAnalise.sugestao_proximo_passo
        ];

        const [resultado] = await connection.execute(sql, valores);

        return res.status(201).json({
            mensagem: "Análise de refeição criada com sucesso.",
            analise: {
                id: resultado.insertId,
                usuario_id,
                imagem_id: imagem_id || null,
                nome_arquivo,
                tipo_refeicao: resultadoAnalise.tipo_refeicao,
                descricao: resultadoAnalise.descricao,
                calorias_estimadas: resultadoAnalise.calorias_estimadas,
                proteinas: resultadoAnalise.proteinas,
                carboidratos: resultadoAnalise.carboidratos,
                gorduras: resultadoAnalise.gorduras,
                classificacao: resultadoAnalise.classificacao,
                observacoes: resultadoAnalise.observacoes,
                sugestao_proximo_passo: resultadoAnalise.sugestao_proximo_passo
            }
        });
    } catch (error) {
        console.error("Erro ao criar análise de refeição:", error);
        return res.status(500).json({
            erro: "Erro interno ao criar análise de refeição."
        });
    }
};

exports.listarAnalisesRefeicao = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;

        const sql = `
            SELECT 
                id,
                usuario_id,
                imagem_id,
                nome_arquivo,
                tipo_refeicao,
                descricao,
                calorias_estimadas,
                proteinas,
                carboidratos,
                gorduras,
                classificacao,
                observacoes,
                sugestao_proximo_passo,
                criado_em
            FROM analises_refeicao
            WHERE usuario_id = ?
            ORDER BY criado_em DESC
        `;

        const [analises] = await connection.execute(sql, [usuario_id]);

        return res.status(200).json({
            total: analises.length,
            analises
        });
    } catch (error) {
        console.error("Erro ao listar análises de refeição:", error);
        return res.status(500).json({
            erro: "Erro interno ao listar análises de refeição."
        });
    }
};
