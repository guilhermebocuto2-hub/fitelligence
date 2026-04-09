// =============================================
// Serviço de autenticação (canônico)
// Responsável por centralizar chamadas da API
// relacionadas a:
// - login
// - login social
// - cadastro
// - perfil do usuário autenticado
// =============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não foi definida.");
}

function logAuthDebug(label, payload) {
  if (process.env.NODE_ENV === "production") return;
  try {
    console.log(`[AUTH-DEBUG] ${label}`, payload);
  } catch {
    // Não interrompe o fluxo por falha de log.
  }
}

export async function loginService(email, senha) {
  const requestUrl = `${API_URL}/auth/login`;
  const method = "POST";

  if (process.env.NODE_ENV !== "production") {
    console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("URL FINAL LOGIN:", requestUrl);
  }

  logAuthDebug("login.request", {
    method,
    url: requestUrl,
    payload: { email, senha: "***" },
  });

  let response;
  try {
    response = await fetch(requestUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
  } catch (error) {
    logAuthDebug("login.fetch_error", {
      method,
      url: requestUrl,
      errorName: error?.name,
      errorMessage: error?.message,
      errorStack: error?.stack,
    });
    throw error;
  }

  const data = await response.json();

  logAuthDebug("login.response", {
    method,
    url: requestUrl,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    throw new Error(data.message || data.mensagem || "Erro ao fazer login");
  }

  return data;
}

// =============================================
// Login social premium base
// Responsável por:
// - enviar identidade social normalizada
// - manter o mesmo JWT interno do app
// - preparar Google agora e Apple depois
// =============================================
export async function socialLoginService(payload) {
  const requestUrl = `${API_URL}/auth/social`;
  const method = "POST";

  logAuthDebug("social_login.request", {
    method,
    url: requestUrl,
    provider: payload?.provider || null,
  });

  const response = await fetch(requestUrl, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  logAuthDebug("social_login.response", {
    method,
    url: requestUrl,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    throw new Error(
      data.message || data.mensagem || "Erro ao fazer login social"
    );
  }

  return data;
}

export async function registerService(payload) {
  const requestUrl = `${API_URL}/usuarios`;
  const method = "POST";

  if (process.env.NODE_ENV !== "production") {
    console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("URL FINAL CADASTRO:", requestUrl);
  }

  logAuthDebug("register.request", {
    method,
    url: requestUrl,
    payload: {
      nome: payload?.nome,
      email: payload?.email,
      senha: "***",
    },
  });

  let response;
  try {
    response = await fetch(requestUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    logAuthDebug("register.fetch_error", {
      method,
      url: requestUrl,
      errorName: error?.name,
      errorMessage: error?.message,
      errorStack: error?.stack,
    });
    throw error;
  }

  const data = await response.json();

  logAuthDebug("register.response", {
    method,
    url: requestUrl,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    throw new Error(data.message || data.mensagem || "Erro ao criar conta");
  }

  return data;
}

export async function getPerfilService(token) {
  const requestUrl = `${API_URL}/usuarios/me`;
  const method = "GET";

  logAuthDebug("perfil.request", {
    method,
    url: requestUrl,
    hasToken: Boolean(token),
  });

  let response;
  try {
    response = await fetch(requestUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    logAuthDebug("perfil.fetch_error", {
      method,
      url: requestUrl,
      errorName: error?.name,
      errorMessage: error?.message,
      errorStack: error?.stack,
    });
    throw error;
  }

  const data = await response.json();

  logAuthDebug("perfil.response", {
    method,
    url: requestUrl,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    throw new Error(
      data.message || data.mensagem || "Erro ao buscar perfil do usuário"
    );
  }

  return data;
}
