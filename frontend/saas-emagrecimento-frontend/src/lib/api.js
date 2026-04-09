// ======================================================
// Arquivo central de comunicação com a API
// Responsável por:
// - definir a URL base do backend
// - anexar token JWT automaticamente
// - tratar respostas de sucesso e erro
// - suportar JSON e FormData
// - padronizar os métodos GET, POST, PUT, PATCH e DELETE
// ======================================================

// ======================================================
// URL base da API vinda do .env.local
// Exemplo:
// NEXT_PUBLIC_API_URL=https://fitelligence-production.up.railway.app
// ======================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ======================================================
// Validação de segurança:
// se a variável não existir, o sistema já avisa logo
// no início, evitando erros confusos depois
// ======================================================
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não foi definida no .env.local");
}

// ======================================================
// Função para pegar o token salvo no navegador
// Em renderização do lado do servidor (SSR), o window
// não existe, então retornamos null com segurança
// ======================================================
function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

// ======================================================
// Função para limpar dados de autenticação
// Útil quando o token expira ou fica inválido
// ======================================================
function clearAuthData() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

// ======================================================
// Função auxiliar para tentar converter a resposta em JSON
// Nem toda resposta da API virá em JSON válido.
// Por isso, usamos try/catch para evitar quebra.
// ======================================================
async function parseResponse(response) {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    const text = await response.text();
    return text || null;
  } catch {
    return null;
  }
}

// ======================================================
// Função principal de request
// Responsável por:
// - montar headers
// - anexar token
// - suportar body JSON ou FormData
// - tratar erros HTTP
// ======================================================
async function request(endpoint, options = {}) {
  const token = getAuthToken();

  // ====================================================
  // Detecta se o body é FormData
  // Se for, não devemos forçar Content-Type application/json,
  // porque o browser monta automaticamente o boundary correto
  // ====================================================
  const isFormData = options.body instanceof FormData;

  // ====================================================
  // Headers base
  // Para JSON, enviamos Content-Type
  // Para FormData, deixamos o navegador definir
  // ====================================================
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  // ====================================================
  // Se existir token, adicionamos no Authorization
  // ====================================================
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // ====================================================
  // Configuração final da requisição
  // ====================================================
  const config = {
    method: options.method || "GET",
    headers,
  };

  // ====================================================
  // Se existir body:
  // - FormData vai direto
  // - objeto JS vira JSON stringificado
  // - string ou outros valores vão como estão
  // ====================================================
  if (options.body !== undefined && options.body !== null) {
    if (isFormData) {
      config.body = options.body;
    } else if (typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    } else {
      config.body = options.body;
    }
  }

  // ====================================================
  // Faz a chamada para a API
  // ====================================================
  const response = await fetch(`${API_URL}${endpoint}`, config);

  // ====================================================
  // Faz o parse da resposta sem assumir que sempre é JSON
  // ====================================================
  const data = await parseResponse(response);

  // ====================================================
  // Se a resposta não for OK, criamos um erro padronizado
  // para o restante da aplicação conseguir tratar melhor
  // ====================================================
  if (!response.ok) {
    const error = new Error(
      data?.mensagem ||
        data?.message ||
        data?.erro ||
        `Erro na requisição (${response.status})`
    );

    // ==================================================
    // Guardamos mais informações no objeto de erro
    // Isso ajuda muito nos services e nas páginas
    // ==================================================
    error.status = response.status;
    error.data = data;

    // ==================================================
    // Se o token expirou ou está inválido, limpamos a sessão
    // Mas sem forçar redirect aqui dentro.
    // A tela decide o que fazer.
    // ==================================================
    if (response.status === 401) {
      clearAuthData();
    }

    throw error;
  }

  // ====================================================
  // Se deu tudo certo, retornamos os dados já parseados
  // ====================================================
  return data;
}

// ======================================================
// Objeto principal da API
// Aqui deixamos métodos padronizados para o app inteiro
// ======================================================
export const api = {
  // ====================================================
  // GET
  // Exemplo:
  // api.get("/usuarios/perfil")
  // ====================================================
  get: (endpoint, options = {}) =>
    request(endpoint, {
      ...options,
      method: "GET",
    }),

  // ====================================================
  // POST
  // Exemplo:
  // api.post("/auth/login", { email, senha })
  // ====================================================
  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: "POST",
      body,
    }),

  // ====================================================
  // PUT
  // Exemplo:
  // api.put("/usuarios/1", dadosAtualizados)
  // ====================================================
  put: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: "PUT",
      body,
    }),

  // ====================================================
  // PATCH
  // Exemplo:
  // api.patch("/onboarding/etapa", { campo: "valor" })
  // ====================================================
  patch: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: "PATCH",
      body,
    }),

  // ====================================================
  // DELETE
  // Pode ou não receber body, dependendo do backend
  // ====================================================
  delete: (endpoint, body = null, options = {}) =>
    request(endpoint, {
      ...options,
      method: "DELETE",
      body,
    }),
};

// ======================================================
// Exportações auxiliares
// Elas podem ser úteis em AuthContext, guards e logout
// ======================================================
export { getAuthToken, clearAuthData };
