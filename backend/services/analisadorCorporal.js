"use strict";

const fs = require("fs");
const path = require("path");

// ======================================================
// Prompt enviado ao OpenAI Vision para análise corporal
// ======================================================
const PROMPT_CORPORAL =
  "Analise esta foto corporal de forma profissional e construtiva.\n" +
  "Com base na composição visual, estime:\n" +
  "- Um resumo visual objetivo da composição corporal\n" +
  "- Estimativa de percentual de gordura corporal\n" +
  "- Pontos de evolução visíveis (aspectos positivos, máximo 3)\n" +
  "- Pontos de atenção (áreas para trabalhar, máximo 3)\n" +
  "- Nível de consistência percebida: inicial/moderada/boa/excelente\n" +
  "- Uma recomendação curta e prática (1 frase)\n" +
  "Responda APENAS em JSON válido com os campos:\n" +
  "resumo_visual, porcentagem_gordura_estimada, pontos_de_evolucao (array de strings), pontos_de_atencao (array de strings), consistencia_percebida, recomendacao_curta";

// ======================================================
// Helpers para a chamada Vision
// ======================================================
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return map[ext] || "image/jpeg";
}

function parseOpenAIJson(content) {
  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

// ======================================================
// Análise corporal via OpenAI Vision (gpt-4o)
// ======================================================
async function analisarComVision({ filePath, descricaoAtual }) {
  const OpenAI = require("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const imageBuffer = fs.readFileSync(filePath);
  const base64 = imageBuffer.toString("base64");
  const mime = getMimeType(filePath);

  const promptFinal = descricaoAtual
    ? `${PROMPT_CORPORAL}\n\nDescrição fornecida pelo usuário: ${descricaoAtual}`
    : PROMPT_CORPORAL;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:${mime};base64,${base64}` },
          },
          {
            type: "text",
            text: promptFinal,
          },
        ],
      },
    ],
    max_tokens: 600,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content;
  const parsed = parseOpenAIJson(raw);

  const garantirArray = (val) =>
    Array.isArray(val) ? val : val ? [String(val)] : [];

  return {
    resumo_visual:
      parsed.resumo_visual || "Análise corporal concluída via IA.",
    pontos_de_evolucao: garantirArray(parsed.pontos_de_evolucao),
    pontos_de_atencao: garantirArray(parsed.pontos_de_atencao),
    consistencia_percebida: parsed.consistencia_percebida || "inicial",
    recomendacao_curta:
      parsed.recomendacao_curta ||
      "Continue registrando fotos em condições semelhantes para acompanhar sua evolução.",
  };
}

// ======================================================
// Fallback heurístico — comportamento original do sistema
// ======================================================
function analisarHeuristico({ totalFotos = 1, possuiComparacao = false, descricaoAtual = "" }) {
  const descricaoNormalizada = String(descricaoAtual || "").trim().toLowerCase();

  const resumo_visual = possuiComparacao
    ? "Nova foto corporal registrada com base suficiente para leitura comparativa leve."
    : "Primeiro registro corporal salvo com foco em acompanhar evolucao visual ao longo do tempo.";

  const pontos_de_evolucao = possuiComparacao
    ? [
        "Base visual mais consistente para comparar sua evolucao recente",
        "Maior clareza para acompanhar constancia corporal ao longo do tempo",
      ]
    : [
        "Inicio do historico corporal registrado com sucesso",
        "Base criada para comparacoes futuras com mais contexto",
      ];

  const pontos_de_atencao = descricaoNormalizada
    ? ["Mantenha angulo, luz e distancia semelhantes nas proximas fotos"]
    : ["Adicionar uma descricao curta ajuda a contextualizar melhor a evolucao"];

  return {
    resumo_visual,
    pontos_de_evolucao,
    pontos_de_atencao,
    consistencia_percebida: totalFotos >= 3 ? "boa" : "inicial",
    recomendacao_curta:
      "Registre novas fotos em condicoes parecidas para acompanhar sua evolucao com mais clareza.",
  };
}

// ======================================================
// Função principal exportada — tenta Vision, cai no
// heurístico se a chave não estiver configurada ou se
// qualquer erro ocorrer na chamada à API.
// ======================================================
async function analisarCorpo({
  totalFotos = 1,
  possuiComparacao = false,
  descricaoAtual = "",
  filePath,
} = {}) {
  if (process.env.OPENAI_API_KEY && filePath) {
    const resolvedPath = path.resolve(filePath);
    if (fs.existsSync(resolvedPath)) {
      try {
        console.log("[analisadorCorporal] Usando OpenAI Vision (gpt-4o)");
        return await analisarComVision({ filePath: resolvedPath, descricaoAtual });
      } catch (err) {
        console.error(
          "[analisadorCorporal] Falha na Vision, usando fallback heurístico:",
          err.message
        );
      }
    }
  }

  return analisarHeuristico({ totalFotos, possuiComparacao, descricaoAtual });
}

module.exports = {
  analisarCorpo,
};
