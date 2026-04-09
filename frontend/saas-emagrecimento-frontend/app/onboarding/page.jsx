"use client";

// ======================================================
// PÃ¡gina principal do onboarding
// ResponsÃ¡vel por:
// - validar autenticaÃ§Ã£o antes de buscar dados protegidos
// - carregar o estado atual do onboarding
// - permitir seleÃ§Ã£o de perfil
// - montar etapas dinamicamente com base no perfil
// - renderizar campos dinÃ¢micos
// - salvar respostas por seÃ§Ã£o
// - concluir o onboarding e redirecionar corretamente
// - manter experiÃªncia premium com foco mobile-first
// ======================================================

// ======================================================
// Hooks do React
// ======================================================
import { useEffect, useMemo, useState } from "react";

// ======================================================
// NavegaÃ§Ã£o do Next.js
// ======================================================
import { useRouter } from "next/navigation";

//=======================================================
// Use  Auth 
//=======================================================
import { useAuth } from "../../src/context/AuthContext";

// ======================================================
// Layout base do onboarding
// ======================================================
import OnboardingShell from "../../src/components/onboarding/OnboardingShell";
import OnboardingFieldRenderer from "../../src/components/onboarding/OnboardingFieldRenderer";
import OnboardingProgress from "../../src/components/onboarding/OnboardingProgress";
import WellnessDisclaimer from "../../src/components/ui/WellnessDisclaimer";

// ======================================================
// Config central do onboarding
// ======================================================
import {
  onboardingStepsByRole,
  stepDefinitions,
} from "../../src/data/onboardingConfig";

// ======================================================
// Services do onboarding
// ======================================================
import {
  buscarOnboardingService,
  iniciarOnboardingService,
  salvarEtapaOnboardingService,
  concluirOnboardingService,
} from "../../src/services/onboardingService";

// ======================================================
// Helper de autenticaÃ§Ã£o
// ======================================================
import { getAuthToken } from "../../src/lib/api";

// ======================================================
// Helper para formatar tÃ­tulos automaticamente
// Exemplo: "dados-fisicos" -> "Dados Fisicos"
// ======================================================
function formatarTituloStep(stepId) {
  if (!stepId) {
    return "Nova etapa";
  }

  return stepId
    .split("-")
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

export default function OnboardingPage() {
  const router = useRouter();   
  const { refreshUser } = useAuth();

  // ====================================================
  // Estados principais da tela
  // ====================================================
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [processandoIA, setProcessandoIA] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  // ====================================================
  // Estados do fluxo
  // ====================================================
  const [perfilSelecionado, setPerfilSelecionado] = useState("");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [respostas, setRespostas] = useState({});

  // ====================================================
  // Normaliza a resposta do backend
  // Isso reduz risco de quebra quando o backend usa
  // nomes diferentes para os mesmos dados
  // ====================================================
  function normalizarRespostaOnboarding(data) {
    const payload = data?.onboarding || data?.dados || data?.data || data || {};

    const perfil =
      payload?.perfil ||
      payload?.perfil_tipo ||
      payload?.tipo_perfil ||
      payload?.perfil_usuario ||
      "";

    const concluido =
      payload?.concluido === true ||
      payload?.finalizado === true ||
      payload?.status === "concluido" ||
      false;

    const redirecionarPara =
      payload?.redirecionar_para || data?.redirecionar_para || null;

    const respostasSalvas =
      payload?.respostas ||
      payload?.dados_respostas ||
      payload?.secoes ||
      payload?.dados ||
      {};

    const etapaAtualBruta =
      payload?.etapa_atual ??
      payload?.step_atual ??
      payload?.currentStep ??
      0;

    // ==================================================
    // Alguns backends usam etapa comeÃ§ando em 1
    // No frontend usamos Ã­ndice comeÃ§ando em 0
    // ==================================================
    const etapaAtual =
      typeof etapaAtualBruta === "number" && etapaAtualBruta > 0
        ? etapaAtualBruta - 1
        : 0;

    return {
      raw: payload,
      perfil,
      concluido,
      redirecionarPara,
      respostasSalvas,
      etapaAtual,
    };
  }

  // ====================================================
  // Monta as seÃ§Ãµes reais com base no perfil selecionado
  // ====================================================
  const secoesDoPerfil = useMemo(() => {
    if (!perfilSelecionado) {
      return [];
    }

    const stepsIds = onboardingStepsByRole?.[perfilSelecionado] || [];

    return stepsIds.map((stepId) => {
      const definicao = stepDefinitions?.[stepId];

      if (definicao) {
        return definicao;
      }

      return {
        id: stepId,
        titulo: formatarTituloStep(stepId),
        descricao: "Etapa do onboarding.",
        campos: [],
      };
    });
  }, [perfilSelecionado]);

  // ====================================================
  // SeÃ§Ã£o atual do fluxo
  // ====================================================
  const secaoAtual = secoesDoPerfil[currentStepIndex] || null;

  // ====================================================
  // Chave da seÃ§Ã£o atual
  // ====================================================
  const chaveSecaoAtual =
    secaoAtual?.id ||
    secaoAtual?.key ||
    secaoAtual?.secao ||
    secaoAtual?.slug ||
    secaoAtual?.nome ||
    `secao_${currentStepIndex}`;

  // ====================================================
  // Dados preenchidos na seÃ§Ã£o atual
  // ====================================================
  const dadosDaSecaoAtual = respostas?.[chaveSecaoAtual] || {};

  // ====================================================
  // Campos normalizados da seÃ§Ã£o atual
  // ====================================================
  const camposDaSecaoAtual = useMemo(() => {
    if (!secaoAtual) {
      return [];
    }

    const camposBrutos = secaoAtual?.campos || secaoAtual?.fields || [];

    return camposBrutos.map((campo) => ({
      id: campo?.id || campo?.name || campo?.nome || campo?.key,
      name: campo?.name || campo?.nome || campo?.key || campo?.id,
      label: campo?.label || campo?.titulo || campo?.nome_exibicao || "Campo",
      type: campo?.type || campo?.tipo || "text",
      placeholder: campo?.placeholder || "",
      required: campo?.required || campo?.obrigatorio || false,
      options: campo?.options || campo?.opcoes || [],
      disabled: campo?.disabled || false,
      min: campo?.min,
      max: campo?.max,
      step: campo?.step,
      rows: campo?.rows,
      inputMode: campo?.inputMode,
    }));
  }, [secaoAtual]);

  // ====================================================
  // Carregamento inicial
  // ====================================================
  useEffect(() => {
    carregarOnboarding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====================================================
  // Busca o estado atual do onboarding
  // ====================================================
  async function carregarOnboarding() {
    try {
      setLoading(true);
      setErrorMessage("");
      setAuthMessage("");

      const token = getAuthToken();

      if (!token) {
        setAuthMessage(
          "Você precisa estar autenticado para acessar o onboarding."
        );
        return;
      }

      const data = await buscarOnboardingService();
      const onboardingNormalizado = normalizarRespostaOnboarding(data);

      setRespostas(onboardingNormalizado.respostasSalvas || {});

      const deveRedirecionar =
        onboardingNormalizado.concluido === true;

      if (deveRedirecionar) {
        // ==================================================
        // Se o backend nao enviar redirecionar_para no GET,
        // ainda assim saimos do onboarding com fallback seguro
        // baseado no perfil atual.
        // ==================================================
        const destinoConcluido =
          onboardingNormalizado.redirecionarPara ||
          obterDestinoDashboardPorPerfil(onboardingNormalizado.perfil);

        router.replace(destinoConcluido);
        return;
      }

      // ==================================================
      // SÃ³ continua automaticamente se houver progresso
      // real salvo no onboarding
      // ==================================================
      const temRespostasSalvas =
        onboardingNormalizado.respostasSalvas &&
        Object.keys(onboardingNormalizado.respostasSalvas).length > 0;

      const temEtapaSalva =
        typeof onboardingNormalizado.etapaAtual === "number" &&
        onboardingNormalizado.etapaAtual > 0;

      const deveContinuarOnboarding =
        onboardingNormalizado.perfil &&
        (temRespostasSalvas || temEtapaSalva);

      if (deveContinuarOnboarding) {
        // ==================================================
        // Mesmo que o backend legado retorne perfil antigo,
        // o frontend opera somente com "usuario".
        // ==================================================
        setPerfilSelecionado("usuario");
        setCurrentStepIndex(onboardingNormalizado.etapaAtual);
      } else {
        // ==================================================
        // Fluxo unico:
        // sem progresso previo, iniciamos automaticamente
        // onboarding no perfil "usuario".
        // ==================================================
        await handleSelecionarPerfil("usuario");
      }
    } catch (error) {
      console.error("Erro ao carregar onboarding:", error);

      if (error?.status === 401 || error?.status === 403) {
        setAuthMessage(
          "Sua sessão expirou ou não é válida no momento. Faça login novamente para continuar."
        );
      } else {
        setErrorMessage(error?.message || "Erro ao carregar o onboarding.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ====================================================
  // Inicia onboarding no fluxo unico de perfil "usuario"
  // Mantemos assinatura com parametro por compatibilidade
  // de chamadas antigas, mas ignoramos o valor recebido.
  // ====================================================
  async function handleSelecionarPerfil() {
    try {
      setSubmitting(true);
      setErrorMessage("");
      setAuthMessage("");

      // ==================================================
      // O produto agora opera com perfil unico "usuario".
      // Forcamos esse valor para evitar dependencia de
      // perfis legados no novo fluxo.
      // ==================================================
      const perfilUnico = "usuario";
      await iniciarOnboardingService(perfilUnico);

      setPerfilSelecionado(perfilUnico);
      setCurrentStepIndex(0);
      setRespostas({});
    } catch (error) {
      console.error("Erro ao iniciar onboarding:", error);

      if (error?.status === 401 || error?.status === 403) {
        setAuthMessage(
          "Sua sessão expirou ou não é válida no momento. Faça login novamente para continuar."
        );
      } else {
        setErrorMessage(
          error?.message || "Não foi possível iniciar o onboarding."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ====================================================
  // Atualiza o valor de um campo da seÃ§Ã£o atual
  // ====================================================
  function handleChangeCampo(nomeCampo, valor) {
    setRespostas((estadoAnterior) => ({
      ...estadoAnterior,
      [chaveSecaoAtual]: {
        ...(estadoAnterior?.[chaveSecaoAtual] || {}),
        [nomeCampo]: valor,
      },
    }));
  }

  // ====================================================
  // ValidaÃ§Ã£o simples dos campos obrigatÃ³rios
  // ====================================================
  function validarSecaoAtual() {
    for (const campo of camposDaSecaoAtual) {
      if (!campo.required) {
        continue;
      }

      const valor = dadosDaSecaoAtual?.[campo.name];

      if (valor === undefined || valor === null || valor === "") {
        return `Preencha o campo obrigatório: ${campo.label}`;
      }
    }

    return "";
  }

  // ====================================================
  // Salva a etapa atual e avanÃ§a
  // ====================================================
  async function handleSalvarEContinuar() {
    try {
      setSubmitting(true);
      setErrorMessage("");

      const erroValidacao = validarSecaoAtual();

      if (erroValidacao) {
        setErrorMessage(erroValidacao);
        return;
      }

      await salvarEtapaOnboardingService({
        perfil: perfilSelecionado,
        secao: chaveSecaoAtual,
        etapaAtual: currentStepIndex + 1,
        respostas: dadosDaSecaoAtual,
      });

      const ultimoPasso = currentStepIndex >= secoesDoPerfil.length - 1;

      if (!ultimoPasso) {
        setCurrentStepIndex((valorAtual) => valorAtual + 1);
        return;
      }

      // ==================================================
      // Exibe uma tela curta de processamento premium
      // antes de concluir e redirecionar
      // ==================================================
      setProcessandoIA(true);

      await new Promise((resolve) => setTimeout(resolve, 1800));

      const respostaConclusao = await concluirOnboardingService(
        perfilSelecionado
      );

      // ==================================================
      // Apos concluir onboarding, atualiza o usuario no
      // AuthContext para refletir onboarding_status e
      // tipo_usuario ja materializados na tabela usuarios.
      // ==================================================
      const usuarioAtualizado = await refreshUser();

      // ==================================================
      // Redirecionamento robusto:
      // 1) rota vinda da API de conclusao
      // 2) rota calculada pelo usuario atualizado no contexto
      // 3) fallback pelo perfil selecionado no onboarding
      // ==================================================
      const destino =
        respostaConclusao?.redirecionar_para ||
        respostaConclusao?.onboarding?.redirecionar_para ||
        obterDestinoDashboardPorPerfil(usuarioAtualizado?.tipo_usuario) ||
        obterDestinoDashboardPorPerfil(perfilSelecionado);

      router.replace(destino);
    } catch (error) {
      console.error("Erro ao salvar etapa:", error);

      // ==================================================
      // Evita travamento na tela de "processando IA" quando
      // a conclusao falhar no backend ou no refreshUser.
      // ==================================================
      setProcessandoIA(false);

      if (error?.status === 401 || error?.status === 403) {
        setAuthMessage(
          "Sua sessão expirou ou não é válida no momento. Faça login novamente para continuar."
        );
      } else {
        setErrorMessage(error?.message || "Não foi possível salvar esta etapa.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ====================================================
  // Volta uma etapa
  // ====================================================
  function handleVoltar() {
    if (currentStepIndex === 0 || submitting) {
      return;
    }

    setErrorMessage("");
    setCurrentStepIndex((valorAtual) => valorAtual - 1);
  }

  // ====================================================
  // Tela de processamento com IA
  // Mantida simples, elegante e confortÃ¡vel para mobile
  // ====================================================
  if (processandoIA) {
    return (
      <OnboardingShell>
        <div className="flex flex-col items-center justify-center space-y-6 py-10 text-center sm:space-y-8 sm:py-16">
          <div className="inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-violet-200 sm:text-xs">
            Inteligência Fitelligence
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Montando sua estratégia personalizada
            </h1>

            <p className="mx-auto max-w-md text-sm leading-7 text-slate-300 sm:text-base">
              Estamos analisando seu perfil, hábitos e objetivos para preparar
              uma experiência alinhada à sua jornada.
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-violet-400" />
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-400">
            <p>✔️ Analisando seu contexto atual</p>
            <p>✔️ Organizando prioridades iniciais</p>
            <p>✔️ Preparando seu dashboard inteligente</p>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ====================================================
  // Loading inicial
  // ====================================================
  if (loading) {
    return (
      <OnboardingShell>
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-violet-200 sm:text-xs">
            Fitelligence Onboarding
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Preparando sua experiência premium
            </h1>

            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              Estamos carregando o seu fluxo inicial com base no seu perfil.
            </p>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-violet-400" />
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ====================================================
  // SessÃ£o ausente ou invÃ¡lida
  // ====================================================
  if (authMessage) {
    return (
      <OnboardingShell>
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-200 sm:text-xs">
            Sessão necessária
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Entre na sua conta para continuar
            </h1>

            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              {authMessage}
            </p>
          </div>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="h-12 rounded-2xl bg-white px-4 text-sm font-semibold text-slate-950 transition active:scale-[0.99]"
            >
              Ir para login
            </button>

            <button
              type="button"
              onClick={carregarOnboarding}
              className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.99]"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ====================================================
  // Erro inicial de carregamento
  // ====================================================
  if (errorMessage && !perfilSelecionado && !secaoAtual) {
    return (
      <OnboardingShell>
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-rose-200 sm:text-xs">
            Erro de integração
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Não conseguimos carregar seu onboarding
            </h1>

            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              {errorMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={carregarOnboarding}
            className="h-12 w-full rounded-2xl bg-white px-4 text-sm font-semibold text-slate-950 transition active:scale-[0.99]"
          >
            Tentar novamente
          </button>
        </div>
      </OnboardingShell>
    );
  }

  // ====================================================
  // Tela de inicializacao do fluxo unico
  // ====================================================
  if (!perfilSelecionado) {
    return (
      <OnboardingShell>
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-200 sm:text-xs">
            Jornada inicial
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Vamos montar sua experiência Fitelligence
            </h1>

            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              Vamos preparar sua jornada inicial em fluxo unico para deixar o
              app mais util e inteligente desde o primeiro acesso.
            </p>
          </div>

          {/* ===============================================
              Acao unica para iniciar/reiniciar o onboarding
              no perfil padrao do produto.
             =============================================== */}
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSelecionarPerfil("usuario")}
            className="h-12 w-full rounded-2xl bg-white px-4 text-sm font-semibold text-slate-950 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Preparando..." : "Iniciar onboarding"}
          </button>

          {errorMessage ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100">
              {errorMessage}
            </div>
          ) : null}

          <WellnessDisclaimer light />
        </div>
      </OnboardingShell>
    );
  }

  // ====================================================
  // Caso o perfil nÃ£o tenha seÃ§Ãµes configuradas
  // ====================================================
  if (!secaoAtual) {
    return (
      <OnboardingShell>
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-200 sm:text-xs">
            Configuração ausente
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              O fluxo deste perfil ainda não está configurado
            </h1>

            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              Verifique o arquivo <code>src/data/onboardingConfig.js</code>.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPerfilSelecionado("")}
            className="h-12 w-full rounded-2xl bg-white px-4 text-sm font-semibold text-slate-950 transition active:scale-[0.99]"
          >
            Escolher outro perfil
          </button>
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell>
      <div className="space-y-6">
        {/* ===============================================
            CabeÃ§alho da etapa
           =============================================== */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-fit rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-violet-200 sm:text-xs">
              Perfil: {perfilSelecionado}
            </div>

            <span className="text-xs font-medium text-slate-300">
              Etapa {currentStepIndex + 1} de {secoesDoPerfil.length}
            </span>
          </div>

          <OnboardingProgress
            currentStep={currentStepIndex + 1}
            totalSteps={secoesDoPerfil.length}
          />

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {secaoAtual?.titulo ||
                secaoAtual?.title ||
                secaoAtual?.nome ||
                "Nova etapa"}
            </h1>

            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              {secaoAtual?.descricao ||
                secaoAtual?.description ||
                "Preencha os dados abaixo para personalizar sua experiência."}
            </p>
          </div>
        </div>

        {/* ===============================================
            Campos da etapa
           =============================================== */}
        <div className="grid gap-4">
          {camposDaSecaoAtual.map((campo) => (
            <div key={campo.id || campo.name} className="space-y-2">
              <label className="text-sm font-medium text-slate-100">
                {campo.label}
                {campo.required ? (
                  <span className="ml-1 text-violet-300">*</span>
                ) : null}
              </label>

              <OnboardingFieldRenderer
                campo={campo}
                valor={dadosDaSecaoAtual?.[campo.name] ?? ""}
                onChange={(novoValor) =>
                  handleChangeCampo(campo.name, novoValor)
                }
              />
            </div>
          ))}
        </div>

        {/* ===============================================
            Mensagem de erro
           =============================================== */}
        {errorMessage ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100">
            {errorMessage}
          </div>
        ) : null}

        {/* ===============================================
            AÃ§Ãµes principais
            Mobile-first:
            - no celular ficam empilhadas
            - em telas maiores ficam lado a lado
           =============================================== */}
        <div className="grid gap-3 sm:grid-cols-[1fr_1.25fr]">
          <button
            type="button"
            onClick={handleVoltar}
            disabled={currentStepIndex === 0 || submitting}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={handleSalvarEContinuar}
            disabled={submitting}
            className="h-12 rounded-2xl bg-white px-4 text-sm font-semibold text-slate-950 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting
              ? "Salvando..."
              : currentStepIndex >= secoesDoPerfil.length - 1
              ? "Finalizar onboarding"
              : "Salvar e continuar"}
          </button>
        </div>

        <WellnessDisclaimer light />
      </div>
    </OnboardingShell>
  );
}

// ======================================================
// Resolve rota de dashboard por perfil de forma segura.
// Mantem fallback para "/dashboard" se perfil vier vazio.
// ======================================================
function obterDestinoDashboardPorPerfil() {
  // ====================================================
  // Fluxo simplificado:
  // todos os perfis (incluindo legados) convergem
  // para o dashboard unico de usuario.
  // ====================================================
  return "/dashboard";
}

