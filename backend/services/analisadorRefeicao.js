"use strict";

const fs = require("fs");
const path = require("path");

// ======================================================
// Prompt enviado ao OpenAI Vision para análise de refeição
// ======================================================
const PROMPT_REFEICAO =
  "Analise esta foto de refeição. Identifique os alimentos visíveis e estime:\n" +
  "- Nome do prato/refeição\n" +
  "- Calorias totais estimadas\n" +
  "- Proteínas (g), Carboidratos (g), Gorduras (g)\n" +
  "- Classificação nutricional: excelente/bom/regular/ruim\n" +
  "- Uma observação curta sobre a refeição\n" +
  "- Um próximo passo prático para melhorar a alimentação\n" +
  "Responda APENAS em JSON válido com os campos:\n" +
  "nome_prato, calorias_estimadas, proteinas, carboidratos, gorduras, classificacao, observacoes, sugestao_proximo_passo";

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
  // Remove eventuais blocos ```json ... ``` que a API pode gerar
  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

// ======================================================
// Análise via OpenAI Vision (gpt-4o)
// Chamada somente quando OPENAI_API_KEY está configurada
// e o arquivo físico existe no disco.
// ======================================================
async function analisarComVision({ filePath, descricao }) {
  const OpenAI = require("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const imageBuffer = fs.readFileSync(filePath);
  const base64 = imageBuffer.toString("base64");
  const mime = getMimeType(filePath);

  const promptFinal = descricao
    ? `${PROMPT_REFEICAO}\n\nDescrição fornecida pelo usuário: ${descricao}`
    : PROMPT_REFEICAO;

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

  return {
    calorias_estimadas: Number(parsed.calorias_estimadas) || 0,
    proteinas: Number(parsed.proteinas) || 0,
    carboidratos: Number(parsed.carboidratos) || 0,
    gorduras: Number(parsed.gorduras) || 0,
    classificacao: parsed.classificacao || "balanceada",
    descricao: parsed.nome_prato || descricao || "Refeição analisada por IA",
    observacoes: parsed.observacoes || "",
    tipo_refeicao: "refeicao",
    sugestao_proximo_passo: parsed.sugestao_proximo_passo || "",
  };
}

// ======================================================
// Fallback heurístico — ativo quando OPENAI_API_KEY não
// está configurada ou quando a chamada Vision falha.
// Mantém o comportamento original do sistema.
// ======================================================
const normalizarTexto = (texto) =>
  String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const detectarTipoRefeicao = (textoBase) => {
  if (
    textoBase.includes("cafe da manha") ||
    textoBase.includes("cafe") ||
    textoBase.includes("pao") ||
    textoBase.includes("bolo") ||
    textoBase.includes("leite")
  )
    return "cafe_da_manha";

  if (
    textoBase.includes("almoco") ||
    textoBase.includes("arroz") ||
    textoBase.includes("feijao") ||
    textoBase.includes("frango") ||
    textoBase.includes("carne")
  )
    return "almoco";

  if (
    textoBase.includes("jantar") ||
    textoBase.includes("janta") ||
    textoBase.includes("sopa") ||
    textoBase.includes("omelete")
  )
    return "jantar";

  if (
    textoBase.includes("lanche") ||
    textoBase.includes("sanduiche") ||
    textoBase.includes("hamburguer")
  )
    return "lanche";

  return "refeicao";
};

async function analisarHeuristico({ nomeArquivo, descricao }) {
  const textoBase = normalizarTexto(`${nomeArquivo || ""} ${descricao || ""}`);

  let calorias_estimadas = 450;
  let proteinas = 20;
  let carboidratos = 45;
  let gorduras = 12;
  let classificacao = "balanceada";
  let observacoes =
    "Analise estimada com base no nome do arquivo e na descricao informada.";
  const detalhes = [];

  if (textoBase.includes("arroz")) {
    calorias_estimadas += 130;
    carboidratos += 28;
    detalhes.push("arroz detectado");
  }
  if (textoBase.includes("feijao")) {
    calorias_estimadas += 90;
    carboidratos += 14;
    proteinas += 6;
    detalhes.push("feijao detectado");
  }
  if (
    textoBase.includes("frango") ||
    textoBase.includes("grelhado") ||
    textoBase.includes("peito de frango")
  ) {
    calorias_estimadas += 160;
    proteinas += 22;
    gorduras += 4;
    detalhes.push("frango detectado");
  }
  if (textoBase.includes("carne")) {
    calorias_estimadas += 180;
    proteinas += 20;
    gorduras += 10;
    detalhes.push("carne detectada");
  }
  if (textoBase.includes("ovo") || textoBase.includes("omelete")) {
    calorias_estimadas += 90;
    proteinas += 8;
    gorduras += 7;
    detalhes.push("ovo detectado");
  }
  if (
    textoBase.includes("salada") ||
    textoBase.includes("alface") ||
    textoBase.includes("tomate") ||
    textoBase.includes("legumes")
  ) {
    calorias_estimadas += 40;
    carboidratos += 5;
    classificacao = "leve";
    detalhes.push("salada/legumes detectados");
  }
  if (
    textoBase.includes("batata frita") ||
    textoBase.includes("fritura") ||
    textoBase.includes("hamburguer") ||
    textoBase.includes("pizza") ||
    textoBase.includes("refrigerante")
  ) {
    calorias_estimadas += 250;
    gorduras += 15;
    carboidratos += 20;
    classificacao = "calorica";
    observacoes =
      "Refeicao com maior densidade calorica e potencial excesso de gorduras.";
    detalhes.push("itens caloricos detectados");
  }
  if (
    textoBase.includes("whey") ||
    textoBase.includes("proteina") ||
    textoBase.includes("atum")
  ) {
    proteinas += 15;
    detalhes.push("fonte extra de proteina detectada");
  }

  if (calorias_estimadas >= 850) classificacao = "calorica";
  else if (calorias_estimadas <= 350) classificacao = "leve";
  else if (classificacao !== "calorica" && classificacao !== "leve")
    classificacao = "balanceada";

  const tipo_refeicao = detectarTipoRefeicao(textoBase);
  const descricaoAnalise =
    detalhes.length > 0
      ? `Itens identificados: ${detalhes.join(", ")}.`
      : "Nao foi possivel identificar claramente os itens da refeicao; analise estimada de forma generica.";
  const sugestao_proximo_passo =
    classificacao === "calorica"
      ? "No proximo passo, priorize agua e uma refeicao mais leve para equilibrar o dia."
      : classificacao === "leve"
        ? "Boa base para o dia. Vale complementar com proteina para melhorar saciedade."
        : "Mantenha esse padrao e tente registrar a proxima refeicao para acompanhar consistencia.";

  return {
    calorias_estimadas,
    proteinas,
    carboidratos,
    gorduras,
    classificacao,
    descricao: descricaoAnalise,
    observacoes,
    tipo_refeicao,
    sugestao_proximo_passo,
  };
}

// ======================================================
// Função principal exportada — tenta Vision, cai no
// heurístico se a chave não estiver configurada ou se
// qualquer erro ocorrer na chamada à API.
// ======================================================
const analisar = async ({ nomeArquivo, descricao, filePath } = {}) => {
  if (process.env.OPENAI_API_KEY && filePath) {
    const resolvedPath = path.resolve(filePath);
    if (fs.existsSync(resolvedPath)) {
      try {
        console.log("[analisadorRefeicao] Usando OpenAI Vision (gpt-4o)");
        return await analisarComVision({ filePath: resolvedPath, descricao });
      } catch (err) {
        console.error(
          "[analisadorRefeicao] Falha na Vision, usando fallback heurístico:",
          err.message
        );
      }
    }
  }

  return analisarHeuristico({ nomeArquivo, descricao });
};

module.exports = {
  analisar,
  analisarRefeicao: analisar, // alias para compatibilidade com analiseRefeicaoController
};
