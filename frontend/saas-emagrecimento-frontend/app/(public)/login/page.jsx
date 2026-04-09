"use client";

// ======================================================
// PÃ¡gina de login do Fitelligence
// ResponsÃ¡vel por:
// - autenticar o usuÃ¡rio
// - exibir interface premium de acesso
// - redirecionar conforme:
//   - onboarding incompleto -> /onboarding
//   - onboarding concluÃ­do -> dashboard correto por perfil
// - oferecer acesso rÃ¡pido ao cadastro
// ======================================================

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Brain,
  Activity,
  Utensils,
} from "lucide-react";
import { useAuth } from "../../../src/context/AuthContext";

// ======================================================
// Variantes simples de animaÃ§Ã£o para entrada suave
// ======================================================
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();

  // ====================================================
  // Estados locais da tela
  // ====================================================
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ====================================================
  // Redireciona o usuÃ¡rio autenticado considerando:
  // - status do onboarding
  // - perfil do usuÃ¡rio
  // ====================================================
  const redirecionarUsuario = useCallback((usuario) => {
    if (!usuario) return;

    // ==================================================
    // Fonte principal de verdade para jornada inicial
    // ==================================================
    const onboardingStatus = usuario.onboarding_status || null;

    // ==================================================
    // Se o onboarding ainda nao foi concluido,
    // o usuario deve ir para a jornada inicial
    // ==================================================
    if (onboardingStatus !== "concluido") {
      router.replace("/onboarding");
      return;
    }

    // ==================================================
    // Fluxo simplificado:
    // todos os tipos legados convergem para /dashboard.
    // ==================================================
    router.replace("/dashboard");
  }, [router]);

  // ====================================================
  // Envia login e redireciona conforme o estado do usuÃ¡rio
  // ====================================================
  async function handleSubmit(event) {
    event.preventDefault();

    // ================================================
    // Log temporario de clique:
    // confirma que o submit foi disparado no frontend.
    // ================================================
    if (process.env.NODE_ENV !== "production") {
      console.log("BOTÃO [LOGIN] CLICADO");
    }

    setErro("");

    // ==================================================
    // ValidaÃ§Ã£o simples de campos obrigatÃ³rios
    // ==================================================
    if (!email || !senha) {
      setErro("Email e senha são obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      // ================================================
      // Log temporário de início do submit:
      // ajuda a correlacionar com logs do backend.
      // ================================================
      if (process.env.NODE_ENV !== "production") {
        console.log("[DEBUG] submit iniciado", {
          endpoint: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          method: "POST",
        });

        console.log("[LOGIN-DEBUG] submit iniciado", {
          endpoint: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          method: "POST",
          payload: { email, senha: "***" },
        });
      }

      // ================================================
      // Faz login e recebe o usuÃ¡rio autenticado
      // ================================================
      const usuario = await login(email, senha);

      if (process.env.NODE_ENV !== "production") {
        console.log("[DEBUG] sucesso", usuario);

        console.log("[LOGIN-DEBUG] login concluído", {
          usuarioId: usuario?.id || null,
          onboardingStatus: usuario?.onboarding_status || null,
        });
      }

      // ================================================
      // Redireciona conforme onboarding + perfil
      // ================================================
      redirecionarUsuario(usuario);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[DEBUG] erro completo", {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
        });

        console.log("[LOGIN-DEBUG] erro completo", {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
        });
      }
      setErro(error.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setErro("");
    setGoogleLoading(true);

    try {
      // ==================================================
      // Base pronta:
      // quando o SDK Google Web / Capacitor for conectado,
      // este ponto recebe a identidade normalizada e chama
      // a nova rota /auth/social.
      // ==================================================
      setErro("Login com Google será liberado em breve.");
      return;

      // Exemplo futuro:
      // const identidadeGoogle = await obterIdentidadeGoogle();
      // const usuario = await socialLogin({
      //   provider: "google",
      //   provider_id: identidadeGoogle.provider_id,
      //   email: identidadeGoogle.email,
      //   nome: identidadeGoogle.nome,
      //   email_verificado: identidadeGoogle.email_verificado,
      //   avatar_url: identidadeGoogle.avatar_url,
      // });
      // redirecionarUsuario(usuario);
    } catch (error) {
      setErro(error.message || "Erro ao iniciar login com Google.");
    } finally {
      setGoogleLoading(false);
    }
  }

  // ====================================================
  // Se o usuÃ¡rio jÃ¡ estiver autenticado ao abrir /login,
  // aplicamos a mesma regra de redirecionamento
  // ====================================================
  useEffect(() => {
    if (!authLoading && user) {
      redirecionarUsuario(user);
    }
  }, [user, authLoading, redirecionarUsuario]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50/50 px-4 py-8 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* ================================================= */}
      {/* FUNDO DECORATIVO */}
      {/* ================================================= */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-80px] top-[-80px] h-56 w-56 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute bottom-[-120px] right-[-80px] h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-emerald-300/10 blur-3xl dark:bg-emerald-500/10" />
      </div>

      <motion.div
        className="relative z-10 grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {/* =============================================== */}
        {/* COLUNA DE APRESENTAÃ‡ÃƒO */}
        {/* =============================================== */}
        <section className="hidden lg:block">
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
              <Sparkles className="h-4 w-4" />
              Plataforma Premium
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
              Acesse o{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Fitelligence
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Uma experiência premium para evolução corporal, inteligência
              alimentar e acompanhamento estratégico para o usuário final.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    <Brain className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      IA alimentar e corporal
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      Leituras mais profundas sobre comportamento alimentar,
                      evolução corporal e consistência da jornada.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <Activity className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      Dashboards por perfil
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      Experiência focada no usuário final, com visão clara da jornada, alimentação, progresso e consistência.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <Utensils className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      Produto pronto para mercado
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      Arquitetura pensada para escala, monetização, retenção e
                      experiência digna de loja de aplicativos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================== */}
        {/* CARD DE LOGIN */}
        {/* =============================================== */}
        <section>
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
              <ShieldCheck className="h-4 w-4" />
              Acesso seguro
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Entrar na plataforma
            </h1>

            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Faça login para acessar seu painel inteligente do Fitelligence.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  E-mail
                </label>

                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Senha
                </label>

                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-violet-500"
                />
              </div>

              {erro ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  {erro}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading || authLoading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Entrando..." : "Entrar"}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>

            <div className="mt-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                ou
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading || authLoading}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                G
              </span>
              {googleLoading ? "Conectando..." : "Continuar com Google"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ainda não tem conta?{" "}
                <Link
                  href="/cadastro"
                  className="font-semibold text-violet-600 transition hover:text-violet-500 dark:text-violet-300 dark:hover:text-violet-200"
                >
                  Criar conta
                </Link>
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              O redirecionamento considera o progresso da jornada inicial e o
              perfil do usuário dentro do Fitelligence.
            </div>
          </div>
        </section>
      </motion.div>
    </main>
  );
}


