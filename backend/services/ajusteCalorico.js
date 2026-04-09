function ajustarCalorias(pesoInicial, pesoAtual, caloriasAtuais) {
    const diferencaPeso = Number((pesoAtual - pesoInicial).toFixed(2));

    let novaMetaCalorica = caloriasAtuais;
    let status = 'progresso_adequado';
    let orientacao = 'Seu progresso está adequado. Mantenha a estratégia atual.';

    if (diferencaPeso >= 0) {
        novaMetaCalorica = caloriasAtuais - 100;
        status = 'ajuste_necessario';
        orientacao = 'Seu peso ficou estável ou aumentou. Vamos reduzir 100 calorias para estimular o emagrecimento.';
    } else if (diferencaPeso <= -3) {
        novaMetaCalorica = caloriasAtuais + 100;
        status = 'perda_muito_rapida';
        orientacao = 'Seu peso caiu muito rápido. Vamos aumentar 100 calorias para manter um processo mais equilibrado.';
    }

    return {
        diferencaPeso,
        caloriasAtuais,
        novaMetaCalorica,
        status,
        orientacao
    };
}

module.exports = ajustarCalorias;