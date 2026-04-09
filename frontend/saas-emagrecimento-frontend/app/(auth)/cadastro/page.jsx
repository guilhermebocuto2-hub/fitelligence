"use client";

// ======================================================
// Página de cadastro do Fitelligence
// Responsável por:
// - criar uma nova conta
// - validar campos essenciais no frontend
// - integrar com o backend de cadastro
// - oferecer experiência premium e mobile-first
// ======================================================

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { registerService, loginService } from "../../../src/services/authService";

// ======================================================
// Variantes simples de animação
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

export default function CadastroPage() {
  const router = useRouter();

  // ====================================================
  // Estados locais do formulário
  // ====================================================
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // ====================================================
  // Função principal de cadastro
  // ====================================================
  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");

    // ================================================
    // Log temporario de clique:
    // confirma que o submit foi disparado no frontend.
    // ================================================
    if (process.env.NODE_ENV !== "production") {
      console.log("BOTÃO [CADASTRO] CLICADO");
    }

    // ==================================================
    // Validações básicas do frontend
    // ==================================================
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("A confirmação de senha não confere.");
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
          endpoint: `${process.env.NEXT_PUBLIC_API_URL}/usuarios`,
          method: "POST",
        });

        console.log("[CADASTRO-DEBUG] submit iniciado", {
          endpoint: `${process.env.NEXT_PUBLIC_API_URL}/usuarios`,
          method: "POST",
          payload: { nome, email, senha: "***" },
        });
      }

      // ================================================
      // Log temporário de diagnóstico:
      // valida no device qual URL base foi embutida no build.
      // ================================================
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "[CADASTRO-DEBUG] NEXT_PUBLIC_API_URL:",
          process.env.NEXT_PUBLIC_API_URL
        );
      }
      console.log("BOTÃO CLICADO");

      // ================================================
      // Cria a conta no backend
      // ================================================
      await registerService({
        nome,
        email,
        senha,
      });

      // ================================================
      // Estratégia premium:
      // após criar a conta, fazemos login automático
      // e enviamos o usuário para o onboarding
      // ================================================
      const respostaLogin = await loginService(email, senha);

      const token =
        respostaLogin?.token ||
        respostaLogin?.data?.token ||
        respostaLogin?.data?.data?.token ||
        null;

      if (token) {
        localStorage.setItem("token", token);
      }

      // ================================================
      // Log temporário de sucesso:
      // confirma token e próximo passo.
      // ================================================
      if (process.env.NODE_ENV !== "production") {
        console.log("[DEBUG] sucesso", respostaLogin);

        console.log("[CADASTRO-DEBUG] cadastro+login concluídos", {
          tokenRecebido: Boolean(token),
          proximoDestino: "/onboarding",
        });
      }

      router.push("/onboarding");
    } catch (error) {
      // ================================================
      // Log temporário detalhado para diagnosticar
      // "Failed to fetch" no app Android.
      // ================================================
      if (process.env.NODE_ENV !== "production") {
        console.log("[DEBUG] erro completo", {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
        });

        console.log("[CADASTRO-DEBUG] erro completo:", {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
        });
      }

      setErro(error.message || "Não foi possível criar a sua conta.");
    } finally {
      setLoading(false);
    }
  }

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
        className="relative z-10 w-full max-w-xl"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <section>
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
              <Sparkles className="h-4 w-4" />
              Novo acesso
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Criar conta no Fitelligence
            </h1>

            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Comece sua jornada com uma conta nova e entre no onboarding
              inteligente da plataforma.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* NOME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nome
                </label>

                <input
                  type="text"
                  placeholder="Digite seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-violet-500"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  E-mail
                </label>

                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-violet-500"
                />
              </div>

              {/* SENHA */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Senha
                </label>

                <input
                  type="password"
                  placeholder="Crie uma senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-violet-500"
                />
              </div>

              {/* CONFIRMAR SENHA */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirmar senha
                </label>

                <input
                  type="password"
                  placeholder="Repita sua senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-violet-500"
                />
              </div>

              {/* ERRO */}
              {erro ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  {erro}
                </div>
              ) : null}

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Criando conta..." : "Criar conta"}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>

            {/* LINK PARA LOGIN */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Já tem conta?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-violet-600 transition hover:text-violet-500 dark:text-violet-300 dark:hover:text-violet-200"
                >
                  Entrar agora
                </Link>
              </p>
            </div>

            {/* INFO DE RODAPÉ */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Após criar sua conta, você será encaminhado para iniciar sua
                  configuração inteligente dentro do Fitelligence.
                </p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </main>
  );
}
