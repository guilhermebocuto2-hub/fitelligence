"use client";

// ======================================================
// Renderer visual dos campos do onboarding
// Responsável por:
// - renderizar inputs dinâmicos com base no tipo do campo
// - manter compatibilidade com a config oficial do onboarding
// - preservar o visual premium da jornada inicial
// - centralizar a lógica visual dos campos em um único lugar
// ======================================================

export default function OnboardingFieldRenderer({
  campo,
  valor,
  onChange,
}) {
  // ====================================================
  // Segurança:
  // Se o campo vier vazio ou inválido, evita quebrar a tela
  // ====================================================
  if (!campo) {
    return null;
  }

  // ====================================================
  // Normalização defensiva:
  // Mantém compatibilidade com diferentes formatos de config
  // sem quebrar o fluxo atual
  // ====================================================
  const fieldType = campo.type || campo.tipo || "text";
  const placeholder = campo.placeholder || "";
  const options = campo.options || campo.opcoes || [];
  const disabled = campo.disabled || false;
  const inputMode = campo.inputMode || undefined;
  const min = campo.min ?? undefined;
  const max = campo.max ?? undefined;
  const step = campo.step ?? undefined;

  // ====================================================
  // Garante que o valor sempre seja controlado no React
  // evitando warnings de controlled/uncontrolled component
  // ====================================================
  const valorControlado = valor ?? "";

  // ====================================================
  // Normaliza estrutura das opções para select / radio
  // Isso ajuda caso alguma etapa use label/value,
  // titulo/valor ou até string simples
  // ====================================================
  function normalizarOpcao(opcao) {
    if (typeof opcao === "string") {
      return {
        value: opcao,
        label: opcao,
        description: "",
      };
    }

    return {
      value: opcao?.value ?? opcao?.valor ?? "",
      label: opcao?.label ?? opcao?.titulo ?? opcao?.nome ?? "",
      description:
        opcao?.description ?? opcao?.descricao ?? opcao?.subtitle ?? "",
    };
  }

  // ====================================================
  // Renderização do campo SELECT
  // ====================================================
  if (fieldType === "select") {
    return (
      <div className="relative">
        <select
          value={valorControlado}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="h-14 w-full rounded-3xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none backdrop-blur-xl transition focus:border-violet-400 focus:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="" className="text-slate-900">
            Selecione
          </option>

          {options.map((opcao, index) => {
            const opcaoNormalizada = normalizarOpcao(opcao);

            return (
              <option
                key={`${campo.name || campo.id || "select"}-${index}`}
                value={opcaoNormalizada.value}
                className="text-slate-900"
              >
                {opcaoNormalizada.label}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  // ====================================================
  // Renderização do campo RADIO
  // Compatível com:
  // - radio
  // - radio_card
  //
  // Mesmo quando o tipo for "radio", o visual continua
  // premium em cards, que é exatamente o que queremos.
  // ====================================================
  if (fieldType === "radio" || fieldType === "radio_card") {
    return (
      <div className="grid gap-3">
        {options.map((opcao, index) => {
          const opcaoNormalizada = normalizarOpcao(opcao);
          const ativo = valorControlado === opcaoNormalizada.value;

          return (
            <button
              key={`${campo.name || campo.id || "radio"}-${index}`}
              type="button"
              onClick={() => onChange(opcaoNormalizada.value)}
              disabled={disabled}
              className={`group rounded-3xl border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                ativo
                  ? "border-violet-400 bg-violet-500/20 shadow-[0_0_0_1px_rgba(167,139,250,0.25)]"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span
                    className={`block text-sm font-medium ${
                      ativo ? "text-white" : "text-slate-200"
                    }`}
                  >
                    {opcaoNormalizada.label}
                  </span>

                  {opcaoNormalizada.description ? (
                    <span className="block text-xs leading-5 text-slate-400">
                      {opcaoNormalizada.description}
                    </span>
                  ) : null}
                </div>

                <span
                  className={`mt-0.5 h-5 w-5 rounded-full border transition ${
                    ativo
                      ? "border-violet-300 bg-violet-400"
                      : "border-white/20 bg-transparent"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // ====================================================
  // Renderização do campo TEXTAREA
  // ====================================================
  if (fieldType === "textarea") {
    return (
      <textarea
        value={valorControlado}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={campo.rows || 5}
        disabled={disabled}
        className="w-full rounded-3xl border border-white/10 bg-white/10 px-4 py-4 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
      />
    );
  }

  // ====================================================
  // Renderização do campo NUMBER
  // Mantém compatibilidade com inputs numéricos do onboarding
  // ====================================================
  if (fieldType === "number") {
    return (
      <input
        type="number"
        value={valorControlado}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={inputMode || "decimal"}
        min={min}
        max={max}
        step={step}
        className="h-14 w-full rounded-3xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
      />
    );
  }

  // ====================================================
  // Renderização do campo EMAIL
  // Já deixamos pronto caso o onboarding cresça
  // ====================================================
  if (fieldType === "email") {
    return (
      <input
        type="email"
        value={valorControlado}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        inputMode="email"
        className="h-14 w-full rounded-3xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
      />
    );
  }

  // ====================================================
  // Renderização do campo padrão TEXTO
  // Fallback seguro para text e outros tipos simples
  // ====================================================
  return (
    <input
      type="text"
      value={valorControlado}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="h-14 w-full rounded-3xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}