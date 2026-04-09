const gerarResumoAlimentarInteligente = (analises = []) => {
    if (!Array.isArray(analises) || analises.length === 0) {
        return {
            possui_dados: false,
            classificacao: 'sem_dados',
            texto: 'Ainda não há refeições analisadas suficientes para gerar um resumo alimentar inteligente.',
            pontos_positivos: [],
            pontos_atencao: [],
            recomendacao: 'Envie mais refeições para que a IA possa identificar seu padrão alimentar com mais precisão.',
            metricas: {
                total_refeicoes: 0,
                media_calorias: 0,
                media_proteinas: 0,
                media_carboidratos: 0,
                media_gorduras: 0
            }
        };
    }

    const refeicoesValidas = analises.filter((item) => {
        return (
            item &&
            item.calorias_estimadas !== null &&
            item.proteinas !== null &&
            item.carboidratos !== null &&
            item.gorduras !== null
        );
    });

    if (refeicoesValidas.length === 0) {
        return {
            possui_dados: false,
            classificacao: 'sem_dados',
            texto: 'As refeições encontradas ainda não possuem dados nutricionais suficientes para interpretação inteligente.',
            pontos_positivos: [],
            pontos_atencao: [],
            recomendacao: 'Continue analisando suas refeições para gerar insights mais completos.',
            metricas: {
                total_refeicoes: 0,
                media_calorias: 0,
                media_proteinas: 0,
                media_carboidratos: 0,
                media_gorduras: 0
            }
        };
    }

    const totalRefeicoes = refeicoesValidas.length;

    const soma = refeicoesValidas.reduce(
        (acc, item) => {
            acc.calorias += Number(item.calorias_estimadas || 0);
            acc.proteinas += Number(item.proteinas || 0);
            acc.carboidratos += Number(item.carboidratos || 0);
            acc.gorduras += Number(item.gorduras || 0);
            return acc;
        },
        {
            calorias: 0,
            proteinas: 0,
            carboidratos: 0,
            gorduras: 0
        }
    );

    const mediaCalorias = Number((soma.calorias / totalRefeicoes).toFixed(1));
    const mediaProteinas = Number((soma.proteinas / totalRefeicoes).toFixed(1));
    const mediaCarboidratos = Number((soma.carboidratos / totalRefeicoes).toFixed(1));
    const mediaGorduras = Number((soma.gorduras / totalRefeicoes).toFixed(1));

    const classificacoes = refeicoesValidas.reduce((acc, item) => {
        const chave = item.classificacao || 'sem_classificacao';
        acc[chave] = (acc[chave] || 0) + 1;
        return acc;
    }, {});

    const porcentagemBoas =
        (((classificacoes.boa || 0) + (classificacoes['muito boa'] || 0)) / totalRefeicoes) * 100;

    const pontosPositivos = [];
    const pontosAtencao = [];
    let frasesResumo = [];

    // PROTEÍNAS
    if (mediaProteinas >= 25) {
        pontosPositivos.push('Boa ingestão média de proteínas nas refeições analisadas');
        frasesResumo.push('boa ingestão de proteínas');
    } else if (mediaProteinas >= 18) {
        frasesResumo.push('ingestão de proteínas razoável');
    } else {
        pontosAtencao.push('Baixa ingestão média de proteínas');
        frasesResumo.push('proteína abaixo do ideal em parte das refeições');
    }

    // CARBOIDRATOS
    if (mediaCarboidratos > 45) {
        pontosAtencao.push('Carboidratos acima do ideal em parte relevante das refeições');
        frasesResumo.push('leve excesso de carboidratos');
    } else if (mediaCarboidratos >= 20 && mediaCarboidratos <= 40) {
        pontosPositivos.push('Carboidratos em faixa equilibrada');
        frasesResumo.push('bom equilíbrio de carboidratos');
    } else if (mediaCarboidratos < 20) {
        frasesResumo.push('carboidratos mais controlados');
    }

    // GORDURAS
    if (mediaGorduras > 22) {
        pontosAtencao.push('Gorduras médias elevadas em algumas refeições');
        frasesResumo.push('gorduras um pouco elevadas em algumas refeições');
    } else if (mediaGorduras >= 8 && mediaGorduras <= 18) {
        pontosPositivos.push('Boa faixa média de gorduras nas refeições');
    }

    // CALORIAS
    if (mediaCalorias > 700) {
        pontosAtencao.push('Média calórica por refeição acima do ideal para emagrecimento');
        frasesResumo.push('refeições com densidade calórica elevada');
    } else if (mediaCalorias >= 350 && mediaCalorias <= 600) {
        pontosPositivos.push('Média calórica das refeições relativamente equilibrada');
    } else if (mediaCalorias < 300) {
        pontosAtencao.push('Algumas refeições podem estar leves demais e pouco saciantes');
    }

    // CLASSIFICAÇÃO GERAL
    let classificacao = 'regular';

    if (
        mediaProteinas >= 25 &&
        mediaCarboidratos <= 40 &&
        mediaGorduras <= 18 &&
        mediaCalorias <= 600 &&
        porcentagemBoas >= 60
    ) {
        classificacao = 'muito_bom';
    } else if (
        mediaProteinas >= 20 &&
        mediaCarboidratos <= 45 &&
        mediaGorduras <= 20 &&
        mediaCalorias <= 650
    ) {
        classificacao = 'bom';
    } else if (
        mediaProteinas < 18 ||
        mediaCarboidratos > 50 ||
        mediaGorduras > 25 ||
        mediaCalorias > 750
    ) {
        classificacao = 'precisa_melhorar';
    }

    let textoPrincipal = '';

    if (frasesResumo.length === 0) {
        textoPrincipal = 'Seu padrão alimentar recente ainda está em formação, mas já é possível observar alguns sinais iniciais.';
    } else if (frasesResumo.length === 1) {
        textoPrincipal = `Seu padrão alimentar recente mostra ${frasesResumo[0]}.`;
    } else if (frasesResumo.length === 2) {
        textoPrincipal = `Seu padrão alimentar recente mostra ${frasesResumo[0]}, porém ${frasesResumo[1]}.`;
    } else {
        textoPrincipal = `Seu padrão alimentar recente mostra ${frasesResumo[0]}, porém ${frasesResumo[1]} e ${frasesResumo[2]}.`;
    }

    let recomendacao = '';

    if (classificacao === 'muito_bom') {
        recomendacao =
            'Você está em um bom caminho. Mantenha a consistência e continue priorizando refeições com boa proteína e equilíbrio calórico.';
    } else if (classificacao === 'bom') {
        recomendacao =
            'Seu padrão alimentar está positivo, mas ainda pode evoluir com pequenos ajustes na distribuição de macronutrientes.';
    } else if (classificacao === 'regular') {
        recomendacao =
            'O ideal agora é buscar mais equilíbrio entre proteínas, carboidratos e gorduras, mantendo refeições mais estratégicas para seu objetivo.';
    } else {
        recomendacao =
            'Seu padrão atual indica espaço importante para melhora. Priorize proteínas magras, controle excessos calóricos e reduza carboidratos em refeições principais quando necessário.';
    }

    return {
        possui_dados: true,
        classificacao,
        texto: textoPrincipal,
        pontos_positivos: pontosPositivos,
        pontos_atencao: pontosAtencao,
        recomendacao,
        metricas: {
            total_refeicoes: totalRefeicoes,
            media_calorias: mediaCalorias,
            media_proteinas: mediaProteinas,
            media_carboidratos: mediaCarboidratos,
            media_gorduras: mediaGorduras,
            porcentagem_refeicoes_boas: Number(porcentagemBoas.toFixed(1))
        }
    };
};

module.exports = {
    gerarResumoAlimentarInteligente
};