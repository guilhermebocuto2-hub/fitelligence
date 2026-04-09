function calcularCalorias(peso, altura, idade, objetivo) {
    // Fórmula simples base
    const tmb = 10 * peso + 6.25 * (altura * 100) - 5 * idade + 5;

    if (objetivo === 'emagrecer') {
        return Math.round(tmb - 500);
    }

    if (objetivo === 'manter') {
        return Math.round(tmb);
    }

    if (objetivo === 'ganhar massa') {
        return Math.round(tmb + 300);
    }

    return Math.round(tmb);
}

module.exports = calcularCalorias;