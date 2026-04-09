const connection = require('../database/connection');
const calcularCalorias = require('../services/calculoCalorias');

exports.criarPlano = async (req, res) => {
    const { peso, altura, idade, objetivo } = req.body;
    const usuario_id = req.usuario.id;

    try {
        console.log('Body recebido no plano:', req.body);
        console.log('Usuário autenticado:', req.usuario);

        if (!peso || !altura || !idade || !objetivo) {
            return res.status(400).json({
                erro: 'peso, altura, idade e objetivo são obrigatórios'
            });
        }

        const pesoNum = Number(peso);
        const alturaNum = Number(altura);
        const idadeNum = Number(idade);

        const [usuarios] = await connection.query(
            'SELECT id, nome, email FROM usuarios WHERE id = ?',
            [usuario_id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        const calorias = calcularCalorias(pesoNum, alturaNum, idadeNum, objetivo);

        const dieta = `
Café da manhã:
- 2 ovos mexidos
- 1 fatia de pão integral
- 1 fruta

Almoço:
- 150g de frango
- 100g de arroz integral
- salada à vontade

Lanche:
- iogurte natural
- 1 banana

Jantar:
- 150g de peixe ou frango
- legumes cozidos
- 1 batata-doce pequena
`;

        const [resultado] = await connection.query(
            `INSERT INTO planos (usuario_id, calorias, dieta)
             VALUES (?, ?, ?)`,
            [usuario_id, calorias, dieta]
        );

        return res.status(201).json({
            mensagem: 'Plano alimentar gerado com sucesso',
            plano: {
                id: resultado.insertId,
                usuario_id,
                objetivo,
                calorias,
                dieta
            }
        });

    } catch (error) {
        console.error('Erro ao criar plano:', error);
        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};