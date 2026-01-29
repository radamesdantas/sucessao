import { Module, Challenge, Project, CCE_NAMES } from './types';

export const MODULES: Module[] = [
  {
    id: 1, name: 'Lideranca Situacional', description: 'Fundamentos de lideranca adaptativa e estilos de gestao',
    phase: 1, status: 'pending',
    weeks: [
      { week: 1, title: 'Conceito: Modelos de lideranca situacional', status: 'pending', notes: '' },
      { week: 2, title: 'Casos: Analise de cenarios reais', status: 'pending', notes: '' },
      { week: 3, title: 'Projeto: Diagnostico de equipe', status: 'pending', notes: '' },
      { week: 4, title: 'Feedback: Revisao e ajustes', status: 'pending', notes: '' },
    ],
  },
  {
    id: 2, name: 'Comunicacao Assertiva', description: 'Tecnicas de comunicacao eficaz para gestores',
    phase: 1, status: 'pending',
    weeks: [
      { week: 1, title: 'Conceito: Comunicacao nao-violenta', status: 'pending', notes: '' },
      { week: 2, title: 'Casos: Situacoes de conflito', status: 'pending', notes: '' },
      { week: 3, title: 'Projeto: Plano de comunicacao', status: 'pending', notes: '' },
      { week: 4, title: 'Feedback: Pratica e refinamento', status: 'pending', notes: '' },
    ],
  },
  {
    id: 3, name: 'Gestao de Pessoas', description: 'Desenvolvimento e retencao de talentos',
    phase: 1, status: 'pending',
    weeks: [
      { week: 1, title: 'Conceito: Ciclo de gestao de pessoas', status: 'pending', notes: '' },
      { week: 2, title: 'Casos: Desafios de RH', status: 'pending', notes: '' },
      { week: 3, title: 'Projeto: PDI da equipe', status: 'pending', notes: '' },
      { week: 4, title: 'Feedback: Avaliacao de resultados', status: 'pending', notes: '' },
    ],
  },
  {
    id: 4, name: 'Tomada de Decisao', description: 'Frameworks e modelos para decisoes estrategicas',
    phase: 2, status: 'pending',
    weeks: [
      { week: 1, title: 'Conceito: Modelos de decisao', status: 'pending', notes: '' },
      { week: 2, title: 'Casos: Decisoes sob pressao', status: 'pending', notes: '' },
      { week: 3, title: 'Projeto: Arvore de decisao', status: 'pending', notes: '' },
      { week: 4, title: 'Feedback: Analise de consequencias', status: 'pending', notes: '' },
    ],
  },
  {
    id: 5, name: 'Gestao Financeira', description: 'Orcamento, custos e indicadores financeiros',
    phase: 2, status: 'pending',
    weeks: [
      { week: 1, title: 'Conceito: DRE e fluxo de caixa', status: 'pending', notes: '' },
      { week: 2, title: 'Casos: Analise de viabilidade', status: 'pending', notes: '' },
      { week: 3, title: 'Projeto: Orcamento departamental', status: 'pending', notes: '' },
      { week: 4, title: 'Feedback: Revisao financeira', status: 'pending', notes: '' },
    ],
  },
  {
    id: 6, name: 'Gestao de Processos', description: 'Mapeamento e otimizacao de processos',
    phase: 2, status: 'pending',
    weeks: [
      { week: 1, title: 'Conceito: BPM e melhoria continua', status: 'pending', notes: '' },
      { week: 2, title: 'Casos: Gargalos operacionais', status: 'pending', notes: '' },
      { week: 3, title: 'Projeto: Redesenho de processo', status: 'pending', notes: '' },
      { week: 4, title: 'Feedback: Metricas de eficiencia', status: 'pending', notes: '' },
    ],
  },
  {
    id: 7, name: 'Negociacao e Influencia', description: 'Tecnicas avancadas de negociacao',
    phase: 3, status: 'pending',
    weeks: [
      { week: 1, title: 'Conceito: Principios de Harvard', status: 'pending', notes: '' },
      { week: 2, title: 'Casos: Negociacoes complexas', status: 'pending', notes: '' },
      { week: 3, title: 'Projeto: Simulacao de negociacao', status: 'pending', notes: '' },
      { week: 4, title: 'Feedback: Analise de resultados', status: 'pending', notes: '' },
    ],
  },
  {
    id: 8, name: 'Gestao de Mudancas', description: 'Liderar transformacoes organizacionais',
    phase: 3, status: 'pending',
    weeks: [
      { week: 1, title: 'Conceito: Modelos de mudanca (Kotter)', status: 'pending', notes: '' },
      { week: 2, title: 'Casos: Resistencia a mudanca', status: 'pending', notes: '' },
      { week: 3, title: 'Projeto: Plano de change management', status: 'pending', notes: '' },
      { week: 4, title: 'Feedback: Sustentacao da mudanca', status: 'pending', notes: '' },
    ],
  },
  {
    id: 9, name: 'Inovacao e Criatividade', description: 'Design thinking e cultura de inovacao',
    phase: 3, status: 'pending',
    weeks: [
      { week: 1, title: 'Conceito: Design thinking aplicado', status: 'pending', notes: '' },
      { week: 2, title: 'Casos: Inovacao em gestao', status: 'pending', notes: '' },
      { week: 3, title: 'Projeto: Prototipo de solucao', status: 'pending', notes: '' },
      { week: 4, title: 'Feedback: Teste e iteracao', status: 'pending', notes: '' },
    ],
  },
  {
    id: 10, name: 'Planejamento Estrategico', description: 'Visao sistemica e planejamento de longo prazo',
    phase: 4, status: 'pending',
    weeks: [
      { week: 1, title: 'Conceito: BSC e OKRs', status: 'pending', notes: '' },
      { week: 2, title: 'Casos: Estrategias vencedoras', status: 'pending', notes: '' },
      { week: 3, title: 'Projeto: Plano estrategico anual', status: 'pending', notes: '' },
      { week: 4, title: 'Feedback: Alinhamento estrategico', status: 'pending', notes: '' },
    ],
  },
  {
    id: 11, name: 'Cultura e Engajamento', description: 'Construcao de cultura organizacional forte',
    phase: 4, status: 'pending',
    weeks: [
      { week: 1, title: 'Conceito: Cultura como ativo', status: 'pending', notes: '' },
      { week: 2, title: 'Casos: Transformacao cultural', status: 'pending', notes: '' },
      { week: 3, title: 'Projeto: Diagnostico cultural', status: 'pending', notes: '' },
      { week: 4, title: 'Feedback: Plano de engajamento', status: 'pending', notes: '' },
    ],
  },
  {
    id: 12, name: 'Sucessao e Legado', description: 'Preparacao de sucessores e construcao de legado',
    phase: 4, status: 'pending',
    weeks: [
      { week: 1, title: 'Conceito: Pipeline de lideranca', status: 'pending', notes: '' },
      { week: 2, title: 'Casos: Transicoes bem-sucedidas', status: 'pending', notes: '' },
      { week: 3, title: 'Projeto: Plano de sucessao', status: 'pending', notes: '' },
      { week: 4, title: 'Feedback: Consolidacao final', status: 'pending', notes: '' },
    ],
  },
];

export const BEHAVIOR_MODULES: Module[] = [
  {
    id: 1, name: 'Busca de Oportunidades', description: 'Identificar oportunidades e agir com iniciativa antes de ser forcado pelas circunstancias',
    phase: 1, status: 'pending',
    weeks: [
      { week: 1, title: 'Autoconhecimento: Mapeamento de oportunidades atuais', status: 'pending', notes: '' },
      { week: 2, title: 'Pratica: Exercicios de identificacao de oportunidades', status: 'pending', notes: '' },
      { week: 3, title: 'Aplicacao: Agir sobre uma oportunidade real', status: 'pending', notes: '' },
      { week: 4, title: 'Reflexao: Avaliar resultados e aprendizados', status: 'pending', notes: '' },
    ],
  },
  {
    id: 2, name: 'Persistencia', description: 'Agir diante de obstaculos significativos, mudar de estrategia para enfrentar desafios',
    phase: 1, status: 'pending',
    weeks: [
      { week: 1, title: 'Autoconhecimento: Identificar padroes de desistencia', status: 'pending', notes: '' },
      { week: 2, title: 'Pratica: Tecnicas de resiliencia e superacao', status: 'pending', notes: '' },
      { week: 3, title: 'Aplicacao: Enfrentar um obstaculo real com persistencia', status: 'pending', notes: '' },
      { week: 4, title: 'Reflexao: Documentar estrategias que funcionaram', status: 'pending', notes: '' },
    ],
  },
  {
    id: 3, name: 'Correr Riscos Calculados', description: 'Avaliar alternativas e calcular riscos deliberadamente antes de agir',
    phase: 1, status: 'pending',
    weeks: [
      { week: 1, title: 'Autoconhecimento: Perfil de tolerancia a risco', status: 'pending', notes: '' },
      { week: 2, title: 'Pratica: Matriz de risco e analise de cenarios', status: 'pending', notes: '' },
      { week: 3, title: 'Aplicacao: Tomar uma decisao com risco calculado', status: 'pending', notes: '' },
      { week: 4, title: 'Reflexao: Avaliar o processo decisorio', status: 'pending', notes: '' },
    ],
  },
  {
    id: 4, name: 'Exigencia de Qualidade', description: 'Buscar fazer as coisas de forma melhor, mais rapida e mais barata',
    phase: 2, status: 'pending',
    weeks: [
      { week: 1, title: 'Autoconhecimento: Padroes pessoais de qualidade', status: 'pending', notes: '' },
      { week: 2, title: 'Pratica: Ferramentas de melhoria continua', status: 'pending', notes: '' },
      { week: 3, title: 'Aplicacao: Otimizar um processo ou entrega real', status: 'pending', notes: '' },
      { week: 4, title: 'Reflexao: Medir impacto da melhoria', status: 'pending', notes: '' },
    ],
  },
  {
    id: 5, name: 'Comprometimento', description: 'Fazer sacrificios pessoais e se esforcar para completar tarefas assumidas',
    phase: 2, status: 'pending',
    weeks: [
      { week: 1, title: 'Autoconhecimento: Nivel de comprometimento atual', status: 'pending', notes: '' },
      { week: 2, title: 'Pratica: Tecnicas de responsabilidade pessoal', status: 'pending', notes: '' },
      { week: 3, title: 'Aplicacao: Assumir compromisso desafiador e cumprir', status: 'pending', notes: '' },
      { week: 4, title: 'Reflexao: Avaliar alinhamento entre fala e acao', status: 'pending', notes: '' },
    ],
  },
  {
    id: 6, name: 'Busca de Informacoes', description: 'Buscar pessoalmente informacoes de clientes, fornecedores e concorrentes',
    phase: 2, status: 'pending',
    weeks: [
      { week: 1, title: 'Autoconhecimento: Fontes de informacao atuais', status: 'pending', notes: '' },
      { week: 2, title: 'Pratica: Metodos de pesquisa e coleta de dados', status: 'pending', notes: '' },
      { week: 3, title: 'Aplicacao: Investigar um tema critico a fundo', status: 'pending', notes: '' },
      { week: 4, title: 'Reflexao: Transformar informacao em acao', status: 'pending', notes: '' },
    ],
  },
  {
    id: 7, name: 'Estabelecimento de Metas', description: 'Definir metas claras e objetivos desafiadores com significado pessoal',
    phase: 3, status: 'pending',
    weeks: [
      { week: 1, title: 'Autoconhecimento: Revisar metas pessoais e profissionais', status: 'pending', notes: '' },
      { week: 2, title: 'Pratica: Framework SMART e OKRs pessoais', status: 'pending', notes: '' },
      { week: 3, title: 'Aplicacao: Definir e comunicar metas para a equipe', status: 'pending', notes: '' },
      { week: 4, title: 'Reflexao: Acompanhar progresso e ajustar', status: 'pending', notes: '' },
    ],
  },
  {
    id: 8, name: 'Planejamento Sistematico', description: 'Planejar dividindo tarefas, prever e monitorar resultados',
    phase: 3, status: 'pending',
    weeks: [
      { week: 1, title: 'Autoconhecimento: Estilo de planejamento atual', status: 'pending', notes: '' },
      { week: 2, title: 'Pratica: Ferramentas de planejamento e controle', status: 'pending', notes: '' },
      { week: 3, title: 'Aplicacao: Planejar e monitorar projeto real', status: 'pending', notes: '' },
      { week: 4, title: 'Reflexao: Analisar desvios e aprendizados', status: 'pending', notes: '' },
    ],
  },
  {
    id: 9, name: 'Persuasao e Rede de Contatos', description: 'Usar estrategias para influenciar e desenvolver rede de contatos',
    phase: 3, status: 'pending',
    weeks: [
      { week: 1, title: 'Autoconhecimento: Mapa da rede de contatos atual', status: 'pending', notes: '' },
      { week: 2, title: 'Pratica: Tecnicas de persuasao e influencia', status: 'pending', notes: '' },
      { week: 3, title: 'Aplicacao: Expandir rede e influenciar decisao', status: 'pending', notes: '' },
      { week: 4, title: 'Reflexao: Avaliar qualidade dos relacionamentos', status: 'pending', notes: '' },
    ],
  },
  {
    id: 10, name: 'Independencia e Autoconfianca', description: 'Buscar autonomia em relacao a normas e manter confianca nas proprias capacidades',
    phase: 4, status: 'pending',
    weeks: [
      { week: 1, title: 'Autoconhecimento: Nivel de autonomia e confianca', status: 'pending', notes: '' },
      { week: 2, title: 'Pratica: Exercicios de tomada de decisao autonoma', status: 'pending', notes: '' },
      { week: 3, title: 'Aplicacao: Liderar iniciativa independente', status: 'pending', notes: '' },
      { week: 4, title: 'Reflexao: Avaliar crescimento em autoconfianca', status: 'pending', notes: '' },
    ],
  },
  {
    id: 11, name: 'Lideranca Empreendedora', description: 'Integrar comportamentos empreendedores na pratica de lideranca diaria',
    phase: 4, status: 'pending',
    weeks: [
      { week: 1, title: 'Autoconhecimento: Perfil de lideranca empreendedora', status: 'pending', notes: '' },
      { week: 2, title: 'Pratica: Modelos de lideranca inspiradora', status: 'pending', notes: '' },
      { week: 3, title: 'Aplicacao: Liderar equipe com mentalidade empreendedora', status: 'pending', notes: '' },
      { week: 4, title: 'Reflexao: Avaliar impacto na equipe', status: 'pending', notes: '' },
    ],
  },
  {
    id: 12, name: 'Visao Sistemica', description: 'Desenvolver visao integrada do negocio e pensar de forma estrategica',
    phase: 4, status: 'pending',
    weeks: [
      { week: 1, title: 'Autoconhecimento: Capacidade de visao macro atual', status: 'pending', notes: '' },
      { week: 2, title: 'Pratica: Ferramentas de pensamento sistemico', status: 'pending', notes: '' },
      { week: 3, title: 'Aplicacao: Analisar problema com visao integrada', status: 'pending', notes: '' },
      { week: 4, title: 'Reflexao: Consolidar aprendizado sistemico', status: 'pending', notes: '' },
    ],
  },
];

export const CHALLENGES: Challenge[] = [
  { id: 1, name: 'Feedback Construtivo', description: 'Dar feedback honesto e construtivo a 3 membros da equipe em situacoes reais', phase: 1, status: 'pending', evidence: '', reflection: '' },
  { id: 2, name: 'Escuta Ativa', description: 'Praticar escuta ativa em 5 reunioes consecutivas sem interromper', phase: 1, status: 'pending', evidence: '', reflection: '' },
  { id: 3, name: 'Delegacao Eficaz', description: 'Delegar uma tarefa importante e acompanhar sem microgerenciar', phase: 1, status: 'pending', evidence: '', reflection: '' },
  { id: 4, name: 'Decisao sob Pressao', description: 'Tomar uma decisao critica com informacoes incompletas e documentar o processo', phase: 2, status: 'pending', evidence: '', reflection: '' },
  { id: 5, name: 'Apresentacao Executiva', description: 'Preparar e apresentar resultados para a diretoria com dados e storytelling', phase: 2, status: 'pending', evidence: '', reflection: '' },
  { id: 6, name: 'Gestao de Conflitos', description: 'Mediar um conflito real na equipe usando tecnicas de resolucao', phase: 2, status: 'pending', evidence: '', reflection: '' },
  { id: 7, name: 'Networking Estrategico', description: 'Estabelecer 10 novos contatos estrategicos em 30 dias', phase: 3, status: 'pending', evidence: '', reflection: '' },
  { id: 8, name: 'Projeto de Mudanca', description: 'Liderar uma iniciativa de mudanca com resistencia e superacao', phase: 3, status: 'pending', evidence: '', reflection: '' },
  { id: 9, name: 'Inovacao Aplicada', description: 'Implementar uma ideia inovadora que gere resultado mensuravel', phase: 3, status: 'pending', evidence: '', reflection: '' },
  { id: 10, name: 'Mentoria', description: 'Mentorar um profissional junior por 60 dias com PDI estruturado', phase: 4, status: 'pending', evidence: '', reflection: '' },
  { id: 11, name: 'Visao Estrategica', description: 'Criar e apresentar uma proposta estrategica para os proximos 3 anos', phase: 4, status: 'pending', evidence: '', reflection: '' },
  { id: 12, name: 'Legado Pessoal', description: 'Documentar seu modelo de gestao e preparar um sucessor', phase: 4, status: 'pending', evidence: '', reflection: '' },
];

export const PROJECTS: Project[] = [
  { id: 1, name: 'Diagnostico de Lideranca', area: 'Lideranca', description: 'Mapear o estilo de lideranca atual e criar plano de desenvolvimento', month: 1, status: 'pending', deliverables: [{ name: 'Autoavaliacao de lideranca', done: false }, { name: 'Feedback 360 graus', done: false }, { name: 'Plano de acao pessoal', done: false }], metrics: 'Score de autoconhecimento' },
  { id: 2, name: 'Plano de Comunicacao', area: 'Comunicacao', description: 'Desenvolver plano de comunicacao para a equipe', month: 2, status: 'pending', deliverables: [{ name: 'Mapeamento de stakeholders', done: false }, { name: 'Matriz de comunicacao', done: false }, { name: 'Calendario editorial', done: false }], metrics: 'Satisfacao da equipe' },
  { id: 3, name: 'PDI da Equipe', area: 'Pessoas', description: 'Criar planos de desenvolvimento individual para cada membro', month: 3, status: 'pending', deliverables: [{ name: 'Avaliacao individual', done: false }, { name: 'PDI de cada membro', done: false }, { name: 'Cronograma de acompanhamento', done: false }], metrics: 'Engajamento da equipe' },
  { id: 4, name: 'Framework de Decisao', area: 'Estrategia', description: 'Criar framework padrao para tomada de decisao do departamento', month: 4, status: 'pending', deliverables: [{ name: 'Matriz de decisao', done: false }, { name: 'Fluxo de aprovacao', done: false }, { name: 'Template de analise', done: false }], metrics: 'Velocidade de decisao' },
  { id: 5, name: 'Orcamento Zero-Based', area: 'Financeiro', description: 'Revisar e otimizar o orcamento departamental com base zero', month: 5, status: 'pending', deliverables: [{ name: 'Analise de custos atual', done: false }, { name: 'Proposta de orcamento', done: false }, { name: 'ROI projetado', done: false }], metrics: 'Reducao de custos %' },
  { id: 6, name: 'Melhoria de Processo', area: 'Operacoes', description: 'Mapear e otimizar processo critico do departamento', month: 6, status: 'pending', deliverables: [{ name: 'Mapa AS-IS', done: false }, { name: 'Mapa TO-BE', done: false }, { name: 'Plano de implementacao', done: false }], metrics: 'Tempo de ciclo reduzido' },
  { id: 7, name: 'Acordo Estrategico', area: 'Negociacao', description: 'Negociar acordo com fornecedor ou parceiro estrategico', month: 7, status: 'pending', deliverables: [{ name: 'BATNA definido', done: false }, { name: 'Proposta de valor', done: false }, { name: 'Contrato assinado', done: false }], metrics: 'Valor gerado no acordo' },
  { id: 8, name: 'Iniciativa de Mudanca', area: 'Change Management', description: 'Liderar projeto de mudanca organizacional', month: 8, status: 'pending', deliverables: [{ name: 'Diagnostico de prontidao', done: false }, { name: 'Plano de comunicacao da mudanca', done: false }, { name: 'Quick wins implementados', done: false }], metrics: 'Adesao da equipe %' },
  { id: 9, name: 'Laboratorio de Inovacao', area: 'Inovacao', description: 'Conduzir sprint de inovacao para resolver problema real', month: 9, status: 'pending', deliverables: [{ name: 'Problem statement', done: false }, { name: 'Ideacao e prototipo', done: false }, { name: 'MVP testado', done: false }], metrics: 'Solucao implementada' },
  { id: 10, name: 'Plano Estrategico 3 Anos', area: 'Estrategia', description: 'Elaborar plano estrategico trienal para o departamento', month: 10, status: 'pending', deliverables: [{ name: 'Analise SWOT', done: false }, { name: 'OKRs definidos', done: false }, { name: 'Roadmap estrategico', done: false }], metrics: 'Alinhamento com diretoria' },
  { id: 11, name: 'Programa de Cultura', area: 'Cultura', description: 'Desenhar e implementar programa de fortalecimento cultural', month: 11, status: 'pending', deliverables: [{ name: 'Pesquisa de cultura', done: false }, { name: 'Rituais definidos', done: false }, { name: 'Programa de reconhecimento', done: false }], metrics: 'eNPS da equipe' },
  { id: 12, name: 'Plano de Sucessao', area: 'Sucessao', description: 'Preparar plano de sucessao e documentacao de legado', month: 12, status: 'pending', deliverables: [{ name: 'Mapeamento de competencias', done: false }, { name: 'Trilha de desenvolvimento do sucessor', done: false }, { name: 'Documentacao de processos', done: false }], metrics: 'Prontidao do sucessor' },
];

export const CHECKIN_QUESTIONS: Record<string, string[]> = {
  '7h': [
    'Qual e minha principal meta para hoje?',
    'Quais obstaculos posso antecipar?',
    'Que CCE vou praticar conscientemente hoje?',
  ],
  '13h': [
    'Como estou progredindo na meta do dia?',
    'Tomei alguma decisao importante? Qual foi o criterio?',
    'Pratiquei a CCE que planejei?',
  ],
  '20h': [
    'Qual foi minha principal conquista hoje?',
    'O que aprendi que posso aplicar amanha?',
    'De 1 a 10, como foi meu dia como gestor?',
  ],
};

export const DEFAULT_CCE_SCORES: Record<string, number> = Object.fromEntries(
  CCE_NAMES.map((name) => [name, 4.3])
);
