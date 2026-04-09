function gerarPlanoAjustado(objetivo, calorias) {
    let cafeDaManha = '';
    let almoco = '';
    let lanche = '';
    let jantar = '';

    if (calorias <= 1300) {
        cafeDaManha = '- 2 ovos mexidos\n- 1 fruta';
        almoco = '- 120g de frango\n- 80g de arroz integral\n- salada à vontade';
        lanche = '- iogurte natural\n- 1 maçã';
        jantar = '- 120g de peixe\n- legumes cozidos';
    } else if (calorias <= 1600) {
        cafeDaManha = '- 2 ovos mexidos\n- 1 fatia de pão integral\n- 1 fruta';
        almoco = '- 150g de frango\n- 100g de arroz integral\n- salada à vontade';
        lanche = '- iogurte natural\n- 1 banana';
        jantar = '- 150g de peixe ou frango\n- legumes cozidos\n- 1 batata-doce pequena';
    } else {
        cafeDaManha = '- 3 ovos mexidos\n- 2 fatias de pão integral\n- 1 fruta';
        almoco = '- 180g de frango\n- 120g de arroz integral\n- salada à vontade';
        lanche = '- iogurte natural\n- 1 banana\n- 10 castanhas';
        jantar = '- 180g de carne magra ou frango\n- legumes cozidos\n- 1 batata-doce média';
    }

    return `
Plano ajustado para objetivo: ${objetivo}
Meta calórica estimada: ${calorias} kcal

Café da manhã:
${cafeDaManha}

Almoço:
${almoco}

Lanche:
${lanche}

Jantar:
${jantar}
`;
}

module.exports = gerarPlanoAjustado;