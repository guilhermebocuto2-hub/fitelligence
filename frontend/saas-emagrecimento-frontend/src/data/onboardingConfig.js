// ======================================================
// CONFIGURAÇÃO CENTRAL DO ONBOARDING - FITELLIGENCE
// Responsável por:
// - definir perfis disponíveis
// - definir a ordem das etapas por perfil
// - definir o conteúdo completo de cada etapa
// ======================================================

// ======================================================
// PERFIS DISPONÍVEIS
// Esses cards aparecem na tela inicial de escolha de perfil
// ======================================================
export const roles = [
  {
    id: "usuario",
    title: "Usuário",
    subtitle:
      "Evolução física, metas, alimentação e acompanhamento com IA.",
  },
  {
    id: "personal",
    title: "Personal Trainer",
    subtitle:
      "Gerencie alunos, evolução corporal e performance com inteligência aplicada.",
  },
  {
    id: "nutricionista",
    title: "Nutricionista",
    subtitle:
      "Acompanhe pacientes, alimentação e aderência com apoio de IA.",
  },
];

// ======================================================
// ORDEM DAS ETAPAS POR PERFIL
// O page.jsx usa isso para montar a sequência do fluxo
// ======================================================
export const onboardingStepsByRole = {
  usuario: [
    "boas-vindas",
    "perfil",
    "objetivo",
    "dados-fisicos",
    "rotina",
    "alimentacao",
    "motivacao",
    "resumo",
  ],
  personal: [
    "boas-vindas",
    "perfil",
    "atuacao-profissional",
    "modelo-acompanhamento-personal",
    "ia-corporal",
    "meta-profissional-personal",
    "resumo",
  ],
  nutricionista: [
    "boas-vindas",
    "perfil",
    "atuacao-clinica",
    "modelo-acompanhamento-nutri",
    "ia-alimentar",
    "meta-profissional-nutri",
    "resumo",
  ],
};

// ======================================================
// DEFINIÇÕES COMPLETAS DAS ETAPAS
// ======================================================
export const stepDefinitions = {
  // ====================================================
  // ETAPAS UNIVERSAIS
  // ====================================================

  "boas-vindas": {
    id: "boas-vindas",
    titulo: "Bem-vindo ao Fitelligence",
    descricao:
      "Vamos configurar sua experiência de forma inteligente e personalizada desde o primeiro acesso.",
    campos: [
      {
        id: "aceita_personalizacao",
        name: "aceita_personalizacao",
        label: "Deseja uma experiência personalizada com base nas suas respostas?",
        type: "radio",
        required: true,
        options: [
          { label: "Sim, quero personalização total", value: "sim" },
          { label: "Prefiro configurar aos poucos", value: "parcial" },
        ],
      },
    ],
  },

  perfil: {
    id: "perfil",
    titulo: "Seu perfil",
    descricao:
      "Essas informações ajudam a construir uma experiência mais precisa, elegante e útil.",
    campos: [
      {
        id: "nome_completo",
        name: "nome_completo",
        label: "Nome completo",
        type: "text",
        placeholder: "Digite seu nome",
        required: true,
      },
      {
        id: "idade",
        name: "idade",
        label: "Idade",
        type: "number",
        placeholder: "Ex: 28",
        required: true,
      },
      {
        id: "genero",
        name: "genero",
        label: "Gênero",
        type: "select",
        required: false,
        options: [
          { label: "Masculino", value: "masculino" },
          { label: "Feminino", value: "feminino" },
          { label: "Outro", value: "outro" },
          { label: "Prefiro não informar", value: "nao_informar" },
        ],
      },
      {
        id: "altura",
        name: "altura",
        label: "Altura (cm)",
        type: "number",
        placeholder: "Ex: 175",
        required: false,
      },
      {
        id: "cidade_estado",
        name: "cidade_estado",
        label: "Cidade / Estado",
        type: "text",
        placeholder: "Ex: São Paulo / SP",
        required: false,
      },
    ],
  },

  objetivo: {
    id: "objetivo",
    titulo: "Seu objetivo",
    descricao:
      "Qual é o seu principal objetivo neste momento?",
    campos: [
      {
        id: "objetivo_principal",
        name: "objetivo_principal",
        label: "Objetivo principal",
        type: "radio",
        required: true,
        options: [
          { label: "Emagrecimento", value: "emagrecimento" },
          { label: "Hipertrofia", value: "hipertrofia" },
          { label: "Condicionamento", value: "condicionamento" },
          { label: "Saúde e bem-estar", value: "saude_bem_estar" },
        ],
      },
      {
        id: "prazo_meta",
        name: "prazo_meta",
        label: "Em quanto tempo gostaria de ver resultados claros?",
        type: "select",
        required: false,
        options: [
          { label: "30 dias", value: "30_dias" },
          { label: "60 dias", value: "60_dias" },
          { label: "90 dias", value: "90_dias" },
          { label: "Sem prazo rígido", value: "sem_prazo" },
        ],
      },
    ],
  },

  "dados-fisicos": {
    id: "dados-fisicos",
    titulo: "Seus dados físicos",
    descricao:
      "Informações importantes para personalização e evolução.",
    campos: [
      {
        id: "peso",
        name: "peso",
        label: "Peso atual (kg)",
        type: "number",
        placeholder: "Ex: 82",
        required: false,
      },
      {
        id: "peso_meta",
        name: "peso_meta",
        label: "Peso meta (kg)",
        type: "number",
        placeholder: "Ex: 75",
        required: false,
      },
      {
        id: "cintura",
        name: "cintura",
        label: "Cintura (cm)",
        type: "number",
        placeholder: "Ex: 92",
        required: false,
      },
    ],
  },

  rotina: {
    id: "rotina",
    titulo: "Sua rotina",
    descricao:
      "Como é seu dia a dia atualmente?",
    campos: [
      {
        id: "nivel_atividade",
        name: "nivel_atividade",
        label: "Nível de atividade",
        type: "select",
        required: true,
        options: [
          { label: "Baixo", value: "baixo" },
          { label: "Moderado", value: "moderado" },
          { label: "Alto", value: "alto" },
        ],
      },
      {
        id: "frequencia_treino",
        name: "frequencia_treino",
        label: "Frequência de treino",
        type: "select",
        required: false,
        options: [
          { label: "Não treino atualmente", value: "0" },
          { label: "1 a 2 vezes/semana", value: "1_2" },
          { label: "3 a 4 vezes/semana", value: "3_4" },
          { label: "5 ou mais vezes/semana", value: "5_mais" },
        ],
      },
    ],
  },

  alimentacao: {
    id: "alimentacao",
    titulo: "Alimentação",
    descricao:
      "Conte um pouco sobre seus hábitos alimentares.",
    campos: [
      {
        id: "tipo_dieta",
        name: "tipo_dieta",
        label: "Tipo de alimentação",
        type: "select",
        required: false,
        options: [
          { label: "Livre", value: "livre" },
          { label: "Low carb", value: "low_carb" },
          { label: "Vegetariana", value: "vegetariana" },
          { label: "Outro", value: "outro" },
        ],
      },
      {
        id: "dificuldade_alimentar",
        name: "dificuldade_alimentar",
        label: "Maior dificuldade com alimentação",
        type: "textarea",
        placeholder:
          "Ex: ansiedade, exagero à noite, doces, falta de rotina...",
        required: false,
      },
    ],
  },

  motivacao: {
    id: "motivacao",
    titulo: "Motivação",
    descricao:
      "Queremos entender o que te move.",
    campos: [
      {
        id: "motivacao_texto",
        name: "motivacao_texto",
        label: "O que mais te motiva hoje?",
        type: "textarea",
        placeholder:
          "Ex: autoestima, saúde, performance, energia, bem-estar...",
        required: false,
      },
      {
        id: "principal_barreira",
        name: "principal_barreira",
        label: "Principal barreira atual",
        type: "textarea",
        placeholder:
          "Ex: constância, tempo, ansiedade, falta de disciplina...",
        required: false,
      },
    ],
  },

  resumo: {
    id: "resumo",
    titulo: "Resumo",
    descricao:
      "Revise mentalmente suas escolhas antes de finalizar.",
    campos: [],
  },

  // ====================================================
  // PERSONAL - PREMIUM
  // ====================================================

  "atuacao-profissional": {
    id: "atuacao-profissional",
    titulo: "Sua atuação profissional",
    descricao:
      "Vamos entender como você trabalha hoje para configurar um ambiente mais estratégico, produtivo e inteligente.",
    campos: [
      {
        id: "tempo_profissao",
        name: "tempo_profissao",
        label: "Há quanto tempo atua como personal trainer?",
        type: "select",
        required: true,
        options: [
          { label: "Estou começando agora", value: "iniciante" },
          { label: "1 a 2 anos", value: "1_2_anos" },
          { label: "3 a 5 anos", value: "3_5_anos" },
          { label: "Mais de 5 anos", value: "5_mais" },
        ],
      },
      {
        id: "atendimento_formato",
        name: "atendimento_formato",
        label: "Formato principal de atendimento",
        type: "radio",
        required: true,
        options: [
          { label: "Presencial", value: "presencial" },
          { label: "Online", value: "online" },
          { label: "Híbrido", value: "hibrido" },
        ],
      },
      {
        id: "numero_alunos",
        name: "numero_alunos",
        label: "Quantos alunos acompanha atualmente?",
        type: "select",
        required: true,
        options: [
          { label: "Até 10 alunos", value: "ate_10" },
          { label: "11 a 30 alunos", value: "11_30" },
          { label: "31 a 60 alunos", value: "31_60" },
          { label: "Mais de 60 alunos", value: "60_mais" },
        ],
      },
      {
        id: "nicho_alunos",
        name: "nicho_alunos",
        label: "Qual o perfil predominante dos seus alunos?",
        type: "textarea",
        placeholder:
          "Ex: emagrecimento, hipertrofia, performance, qualidade de vida, terceira idade...",
        required: true,
      },
      {
        id: "tipo_servico",
        name: "tipo_servico",
        label: "Como você vende seu serviço hoje?",
        type: "radio",
        required: false,
        options: [
          { label: "Pacotes mensais", value: "pacotes_mensais" },
          { label: "Sessões avulsas", value: "avulsas" },
          { label: "Consultoria online", value: "consultoria_online" },
          { label: "Modelo misto", value: "modelo_misto" },
        ],
      },
    ],
  },

  "modelo-acompanhamento-personal": {
    id: "modelo-acompanhamento-personal",
    titulo: "Seu modelo de acompanhamento",
    descricao:
      "Agora vamos entender como você acompanha evolução, comunicação, rotina e consistência dos seus alunos.",
    campos: [
      {
        id: "acompanha_resultados",
        name: "acompanha_resultados",
        label: "Como acompanha resultados hoje?",
        type: "textarea",
        placeholder:
          "Ex: planilhas, fotos, WhatsApp, check-ins, avaliações, aplicativos...",
        required: true,
      },
      {
        id: "frequencia_revisao",
        name: "frequencia_revisao",
        label: "Com que frequência revisa o progresso dos alunos?",
        type: "select",
        required: true,
        options: [
          { label: "Semanalmente", value: "semanal" },
          { label: "Quinzenalmente", value: "quinzenal" },
          { label: "Mensalmente", value: "mensal" },
          { label: "Sem rotina definida", value: "sem_padrao" },
        ],
      },
      {
        id: "usa_checkins",
        name: "usa_checkins",
        label: "Você já trabalha com check-ins estruturados?",
        type: "radio",
        required: true,
        options: [
          { label: "Sim", value: "sim" },
          { label: "Não", value: "nao" },
        ],
      },
      {
        id: "canais_comunicacao",
        name: "canais_comunicacao",
        label: "Qual canal usa mais para se comunicar com os alunos?",
        type: "select",
        required: false,
        options: [
          { label: "WhatsApp", value: "whatsapp" },
          { label: "Instagram", value: "instagram" },
          { label: "E-mail", value: "email" },
          { label: "Plataformas / apps", value: "apps" },
          { label: "Mais de um canal", value: "multiplos" },
        ],
      },
      {
        id: "principal_dor_acompanhamento",
        name: "principal_dor_acompanhamento",
        label: "Qual sua maior dificuldade no acompanhamento hoje?",
        type: "textarea",
        placeholder:
          "Ex: falta de constância dos alunos, organização, retenção, escala, tempo...",
        required: true,
      },
    ],
  },

  "ia-corporal": {
    id: "ia-corporal",
    titulo: "IA aplicada à evolução corporal",
    descricao:
      "Vamos entender como a análise corporal inteligente pode fortalecer sua entrega e gerar percepção de valor.",
    campos: [
      {
        id: "interesse_ia_corporal",
        name: "interesse_ia_corporal",
        label: "Qual seu interesse em análise corporal com IA?",
        type: "radio",
        required: true,
        options: [
          { label: "Muito alto", value: "muito_alto" },
          { label: "Alto", value: "alto" },
          { label: "Médio", value: "medio" },
          { label: "Baixo", value: "baixo" },
        ],
      },
      {
        id: "usa_fotos_evolucao",
        name: "usa_fotos_evolucao",
        label: "Hoje você já usa fotos para acompanhar evolução?",
        type: "radio",
        required: true,
        options: [
          { label: "Sim", value: "sim" },
          { label: "Não", value: "nao" },
        ],
      },
      {
        id: "frequencia_analise_visual",
        name: "frequencia_analise_visual",
        label: "Com que frequência gostaria de gerar análise visual dos alunos?",
        type: "select",
        required: false,
        options: [
          { label: "Semanalmente", value: "semanal" },
          { label: "Quinzenalmente", value: "quinzenal" },
          { label: "Mensalmente", value: "mensal" },
          { label: "Somente em marcos importantes", value: "marcos" },
        ],
      },
      {
        id: "o_que_ia_deve_entregar",
        name: "o_que_ia_deve_entregar",
        label: "O que a IA mais deveria entregar para você?",
        type: "textarea",
        placeholder:
          "Ex: comparação visual, alertas de evolução, relatórios automáticos, leitura corporal...",
        required: true,
      },
    ],
  },

  "meta-profissional-personal": {
    id: "meta-profissional-personal",
    titulo: "Sua meta profissional",
    descricao:
      "O Fitelligence também deve ajudar você a crescer como negócio, e não apenas organizar a operação.",
    campos: [
      {
        id: "principal_meta_profissional",
        name: "principal_meta_profissional",
        label: "Qual sua principal meta profissional neste momento?",
        type: "radio",
        required: true,
        options: [
          { label: "Escalar número de alunos", value: "escalar_alunos" },
          { label: "Melhorar qualidade da entrega", value: "melhorar_entrega" },
          { label: "Aumentar retenção", value: "aumentar_retencao" },
          { label: "Profissionalizar a operação", value: "profissionalizar" },
        ],
      },
      {
        id: "maior_desafio_negocio_personal",
        name: "maior_desafio_negocio_personal",
        label: "Qual o maior desafio do seu negócio hoje?",
        type: "textarea",
        placeholder:
          "Ex: organização, escalar sem perder qualidade, engajamento, diferencial, marketing...",
        required: true,
      },
      {
        id: "como_fitelligence_ajudaria_personal",
        name: "como_fitelligence_ajudaria_personal",
        label: "Como o Fitelligence mais poderia ajudar você hoje?",
        type: "textarea",
        placeholder:
          "Ex: gestão, acompanhamento, IA, relatórios, retenção, diferencial de mercado...",
        required: true,
      },
    ],
  },

  // ====================================================
  // NUTRICIONISTA - PREMIUM
  // ====================================================

  "atuacao-clinica": {
    id: "atuacao-clinica",
    titulo: "Sua atuação clínica",
    descricao:
      "Vamos adaptar o Fitelligence ao seu momento profissional, ao perfil dos seus pacientes e ao seu formato de trabalho.",
    campos: [
      {
        id: "tempo_atuacao_nutri",
        name: "tempo_atuacao_nutri",
        label: "Há quanto tempo atua como nutricionista?",
        type: "select",
        required: true,
        options: [
          { label: "Estou começando agora", value: "iniciante" },
          { label: "1 a 2 anos", value: "1_2_anos" },
          { label: "3 a 5 anos", value: "3_5_anos" },
          { label: "Mais de 5 anos", value: "5_mais" },
        ],
      },
      {
        id: "formato_consulta",
        name: "formato_consulta",
        label: "Formato principal de consulta",
        type: "radio",
        required: true,
        options: [
          { label: "Presencial", value: "presencial" },
          { label: "Online", value: "online" },
          { label: "Híbrido", value: "hibrido" },
        ],
      },
      {
        id: "numero_pacientes",
        name: "numero_pacientes",
        label: "Quantos pacientes acompanha atualmente?",
        type: "select",
        required: true,
        options: [
          { label: "Até 20 pacientes", value: "ate_20" },
          { label: "21 a 50 pacientes", value: "21_50" },
          { label: "51 a 100 pacientes", value: "51_100" },
          { label: "Mais de 100 pacientes", value: "100_mais" },
        ],
      },
      {
        id: "perfil_pacientes",
        name: "perfil_pacientes",
        label: "Qual o perfil predominante dos seus pacientes?",
        type: "textarea",
        placeholder:
          "Ex: emagrecimento, estética, saúde metabólica, esportivo, comportamento alimentar...",
        required: true,
      },
      {
        id: "especialidade_nicho",
        name: "especialidade_nicho",
        label: "Você atua em algum nicho ou especialidade específica?",
        type: "textarea",
        placeholder:
          "Ex: emagrecimento, nutrição esportiva, clínica, fertilidade, saúde da mulher...",
        required: false,
      },
    ],
  },

  "modelo-acompanhamento-nutri": {
    id: "modelo-acompanhamento-nutri",
    titulo: "Seu modelo de acompanhamento",
    descricao:
      "Vamos entender como você acompanha adesão, retorno e evolução dos pacientes na prática.",
    campos: [
      {
        id: "acompanha_aderencia",
        name: "acompanha_aderencia",
        label: "Como acompanha aderência hoje?",
        type: "textarea",
        placeholder:
          "Ex: mensagens, check-ins, diário alimentar, planilhas, consultas de retorno...",
        required: true,
      },
      {
        id: "frequencia_retorno_paciente",
        name: "frequencia_retorno_paciente",
        label: "Com que frequência seus pacientes costumam retornar?",
        type: "select",
        required: true,
        options: [
          { label: "Semanalmente", value: "semanal" },
          { label: "Quinzenalmente", value: "quinzenal" },
          { label: "Mensalmente", value: "mensal" },
          { label: "Sem frequência definida", value: "sem_padrao" },
        ],
      },
      {
        id: "usa_feedback_continuo",
        name: "usa_feedback_continuo",
        label: "Você gostaria de um modelo de feedback contínuo entre consultas?",
        type: "radio",
        required: true,
        options: [
          { label: "Sim", value: "sim" },
          { label: "Talvez", value: "talvez" },
          { label: "Não", value: "nao" },
        ],
      },
      {
        id: "principal_dor_acompanhamento_nutri",
        name: "principal_dor_acompanhamento_nutri",
        label: "Qual sua principal dor no acompanhamento hoje?",
        type: "textarea",
        placeholder:
          "Ex: aderência baixa, pacientes somem, pouco controle entre consultas, falta de tempo...",
        required: true,
      },
    ],
  },

  "ia-alimentar": {
    id: "ia-alimentar",
    titulo: "IA aplicada à alimentação",
    descricao:
      "Essa etapa define como o Fitelligence pode ajudar você a acompanhar refeições, aderência e comportamento alimentar com mais inteligência.",
    campos: [
      {
        id: "interesse_ia_alimentar",
        name: "interesse_ia_alimentar",
        label: "Qual seu interesse em leitura alimentar com IA?",
        type: "radio",
        required: true,
        options: [
          { label: "Muito alto", value: "muito_alto" },
          { label: "Alto", value: "alto" },
          { label: "Médio", value: "medio" },
          { label: "Baixo", value: "baixo" },
        ],
      },
      {
        id: "analisa_refeicoes_foto",
        name: "analisa_refeicoes_foto",
        label: "Gostaria de analisar refeições por foto?",
        type: "radio",
        required: true,
        options: [
          { label: "Sim", value: "sim" },
          { label: "Não", value: "nao" },
        ],
      },
      {
        id: "objetivo_analise_refeicao",
        name: "objetivo_analise_refeicao",
        label: "Qual o principal objetivo da análise alimentar com IA?",
        type: "textarea",
        placeholder:
          "Ex: aumentar aderência, dar feedback mais rápido, organizar acompanhamento, gerar score alimentar...",
        required: true,
      },
      {
        id: "principal_uso_ia_alimentar",
        name: "principal_uso_ia_alimentar",
        label: "O que a IA alimentar mais deveria entregar para você?",
        type: "textarea",
        placeholder:
          "Ex: score alimentar, alertas, feedback, leitura do padrão alimentar, resumo do comportamento...",
        required: true,
      },
    ],
  },

  "meta-profissional-nutri": {
    id: "meta-profissional-nutri",
    titulo: "Sua meta profissional",
    descricao:
      "Além do acompanhamento clínico, queremos entender como o Fitelligence pode fortalecer sua operação como negócio.",
    campos: [
      {
        id: "principal_meta_profissional_nutri",
        name: "principal_meta_profissional_nutri",
        label: "Qual sua principal meta profissional agora?",
        type: "radio",
        required: true,
        options: [
          { label: "Crescer número de pacientes", value: "crescer_pacientes" },
          { label: "Melhorar retenção", value: "melhorar_retencao" },
          {
            label: "Profissionalizar acompanhamento",
            value: "profissionalizar",
          },
          { label: "Gerar mais valor percebido", value: "mais_valor" },
        ],
      },
      {
        id: "maior_desafio_negocio_nutri",
        name: "maior_desafio_negocio_nutri",
        label: "Qual o maior desafio do seu negócio hoje?",
        type: "textarea",
        placeholder:
          "Ex: escala, organização, retorno de pacientes, diferencial, engajamento...",
        required: true,
      },
      {
        id: "como_fitelligence_ajudaria_nutri",
        name: "como_fitelligence_ajudaria_nutri",
        label: "Como o Fitelligence mais poderia ajudar você hoje?",
        type: "textarea",
        placeholder:
          "Ex: aderência, IA alimentar, acompanhamento, relatórios, organização, diferencial clínico...",
        required: true,
      },
    ],
  },
};