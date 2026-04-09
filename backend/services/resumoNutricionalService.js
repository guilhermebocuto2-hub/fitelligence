const connection = require('../database/connection');

const obterResumoNutricionalDiario = async (usuario_id) => {
    const [rows] = await connection.execute(
        `
        SELECT
            COUNT(*) AS total_refeicoes,
            COALESCE(SUM(calorias_estimadas), 0) AS total_calorias,
            COALESCE(SUM(proteinas), 0) AS total_proteinas,
            COALESCE(SUM(carboidratos), 0) AS total_carboidratos,
            COALESCE(SUM(gorduras), 0) AS total_gorduras
        FROM analises_refeicao
        WHERE usuario_id = ?
          AND DATE(criado_em) = CURDATE()
        `,
        [usuario_id]
    );

    return rows[0];
};

module.exports = {
    obterResumoNutricionalDiario
};