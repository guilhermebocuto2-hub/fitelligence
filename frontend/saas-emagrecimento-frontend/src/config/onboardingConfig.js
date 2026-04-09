// ======================================================
// Configuração central do onboarding do Fitelligence
// Responsável por:
// - definir as etapas por perfil
// - padronizar perguntas e campos
// - permitir renderização dinâmica no frontend
// - manter estrutura escalável para novos perfis
// ======================================================

export const onboardingConfig = {
  // ====================================================
  // ETAPA INICIAL
  // Escolha do perfil principal do usuário
  // ====================================================
  perfilInicial: {
    id: "perfil_inicial",
    title: "Vamos personalizar sua experiência",
    subtitle:
      "Escolha o perfil que melhor representa como você vai usar o Fitelligence.",
    fields: [
      {
        name: "tipo_usuario",
        label: "Qual perfil melhor representa você?",
        type: "radio_card",
        required: true,
        options: [
          {
            value: "usuario",
            label: "Usuário final",
            description:
              "Quero emagrecer, melhorar meu corpo, alimentação e rotina com apoio da IA.",
          },
          {
            value: "personal",
            label: "Personal trainer",
            description:
              "Quero acompanhar alunos, melhorar retenção e profissionalizar minha operação.",
          },
          {
            value: "nutricionista",
            label: "Nutricionista",
            description:
              "Quero acompanhar pacientes, analisar padrões alimentares e ter uma visão mais estratégica.",
          },
        ],
      },
    ],
  },

  // ====================================================
  // ONBOARDING DO USUÁRIO FINAL
  // ====================================================
  usuario: [
    {
      id: "objetivo_principal",
      title: "Qual é o seu principal objetivo?",
      subtitle:
        "Isso nos ajuda a ajustar metas, comunicação e inteligência do dashboard.",
      fields: [
        {
          name: "objetivo_principal",
          label: "Seu objetivo principal",
          type: "radio_card",
          required: true,
          options: [
            { value: "emagrecer", label: "Emagrecer" },
            { value: "ganhar_massa", label: "Ganhar massa muscular" },
            { value: "recomposicao", label: "Recomposição corporal" },
            { value: "melhorar_saude", label: "Melhorar saúde e rotina" },
            { value: "manter", label: "Manter o peso e evoluir consistência" },
          ],
        },
      ],
    },
    {
      id: "dados_corporais",
      title: "Vamos entender sua base atual",
      subtitle:
        "Esses dados ajudam a gerar comparações, metas e leitura de progresso mais precisa.",
      fields: [
        {
          name: "idade",
          label: "Idade",
          type: "number",
          required: true,
          placeholder: "Ex.: 29",
        },
        {
          name: "altura",
          label: "Altura (cm)",
          type: "number",
          required: true,
          placeholder: "Ex.: 175",
        },
        {
          name: "peso_atual",
          label: "Peso atual (kg)",
          type: "number",
          required: true,
          placeholder: "Ex.: 82.5",
        },
        {
          name: "peso_meta",
          label: "Peso meta (kg)",
          type: "number",
          required: false,
          placeholder: "Ex.: 74",
        },
        {
          name: "genero",
          label: "Gênero",
          type: "select",
          required: false,
          options: [
            { value: "masculino", label: "Masculino" },
            { value: "feminino", label: "Feminino" },
            { value: "outro", label: "Outro" },
            { value: "prefiro_nao_dizer", label: "Prefiro não dizer" },
          ],
        },
      ],
    },
    {
      id: "rotina_atividade",
      title: "Como é sua rotina hoje?",
      subtitle:
        "Queremos entender seu contexto real para criar uma estratégia mais aderente.",
      fields: [
        {
          name: "nivel_atividade",
          label: "Seu nível de atividade atual",
          type: "radio_card",
          required: true,
          options: [
            { value: "sedentario", label: "Sedentário" },
            { value: "leve", label: "Levemente ativo" },
            { value: "moderado", label: "Moderadamente ativo" },
            { value: "alto", label: "Muito ativo" },
          ],
        },
        {
          name: "frequencia_treino",
          label: "Quantas vezes por semana você treina?",
          type: "select",
          required: true,
          options: [
            { value: "0", label: "Não treino atualmente" },
            { value: "1_2", label: "1 a 2 vezes" },
            { value: "3_4", label: "3 a 4 vezes" },
            { value: "5_6", label: "5 a 6 vezes" },
            { value: "7", label: "Todos os dias" },
          ],
        },
        {
          name: "tempo_disponivel",
          label: "Quanto tempo você consegue dedicar por dia?",
          type: "select",
          required: true,
          options: [
            { value: "15_30", label: "15 a 30 minutos" },
            { value: "30_45", label: "30 a 45 minutos" },
            { value: "45_60", label: "45 a 60 minutos" },
            { value: "60_plus", label: "Mais de 1 hora" },
          ],
        },
      ],
    },
    {
      id: "alimentacao_atual",
      title: "Como está sua alimentação hoje?",
      subtitle:
        "Isso ajuda a IA a entender seus padrões e sugerir prioridades de evolução.",
      fields: [
        {
          name: "percepcao_alimentacao",
          label: "Como você avalia sua alimentação hoje?",
          type: "radio_card",
          required: true,
          options: [
            { value: "muito_ruim", label: "Muito desorganizada" },
            { value: "ruim", label: "Abaixo do ideal" },
            { value: "media", label: "Razoável" },
            { value: "boa", label: "Boa" },
            { value: "muito_boa", label: "Muito boa" },
          ],
        },
        {
          name: "dificuldade_alimentar",
          label: "Sua principal dificuldade com alimentação",
          type: "radio_card",
          required: true,
          options: [
            { value: "beliscos", label: "Beliscar fora de hora" },
            { value: "compulsao", label: "Compulsão / exageros" },
            { value: "falta_rotina", label: "Falta de rotina" },
            { value: "doces", label: "Excesso de doces" },
            { value: "fast_food", label: "Excesso de fast food" },
            { value: "sem_dificuldade", label: "Não tenho grande dificuldade" },
          ],
        },
        {
          name: "quantidade_refeicoes",
          label: "Quantas refeições você costuma fazer por dia?",
          type: "select",
          required: true,
          options: [
            { value: "1_2", label: "1 a 2 refeições" },
            { value: "3", label: "3 refeições" },
            { value: "4_5", label: "4 a 5 refeições" },
            { value: "6_plus", label: "6 ou mais" },
          ],
        },
      ],
    },
    {
      id: "sono_estresse",
      title: "Sono e estresse fazem parte da sua equação",
      subtitle:
        "Esses fatores impactam diretamente constância, fome, energia e evolução corporal.",
      fields: [
        {
          name: "qualidade_sono",
          label: "Como está seu sono atualmente?",
          type: "radio_card",
          required: true,
          options: [
            { value: "muito_ruim", label: "Muito ruim" },
            { value: "ruim", label: "Ruim" },
            { value: "media", label: "Médio" },
            { value: "boa", label: "Bom" },
            { value: "muito_boa", label: "Muito bom" },
          ],
        },
        {
          name: "nivel_estresse",
          label: "Como você percebe seu nível de estresse?",
          type: "radio_card",
          required: true,
          options: [
            { value: "baixo", label: "Baixo" },
            { value: "moderado", label: "Moderado" },
            { value: "alto", label: "Alto" },
            { value: "muito_alto", label: "Muito alto" },
          ],
        },
      ],
    },
    {
      id: "motivacao_compromisso",
      title: "Agora queremos entender sua disposição para a jornada",
      subtitle:
        "Isso ajuda o Fitelligence a modular linguagem, alertas e motivação.",
      fields: [
        {
          name: "motivacao_principal",
          label: "O que mais te motiva a mudar agora?",
          type: "textarea",
          required: true,
          placeholder:
            "Ex.: quero recuperar autoestima, melhorar saúde, me sentir melhor com meu corpo...",
        },
        {
          name: "nivel_compromisso",
          label: "Qual seu nível de compromisso com essa mudança?",
          type: "radio_card",
          required: true,
          options: [
            { value: "baixo", label: "Quero começar aos poucos" },
            { value: "medio", label: "Estou comprometido, mas preciso de ajuda" },
            { value: "alto", label: "Estou realmente decidido" },
          ],
        },
      ],
    },
  ],

  // ====================================================
  // ONBOARDING DO PERSONAL TRAINER
  // ====================================================
  personal: [
    {
      id: "perfil_profissional",
      title: "Vamos entender sua atuação como personal",
      subtitle:
        "Queremos moldar o painel conforme sua rotina profissional e seu modelo de acompanhamento.",
      fields: [
        {
          name: "tempo_atuacao",
          label: "Há quanto tempo você atua como personal?",
          type: "select",
          required: true,
          options: [
            { value: "iniciante", label: "Estou começando" },
            { value: "1_2_anos", label: "1 a 2 anos" },
            { value: "3_5_anos", label: "3 a 5 anos" },
            { value: "5_plus", label: "Mais de 5 anos" },
          ],
        },
        {
          name: "modelo_atendimento",
          label: "Qual o seu modelo principal de atendimento?",
          type: "radio_card",
          required: true,
          options: [
            { value: "presencial", label: "Presencial" },
            { value: "online", label: "Online" },
            { value: "hibrido", label: "Híbrido" },
          ],
        },
      ],
    },
    {
      id: "operacao_alunos",
      title: "Como está sua operação hoje?",
      subtitle:
        "Essas respostas ajudam a estruturar o dashboard do personal com mais valor prático.",
      fields: [
        {
          name: "quantidade_alunos",
          label: "Quantos alunos você acompanha hoje?",
          type: "select",
          required: true,
          options: [
            { value: "1_10", label: "1 a 10" },
            { value: "11_25", label: "11 a 25" },
            { value: "26_50", label: "26 a 50" },
            { value: "50_plus", label: "Mais de 50" },
          ],
        },
        {
          name: "principal_desafio_operacional",
          label: "Qual seu maior desafio hoje?",
          type: "radio_card",
          required: true,
          options: [
            { value: "retencao", label: "Reter alunos" },
            { value: "engajamento", label: "Manter engajamento" },
            { value: "acompanhamento", label: "Acompanhar evolução" },
            { value: "organizacao", label: "Organizar a operação" },
            { value: "percepcao_valor", label: "Aumentar valor percebido" },
          ],
        },
      ],
    },
    {
      id: "foco_profissional",
      title: "Qual é o foco do seu trabalho?",
      subtitle:
        "Isso ajuda o Fitelligence a priorizar métricas e módulos mais coerentes.",
      fields: [
        {
          name: "especialidade_principal",
          label: "Sua especialidade principal",
          type: "radio_card",
          required: true,
          options: [
            { value: "emagrecimento", label: "Emagrecimento" },
            { value: "hipertrofia", label: "Hipertrofia" },
            { value: "performance", label: "Performance" },
            { value: "qualidade_vida", label: "Qualidade de vida" },
            { value: "condicionamento", label: "Condicionamento físico" },
          ],
        },
        {
          name: "tipo_aluno_predominante",
          label: "Qual perfil de aluno predomina na sua carteira?",
          type: "textarea",
          required: false,
          placeholder:
            "Ex.: mulheres que querem emagrecer, homens focados em hipertrofia, iniciantes sedentários...",
        },
      ],
    },
    {
      id: "acompanhamento_e_valor",
      title: "Como você acompanha seus alunos hoje?",
      subtitle:
        "Queremos entender como o produto pode aumentar eficiência e percepção de valor.",
      fields: [
        {
          name: "frequencia_acompanhamento",
          label: "Com que frequência você revisa seus alunos?",
          type: "select",
          required: true,
          options: [
            { value: "diaria", label: "Diariamente" },
            { value: "semanal", label: "Semanalmente" },
            { value: "quinzenal", label: "Quinzenalmente" },
            { value: "mensal", label: "Mensalmente" },
          ],
        },
        {
          name: "objetivo_com_plataforma",
          label: "O que você mais quer conquistar com a plataforma?",
          type: "radio_card",
          required: true,
          options: [
            { value: "mais_organizacao", label: "Mais organização" },
            { value: "mais_resultado_alunos", label: "Mais resultado para alunos" },
            { value: "mais_retentao", label: "Mais retenção" },
            { value: "mais_valor_percebido", label: "Mais valor percebido" },
            { value: "escala_operacao", label: "Escalar operação" },
          ],
        },
      ],
    },
  ],

  // ====================================================
  // ONBOARDING DO NUTRICIONISTA
  // ====================================================
  nutricionista: [
    {
      id: "perfil_clinico",
      title: "Vamos entender sua atuação como nutricionista",
      subtitle:
        "Queremos adaptar o Fitelligence à sua realidade clínica e ao seu modelo de acompanhamento.",
      fields: [
        {
          name: "tempo_atuacao",
          label: "Há quanto tempo você atua na nutrição?",
          type: "select",
          required: true,
          options: [
            { value: "iniciante", label: "Estou começando" },
            { value: "1_2_anos", label: "1 a 2 anos" },
            { value: "3_5_anos", label: "3 a 5 anos" },
            { value: "5_plus", label: "Mais de 5 anos" },
          ],
        },
        {
          name: "modelo_atendimento",
          label: "Seu modelo principal de atendimento",
          type: "radio_card",
          required: true,
          options: [
            { value: "presencial", label: "Presencial" },
            { value: "online", label: "Online" },
            { value: "hibrido", label: "Híbrido" },
          ],
        },
      ],
    },
    {
      id: "operacao_pacientes",
      title: "Como está sua carteira de pacientes?",
      subtitle:
        "Essas respostas ajudam o sistema a estruturar melhor indicadores clínicos e estratégicos.",
      fields: [
        {
          name: "quantidade_pacientes",
          label: "Quantos pacientes você acompanha hoje?",
          type: "select",
          required: true,
          options: [
            { value: "1_20", label: "1 a 20" },
            { value: "21_50", label: "21 a 50" },
            { value: "51_100", label: "51 a 100" },
            { value: "100_plus", label: "Mais de 100" },
          ],
        },
        {
          name: "principal_desafio_clinico",
          label: "Seu maior desafio hoje no acompanhamento",
          type: "radio_card",
          required: true,
          options: [
            { value: "aderencia", label: "Baixa aderência" },
            { value: "monitoramento", label: "Monitorar comportamento alimentar" },
            { value: "engajamento", label: "Manter engajamento do paciente" },
            { value: "organizacao", label: "Organizar acompanhamento" },
            { value: "resultado", label: "Aumentar previsibilidade de resultado" },
          ],
        },
      ],
    },
    {
      id: "especialidade_e_pacientes",
      title: "Qual é o foco do seu trabalho?",
      subtitle:
        "Isso ajuda o dashboard a dar mais peso aos indicadores certos.",
      fields: [
        {
          name: "especialidade_principal",
          label: "Sua principal área de atuação",
          type: "radio_card",
          required: true,
          options: [
            { value: "emagrecimento", label: "Emagrecimento" },
            { value: "clinica", label: "Nutrição clínica" },
            { value: "esportiva", label: "Nutrição esportiva" },
            { value: "comportamental", label: "Nutrição comportamental" },
            { value: "saude_mulher", label: "Saúde da mulher" },
          ],
        },
        {
          name: "perfil_paciente_predominante",
          label: "Qual perfil de paciente predomina no seu atendimento?",
          type: "textarea",
          required: false,
          placeholder:
            "Ex.: mulheres com foco em emagrecimento, pacientes com baixa aderência, atletas amadores...",
        },
      ],
    },
    {
      id: "acompanhamento_e_valor",
      title: "Como você acompanha hoje a jornada nutricional?",
      subtitle:
        "Queremos entender como a plataforma pode aumentar profundidade clínica e valor percebido.",
      fields: [
        {
          name: "frequencia_revisao",
          label: "Com que frequência você revisa seus pacientes?",
          type: "select",
          required: true,
          options: [
            { value: "diaria", label: "Diariamente" },
            { value: "semanal", label: "Semanalmente" },
            { value: "quinzenal", label: "Quinzenalmente" },
            { value: "mensal", label: "Mensalmente" },
          ],
        },
        {
          name: "objetivo_com_plataforma",
          label: "O que você mais quer conquistar com a plataforma?",
          type: "radio_card",
          required: true,
          options: [
            { value: "mais_aderencia", label: "Melhorar aderência" },
            { value: "mais_monitoramento", label: "Monitorar melhor comportamento alimentar" },
            { value: "mais_resultado", label: "Melhorar resultados clínicos" },
            { value: "mais_valor_percebido", label: "Aumentar valor percebido" },
            { value: "mais_organizacao", label: "Mais organização e escala" },
          ],
        },
      ],
    },
  ],
};