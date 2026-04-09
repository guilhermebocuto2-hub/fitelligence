"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, Send, MessageSquareText } from "lucide-react";
import PremiumCard from "../../../src/components/ui/PremiumCard";
import SectionHeader from "../../../src/components/ui/SectionHeader";
import EmptyState from "../../../src/components/ui/EmptyState";
import {
  createCheckinService,
  listCheckinsService,
} from "../../../src/services/checkinsService";

// ======================================================
// Opcoes de humor com foco em toque facil no mobile.
// ======================================================
const HUMOR_OPTIONS = [
  { id: "pessimo", label: "Péssimo", value: "muito_mal" },
  { id: "ruim", label: "Ruim", value: "mal" },
  { id: "ok", label: "Ok", value: "normal" },
  { id: "bem", label: "Bem", value: "bem" },
  { id: "excelente", label: "Excelente", value: "muito_bem" },
];

const SCALE_OPTIONS = [1, 2, 3, 4, 5];

function mapScaleToNivel(value) {
  if (value <= 2) return "baixa";
  if (value === 3) return "media";
  return "alta";
}

function formatarData(data) {
  if (!data) return "-";
  const dataObj = new Date(data);
  if (Number.isNaN(dataObj.getTime())) return "-";
  return dataObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ======================================================
// Feedback curto e amigavel apos envio.
// ======================================================
function gerarFeedbackFinal({ energia, fome, motivacao }) {
  if (energia <= 2 && fome >= 4) {
    return "Hoje sua energia ficou abaixo do ideal. Vale reforçar hidratação e organização das refeições.";
  }
  if (energia >= 4 && motivacao >= 4) {
    return "Boa consistência. Seu check-in mostra um dia equilibrado e com boa prontidão.";
  }
  if (motivacao <= 2) {
    return "Dia mais desafiador, mas você manteve o registro. Pequenos passos hoje já fazem diferença amanhã.";
  }
  return "Check-in concluído. Continue registrando diariamente para receber insights cada vez mais úteis.";
}

function BotaoOpcao({ ativo, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 rounded-2xl border px-3 text-sm font-semibold transition active:scale-[0.98] ${
        ativo
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function EscalaRapida({ value, onChange, startLabel, endLabel }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-2">
        {SCALE_OPTIONS.map((opcao) => (
          <button
            key={opcao}
            type="button"
            onClick={() => onChange(opcao)}
            className={`h-11 rounded-2xl border text-sm font-semibold transition active:scale-[0.98] ${
              value === opcao
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {opcao}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
    </div>
  );
}

export default function CheckinsPage() {
  const [checkins, setCheckins] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState("");

  // ====================================================
  // Estado do check-in interativo.
  // ====================================================
  const [humor, setHumor] = useState("");
  const [energia, setEnergia] = useState(3);
  const [fome, setFome] = useState(3);
  const [motivacao, setMotivacao] = useState(3);
  const [observacao, setObservacao] = useState("");

  async function carregarDados() {
    try {
      setErro("");
      const resposta = await listCheckinsService();
      setCheckins(Array.isArray(resposta?.checkins) ? resposta.checkins : []);
    } catch (error) {
      console.error("Erro ao carregar check-ins:", error);
      setErro("Não foi possível carregar os dados de check-in.");
    }
  }

  useEffect(() => {
    async function bootstrap() {
      try {
        setCarregando(true);
        await carregarDados();
      } finally {
        setCarregando(false);
      }
    }
    bootstrap();
  }, []);

  const historicoCheckins = useMemo(() => checkins.slice(0, 6), [checkins]);

  async function handleEnviarCheckin() {
    if (!humor) {
      setErro("Selecione seu humor para concluir o check-in.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");

      await createCheckinService({
        humor,
        energia: mapScaleToNivel(energia),
        fome: mapScaleToNivel(fome),
        motivacao: mapScaleToNivel(motivacao),
        observacao: observacao?.trim() || null,
        data_registro: new Date().toISOString().slice(0, 10),
      });

      setFeedback(gerarFeedbackFinal({ energia, fome, motivacao }));

      // ==================================================
      // Reset completo do formulario apos sucesso.
      // ==================================================
      setHumor("");
      setEnergia(3);
      setFome(3);
      setMotivacao(3);
      setObservacao("");

      await carregarDados();
    } catch (error) {
      console.error("Erro ao salvar check-in:", error);
      setErro(error?.message || "Não foi possível salvar o check-in.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="space-y-4">
        <PremiumCard>
          <div className="animate-pulse space-y-3">
            <div className="h-6 w-40 rounded bg-slate-200" />
            <div className="h-8 w-64 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
          </div>
        </PremiumCard>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 pb-24 sm:space-y-5">
      <PremiumCard className="rounded-[28px]">
        <SectionHeader
          eyebrow="Rotina diária guiada"
          title="Check-in do dia"
          description="Leva menos de 1 minuto. Quanto mais consistente, mais inteligente fica seu acompanhamento."
        />
      </PremiumCard>

      <PremiumCard className="rounded-[28px]">
        <SectionHeader
          eyebrow="Humor"
          title="Como você está hoje?"
          description="Escolha a opção que mais representa seu estado geral."
        />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {HUMOR_OPTIONS.map((item) => (
            <BotaoOpcao
              key={item.id}
              ativo={humor === item.value}
              label={item.label}
              onClick={() => setHumor(item.value)}
            />
          ))}
        </div>
      </PremiumCard>

      <PremiumCard className="rounded-[28px]">
        <SectionHeader
          eyebrow="Energia"
          title="Nível de energia"
          description="Escala rápida para registrar sua disposição do dia."
        />
        <div className="mt-4">
          <EscalaRapida
            value={energia}
            onChange={setEnergia}
            startLabel="Baixa"
            endLabel="Alta"
          />
        </div>
      </PremiumCard>

      <PremiumCard className="rounded-[28px]">
        <SectionHeader
          eyebrow="Fome"
          title="Como está sua fome?"
          description="Registro simples para ajudar a IA a identificar padrão alimentar."
        />
        <div className="mt-4">
          <EscalaRapida
            value={fome}
            onChange={setFome}
            startLabel="Baixa"
            endLabel="Alta"
          />
        </div>
      </PremiumCard>

      <PremiumCard className="rounded-[28px]">
        <SectionHeader
          eyebrow="Motivação"
          title="Como está sua motivação?"
          description="Um registro por dia já melhora muito a leitura do seu progresso."
        />
        <div className="mt-4">
          <EscalaRapida
            value={motivacao}
            onChange={setMotivacao}
            startLabel="Baixa"
            endLabel="Alta"
          />
        </div>
      </PremiumCard>

      <PremiumCard className="rounded-[28px]">
        <SectionHeader
          eyebrow="Observação opcional"
          title="Quer registrar algo breve?"
          description="Campo opcional para contexto rápido, sem deixar a experiência pesada."
        />
        <div className="mt-4">
          <textarea
            value={observacao}
            onChange={(event) => setObservacao(event.target.value)}
            placeholder="Ex.: Dia corrido, pouca água, treino leve..."
            rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        {erro ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {erro}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleEnviarCheckin}
          disabled={salvando}
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send className="h-4 w-4" />
          {salvando ? "Salvando..." : "Concluir check-in"}
        </button>
      </PremiumCard>

      {feedback ? (
        <PremiumCard className="rounded-[28px] border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Feedback inteligente
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{feedback}</p>
            </div>
          </div>
        </PremiumCard>
      ) : null}

      <PremiumCard className="rounded-[28px]">
        <SectionHeader
          eyebrow="Histórico recente"
          title="Seus últimos check-ins"
          description="Resumo curto dos registros recentes para acompanhar consistência."
        />
        <div className="mt-4">
          {historicoCheckins.length === 0 ? (
            <EmptyState
              title="Nenhum check-in registrado"
              description="Seu histórico aparecerá aqui após o primeiro envio."
              className="rounded-2xl"
            />
          ) : (
            <div className="space-y-3">
              {historicoCheckins.map((item, index) => (
                <div
                  key={item.id || index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatarData(item.data_registro || item.criado_em)}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                      <MessageSquareText className="h-3.5 w-3.5" />
                      Check-in
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">
                    Humor: {item.humor || "-"} • Energia: {item.energia || "-"} •
                    Fome: {item.fome || "-"} • Motivação: {item.motivacao || "-"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PremiumCard>
    </div>
  );
}

