async function gerarDieta(calorias) {
  return `
Plano alimentar para ${calorias} calorias

Café da manhã
- 2 ovos mexidos
- 1 banana
- café sem açúcar

Lanche da manhã
- 1 iogurte natural

Almoço
- 100g de arroz
- 150g de frango grelhado
- salada verde

Lanche da tarde
- 1 maçã
- 10 castanhas

Jantar
- omelete com legumes
`
}

module.exports = gerarDieta