// ======================================================
// Analisa tendência de evolução
// ======================================================

export function analyzeEvolution(data = []) {
  if (!data.length || data.length < 2) {
    return {
      trend: "neutral",
      message: "Ainda não há dados suficientes para análise.",
    };
  }

  const first = data[0].peso;
  const last = data[data.length - 1].peso;

  const diff = first - last;

  if (diff > 0.5) {
    return {
      trend: "down",
      message: "Tendência de redução corporal identificada.",
    };
  }

  if (diff < -0.5) {
    return {
      trend: "up",
      message: "Oscilação com aumento recente detectado.",
    };
  }

  return {
    trend: "stable",
    message: "O comportamento está estável no momento.",
  };
}