// O CONTEÚDO DO MAPA DO CÉREBRO. No ecrã aparecem o ícone, o título, a frase e a imagem de cada
// ponto (frases soltas); o que se diz vive em `notas`, que só se vê na janela do apresentador (P)
// ou com a tecla N. Números: só os medidos no código ou no plano do Javier, com a fonte ao lado.

import type { Estado, Lobo, LoboId, Passo, Percurso, Ponto } from './tipos.ts';

export const CENTRO = {
  titulo: 'O Cérebro BMS',
  frase: 'Diz ao centro o próximo passo. E aprende com o que ele decide.',
  notas:
    'Uma imagem para tudo o que vem a seguir: um GPS. As estradas continuam todas lá — são as regras de cada centro. ' +
    'O GPS não as muda: diz a próxima curva e recalcula quando nos desviamos. O cliente não precisa de conhecer o mapa ' +
    'inteiro, só o próximo passo. Para nós, equipa, é a bússola: dá o norte. Três lobos, um cérebro: o que o cliente vê, ' +
    'a base onde tudo assenta, e a inteligência que liga as duas.',
};

export const LOBOS: Lobo[] = [
  {
    id: 'E',
    numero: 1,
    icone: 'Eye',
    titulo: 'Experiência',
    frase: 'O cliente apaixona-se pelo que vê.',
    notas:
      'O frontend não é a cara bonita do produto: é onde o cliente decide se confia. Num estudo clássico, de 1995, as ' +
      'pessoas acharam mais fácil de usar o mesmo multibanco quando o ecrã era mais bonito — chama-se efeito ' +
      'estético-usabilidade. E o cérebro procura padrões: quando um ecrã se parece com o que já conhece, sente que já ' +
      'sabe usá-lo. É isso que uma linguagem visual única dá.',
    x: -1500,
    y: -150,
    largura: 1250,
    altura: 980,
    pega: { left: '98%', top: '30%' },
    semente: 7,
  },
  {
    id: 'B',
    numero: 2,
    icone: 'Landmark',
    titulo: 'Fundação',
    frase: 'Uma verdade por conceito.',
    notas:
      'Ninguém vê este lobo, mas é ele que decide se a inteligência é de confiança. Uma IA em cima de duas verdades diz ' +
      'duas coisas diferentes — e o cliente deixa de acreditar nela à primeira. Por isso o backend tem de estar tão bem ' +
      'pensado: cada conceito calculado num sítio só, cada módulo dono do que é seu, e tudo o que acontece capturado desde ' +
      'o primeiro dia.',
    x: 250,
    y: -150,
    largura: 1250,
    altura: 980,
    pega: { left: '2%', top: '30%' },
    semente: 19,
  },
  {
    id: 'I',
    numero: 3,
    icone: 'Brain',
    titulo: 'Inteligência',
    frase: 'Prevê. Explica. Propõe. O humano decide.',
    notas:
      'É o plano do Javier, em linguagem simples. Uma cópia dos dados fora de produção, limpa com as nossas leis; um ' +
      'preditor que diz quem e quanto; um modelo de linguagem que explica e propõe — mas nunca calcula; e uma autonomia ' +
      'que sobe por confiança medida. E uma boa notícia: metade desta inteligência já existe na BMS.',
    x: -625,
    y: -1230,
    largura: 1250,
    altura: 930,
    pega: { left: '50%', top: '98%' },
    semente: 31,
  },
];

/** A cadeia do lago, igual em I1, I2 e I3 — cada um acende o seu elo. */
const CADEIA_DO_LAGO = [
  { icone: 'Database', rotulo: 'Produção' },
  { icone: 'Copy', rotulo: 'Cópia noturna' },
  { icone: 'Brush', rotulo: 'Limpeza' },
  { icone: 'Droplets', rotulo: 'Lago limpo' },
];

export const PONTOS: Ponto[] = [
  // ── Lobo 1 · Experiência ────────────────────────────────────────────────────
  {
    id: 'F1',
    lobo: 'E',
    icone: 'Signpost',
    titulo: 'A poluição de hoje',
    frase: 'Muitas portas para o mesmo sítio.',
    prova: '19 entradas · 24 atalhos «Configurações»',
    fonte: 'Auditoria da navegação do BMS-v2',
    estado: 'problema',
    visual: {
      tipo: 'versus',
      a: { valor: '19', legenda: 'entradas no menu hoje', tom: 'problema' },
      b: { valor: '8', legenda: 'grupos por intenção', tom: 'lima' },
      nota: '+ 24 atalhos «Configurações» espalhados',
    },
    notas:
      'Medido no código, não é opinião: 19 entradas no topo do menu, 24 atalhos para «Configurações», destinos com duas ' +
      'portas — Clientes e CRM, a Faturação duas vezes — e «Profissionais» com dois significados. Quem não sabe o caminho ' +
      'perde-se aqui, e nenhuma IA resolve isto sozinha.',
  },
  {
    id: 'F2',
    lobo: 'E',
    icone: 'Palette',
    titulo: 'Uma linguagem visual',
    frase: 'O desenho decide-se antes do código.',
    prova: 'Paleta Lima · Poppins · peças que só desenham',
    fonte: 'Design system bms-ui',
    estado: 'curso',
    notas:
      'Não é pintar o que existe: é uma mudança de mentalidade. Primeiro decide-se como cada coisa se vê e se comporta — ' +
      'um botão, uma tabela, um cartão — e só depois se constrói. A mesma peça em todo o lado: o cliente aprende uma vez e ' +
      'reconhece sempre. E é o que nos deixa construir mais depressa com a equipa que temos.',
  },
  {
    id: 'F3',
    lobo: 'E',
    icone: 'LayoutGrid',
    titulo: 'Menu por intenção',
    frase: 'Cada destino, uma porta.',
    prova: '8 grupos no lugar de 19 entradas',
    fonte: 'Proposta de menu',
    estado: 'curso',
    notas:
      'Visão geral, Clientes, Vendas, Agenda, Equipa, Programas, Comunicação, Gestão. Agrupado pelo que a pessoa quer ' +
      'fazer, não pela forma como o código está organizado. Fundir Clientes com o CRM está à espera da decisão do Paulo.',
  },
  {
    id: 'F12',
    lobo: 'E',
    icone: 'Lock',
    titulo: 'A barra não muda',
    frase: 'O polegar já sabe o caminho.',
    prova: 'Memória · ajuda · manuais · imagem',
    fonte: 'Decisão de navegação',
    estado: 'nota',
    visual: { tipo: 'telemovel', variante: 'fixo' },
    notas:
      'A primeira ideia era deixar cada pessoa mudar os botões de baixo. Não deixamos, por quatro razões. Memória: o polegar vai ' +
      'sozinho ao mesmo sítio; se muda, a pessoa tem de ler outra vez. Ajuda: «carrega no segundo botão em baixo» só ' +
      'funciona se for igual para todos — a rececionista ensina a colega nova, o suporte orienta por telefone. Manuais e ' +
      'vídeos deixam de bater certo com o ecrã. E a imagem: quem mexeu esquece-se, acha que foi a BMS, e isso vira pedidos ' +
      'de suporte e má fama do produto.',
  },
  {
    id: 'F13',
    lobo: 'E',
    icone: 'Activity',
    titulo: 'Vivo pelo conteúdo',
    frase: 'Muda o Início. Nunca os botões.',
    prova: 'Barra por função · os meus atalhos · «Hoje no teu centro»',
    fonte: 'Proposta do Rúben · decisão de navegação',
    estado: 'curso',
    visual: { tipo: 'telemovel', variante: 'vivo' },
    notas:
      'O Rúben tem razão numa coisa: a rececionista, o treinador e o gestor não usam as mesmas coisas. Resolve-se sem mexer na ' +
      'navegação. Primeiro, uma barra por função, decidida por nós ou pelo centro uma vez: todas as rececionistas veem a ' +
      'mesma. Segundo, atalhos no Início que cada um escolhe e ordena. Terceiro, o que muda é o conteúdo — contadores, a ' +
      'agenda de hoje, o cartão da IA «Hoje no teu centro». O Spotify muda o Início todos os dias; os botões de baixo, ' +
      'nunca. Cada lado fica com o que defende: a navegação estável e uma app viva.',
  },
  {
    id: 'F4',
    lobo: 'E',
    icone: 'Inbox',
    titulo: 'O Feed decide',
    frase: 'A IA chega onde já se olha.',
    prova: 'Feed único desde 24/09/2026',
    fonte: 'recordNotice · api_v1',
    estado: 'parcial',
    visual: {
      tipo: 'cadeia',
      elos: [
        { icone: 'Sparkles', rotulo: 'A IA propõe' },
        { icone: 'Inbox', rotulo: 'Chega ao Feed' },
        { icone: 'Check', rotulo: 'Aprovar' },
        { icone: 'TrendingUp', rotulo: 'Aprende' },
      ],
    },
    notas:
      'A IA não cria ecrãs novos. O Feed já é o único sítio onde cada pessoa lê o que o centro ou o sistema lhe manda. As ' +
      'propostas da IA entram lá, com o filtro «Por decidir», a justificação e os botões Aprovar e Rejeitar. Cada clique ' +
      'fica gravado — e é daí que vem a aprendizagem.',
  },
  {
    id: 'F5',
    lobo: 'E',
    icone: 'Euro',
    titulo: 'Dinheiro em risco',
    frase: 'Quem, quanto, o que fazer.',
    prova: 'Um cartão no Dashboard',
    fonte: 'Plano do Javier · alvo 2',
    estado: 'falta',
    notas:
      'O número que o centro sente no banco: esta semana, estes clientes, este valor em risco, e a ação proposta para cada ' +
      'um. Não é mais um ecrã — é um cartão no Dashboard que já existe.',
  },
  {
    id: 'F6',
    lobo: 'E',
    icone: 'ClipboardCheck',
    titulo: 'O cartão de proposta',
    frase: 'Ver antes de acontecer.',
    prova: '12 ações já propõem cartões',
    fonte: 'catalogoDeAcoes.js · api_v1',
    estado: 'existe',
    visual: {
      tipo: 'cartao',
      titulo: 'Lembrete a 9 clientes',
      porque: 'Débito falhou; costumam pagar até dia 10',
      efeito: '9 avisos pela app, hoje às 18h',
      desfazer: 'Cancelar antes das 18h',
    },
    notas:
      'O que a IA quer fazer, porquê, qual o efeito e como se desfaz. A confiança vem de ver antes de acontecer. Isto já ' +
      'existe no assistente: doze gestos que a app confirma com a sessão de quem carrega no botão.',
  },
  {
    id: 'F7',
    lobo: 'E',
    icone: 'Sparkles',
    titulo: 'Dizer uma regra',
    frase: 'A regra é do centro, não do código.',
    prova: '«Cria com IA» nos Fluxos do CRM',
    fonte: 'CRM › Automação › Fluxos',
    estado: 'parcial',
    visual: {
      tipo: 'cadeia',
      elos: [
        { icone: 'MessageCircle', rotulo: 'Por palavras' },
        { icone: 'Layers', rotulo: 'Listas fechadas' },
        { icone: 'Check', rotulo: 'Validador' },
        { icone: 'ClipboardCheck', rotulo: 'Rascunho' },
      ],
    },
    notas:
      'O centro escreve a regra por palavras e o sistema mostra o que entendeu, a quem se aplica e o efeito. Já funciona ' +
      'nos Fluxos do CRM. É isto que torna o ERP dinâmico sem deixar de ter regras.',
  },
  {
    id: 'F8',
    lobo: 'E',
    icone: 'Users',
    titulo: 'Dois públicos, uma app',
    frase: 'Cliente: simples. Equipa: densa, arrumada.',
    prova: 'Uma app, duas cascas pelo papel',
    fonte: 'Princípio de desenho',
    estado: 'curso',
    notas:
      'O cliente final quer tudo a um toque e a informação a aparecer aos poucos. A equipa do centro precisa de densidade, ' +
      'mas organizada. É a mesma app e as mesmas peças, com cascas diferentes conforme quem entra.',
  },
  {
    id: 'F9',
    lobo: 'E',
    icone: 'Hourglass',
    titulo: 'Sem ansiedade',
    frase: 'A forma do ecrã antes dos dados.',
    prova: 'Esqueleto, nunca «em construção»',
    fonte: 'Regra de desenho',
    estado: 'curso',
    notas:
      'Enquanto carrega, mostra-se a forma real do ecrã. O cliente sente que é rápido e que o produto está acabado. ' +
      'Spinner só nos botões e nas ações curtas.',
  },
  {
    id: 'F10',
    lobo: 'E',
    icone: 'Eye',
    titulo: 'Parece que já conheço',
    frase: 'Do site à app, a mesma linguagem.',
    prova: 'Efeito estético-usabilidade',
    fonte: 'Kurosu e Kashimura, 1995 · Lei de Jakob',
    estado: 'nota',
    visual: { tipo: 'numero', valor: '1995', legenda: 'mais bonito parece mais fácil de usar' },
    notas:
      'O cérebro humano procura padrões. Quando a landing page, a app e o painel falam a mesma linguagem — as mesmas ' +
      'cores, as mesmas formas, os mesmos gestos —, o cliente sente que já conhece, e conhecer dá confiança. E um ecrã ' +
      'bonito é percebido como mais fácil de usar, mesmo quando faz exatamente o mesmo. O cliente apaixona-se pelo que vê; ' +
      'a inteligência é o que o faz ficar.',
  },
  {
    id: 'Q6',
    lobo: 'Q',
    icone: 'Smartphone',
    titulo: 'Flutter ou React?',
    frase: 'A especificação serve as duas.',
    prova: '1,57 M linhas de Dart',
    fonte: 'BMS-v2 · câmara, QR, biometria, Bluetooth, Watch',
    estado: 'nota',
    extra: {
      tipo: 'colunas',
      esquerda: {
        titulo: 'Flutter',
        itens: ['Telemóvel muito bom, um código só', 'Todo o nativo já feito', 'Web pesada no painel denso', 'Menos gente a contratar'],
      },
      direita: {
        titulo: 'React',
        itens: ['Web rápida no painel', 'Muito mais gente a contratar', 'Mais exemplos para a IA', 'Nativo por plugins; Watch à parte'],
      },
    },
    notas:
      'Não é uma decisão para hoje. O desenho e as regras valem para as duas. Contratar para React é mais fácil — mas mesmo ' +
      'com o Claude a programar, quem lá estiver tem de saber React para rever o que a IA escreve. E há uma via do meio: o ' +
      'painel da equipa em React e a app do cliente em Flutter, a falar com a mesma API.',
  },

  // ── Lobo 2 · Fundação ───────────────────────────────────────────────────────
  {
    id: 'B1',
    lobo: 'B',
    icone: 'Ruler',
    titulo: 'Uma régua por conceito',
    frase: 'Duas verdades, zero confiança.',
    prova: 'O mesmo filtro, dois números',
    fonte: 'Pedido de suporte da Be-Fit Évora',
    estado: 'parcial',
    visual: {
      tipo: 'versus',
      a: { valor: '5', legenda: 'CRM · «Pagamento em falta»', tom: 'problema' },
      b: { valor: '0', legenda: 'Clientes · o mesmo filtro', tom: 'problema' },
      nota: 'A mesma pergunta, duas respostas',
    },
    notas:
      'Um pedido real desta semana: no CRM, a coluna «Pagamento em falta» tinha cinco pessoas; na lista de Clientes, o ' +
      'mesmo filtro dava zero. Dois sítios a calcular a mesma coisa de maneiras diferentes. Para uma pessoa é um erro; ' +
      'para uma IA é veneno — ela repete as duas. Quanto deve, está ativo, é lead: cada conceito num sítio só.',
  },
  {
    id: 'B2',
    lobo: 'B',
    icone: 'Boxes',
    titulo: 'Monólito modular',
    frase: 'Cada módulo, dono do que é seu.',
    prova: 'Aprovado · primeiro módulo por abrir',
    fonte: 'Apresentação da arquitetura',
    estado: 'curso',
    notas:
      'Já apresentado e aprovado. A ligação ao cérebro: cada módulo passa a ser dono dos seus dados, dos seus eventos, das ' +
      'ferramentas com que a IA o lê e das ações com que a IA lhe pede coisas. O cérebro pergunta ao módulo — não a ' +
      'código espalhado.',
  },
  {
    id: 'B3',
    lobo: 'B',
    icone: 'Radar',
    titulo: 'Capturar desde o dia um',
    frase: 'O que não se captura não existe.',
    prova: 'Eventos, tarefas, ações, experiências',
    fonte: 'Plano do Javier · fase 1',
    estado: 'falta',
    visual: {
      tipo: 'versus',
      a: { valor: '6', legenda: 'tabelas novas no plano', tom: 'neutro' },
      b: { valor: '0', legenda: 'existem hoje', tom: 'problema' },
      nota: 'Cada mês sem captura é um mês que o cérebro nunca vê',
    },
    notas:
      'A regra que manda no plano do Javier. Eventos de negócio, tarefas da operação com minutos e euros, ações da IA, ' +
      'experiências com grupo de controlo, de onde veio cada dado. Cada mês sem isto é um mês que o cérebro nunca vai ver. ' +
      'É trabalho de backend normal — e começa agora.',
  },
  {
    id: 'B4',
    lobo: 'B',
    icone: 'Footprints',
    titulo: 'O rasto',
    frase: 'Quem fez, o quê, de onde.',
    prova: 'activity_log · audit_events · WAL',
    fonte: 'Arquivo diário no Spaces',
    estado: 'existe',
    notas:
      'Já gravamos cada pedido que muda alguma coisa, cada escrita sobre uma pessoa, e quem e de onde até dentro da ' +
      'transação. É a matéria-prima para explicar qualquer número — e para o cérebro aprender.',
  },
  {
    id: 'B5',
    lobo: 'B',
    icone: 'Scale',
    titulo: 'As leis da casa',
    frase: '490 erros que não se repetem.',
    prova: '19 temas · 66 só na faturação',
    fonte: 'docs/gotchas, no repositório',
    estado: 'existe',
    visual: { tipo: 'numero', valor: '490', legenda: 'regras pagas com incidentes reais' },
    notas:
      'Sempre que um erro nos custou dinheiro, tempo ou um cliente, escrevemos a regra que o impede de voltar. Exemplo: ' +
      '«uma cobrança automática pára às três tentativas». São cerca de 490, em 19 temas, um ficheiro por tema dentro do ' +
      'código. O código cumpre-as e os testes vigiam-nas. E são exatamente as regras que a limpeza de dados do cérebro vai ' +
      'aplicar: a IA herda a nossa experiência.',
  },
  {
    id: 'B6',
    lobo: 'B',
    icone: 'Database',
    titulo: 'Os dados que temos',
    frase: 'A vantagem são os dados.',
    prova: 'Clientes, inscrições, pagamentos, acessos, treinos, CRM',
    fonte: 'Esquema bms_tech',
    estado: 'existe',
    visual: { tipo: 'numero', valor: '786', legenda: 'tabelas de operação real' },
    notas:
      'Clientes, inscrições, ciclos, pagamentos, acessos, aulas, treinos, CRM, stock. Anos de operação de centros reais, em ' +
      'Portugal e Espanha. Qualquer empresa pode alugar o melhor modelo de IA amanhã; ninguém pode alugar estes dados.',
  },
  {
    id: 'B7',
    lobo: 'B',
    icone: 'FlaskConical',
    titulo: 'Experimentar sem medo',
    frase: 'Nada local toca em produção.',
    prova: 'Docker local · base e contas próprias',
    fonte: 'PR arquitetura-e-language',
    estado: 'curso',
    notas:
      'Cada pessoa trabalha com uma base sua, contas de teste e o mesmo motor da produção. Para construir inteligência é ' +
      'preciso errar à vontade — e errar em produção é com dados de clientes reais.',
  },
  {
    id: 'B8',
    lobo: 'B',
    icone: 'Banknote',
    titulo: 'A IA não toca no dinheiro',
    frase: 'A IA prepara. O centro carrega no botão.',
    prova: 'Bloqueado no código + teste que reprova',
    fonte: 'motorDeAcoes.js · api_v1',
    estado: 'existe',
    visual: {
      tipo: 'cadeia',
      elos: [
        { icone: 'Sparkles', rotulo: 'A IA prepara' },
        { icone: 'Eye', rotulo: 'O centro revê' },
        { icone: 'Hand', rotulo: 'O centro carrega' },
        { icone: 'Banknote', rotulo: 'Pago' },
      ],
      ativo: 2,
    },
    notas:
      'Não é uma promessa, é código: SEPA, pagamentos, Stripe, Vendus, caixa e checkout estão fora do alcance da IA, e um ' +
      'teste reprova quem tentar acrescentar uma ação nesses caminhos. A IA pode preparar tudo — o fornecedor, o valor, a ' +
      'justificação — e o centro decide no ecrã de pagamentos que já existe.',
  },
  {
    id: 'B9',
    lobo: 'B',
    icone: 'BrickWall',
    titulo: 'Os muros',
    frase: 'A IA não pode mais do que quem a usa.',
    prova: 'O âmbito que o modelo envia é apagado',
    fonte: 'secure-controller · executores da IA',
    estado: 'existe',
    notas:
      'Cada pedido prova o que pode ver. Se o modelo mandar o centro ou a empresa, o servidor apaga-o e usa o de quem está ' +
      'autenticado. A IA passa pelos mesmos muros que o ecrã.',
  },

  // ── Lobo 3 · Inteligência ───────────────────────────────────────────────────
  {
    id: 'I1',
    lobo: 'I',
    icone: 'Copy',
    titulo: 'O lago bruto',
    frase: 'Uma fotocópia por noite.',
    prova: 'Fora de produção, depois das cobranças',
    fonte: 'Plano do Javier · fase 3',
    estado: 'falta',
    visual: { tipo: 'cadeia', elos: CADEIA_DO_LAGO, ativo: 1 },
    notas:
      'Todas as noites, depois das cobranças, copia-se o que interessa para fora de produção, tal como está. Serve para ' +
      'analisar sem pesar no sistema dos clientes, para guardar como as coisas estavam em cada dia, e para refazer tudo do ' +
      'zero quando uma regra de limpeza muda. Começa simples: uma cópia noturna chega para os primeiros meses.',
  },
  {
    id: 'I2',
    lobo: 'I',
    icone: 'Brush',
    titulo: 'A limpeza',
    frase: 'As leis da casa, aplicadas aos dados.',
    prova: 'O que não passa fica em quarentena',
    fonte: 'Plano do Javier · contratos de dados',
    estado: 'falta',
    visual: { tipo: 'cadeia', elos: CADEIA_DO_LAGO, ativo: 2 },
    notas:
      'Uma pessoa é uma pessoa, mesmo com duas contas. Um instante tem fuso. Dinheiro em cêntimos. Um estado é uma ' +
      'sequência, não um campo. O que falha uma regra não se força: fica em quarentena com o motivo. E quanto melhor a ' +
      'fundação, menos há para limpar.',
  },
  {
    id: 'I3',
    lobo: 'I',
    icone: 'Droplets',
    titulo: 'O lago curado',
    frase: 'Dados limpos, sem nomes.',
    prova: 'Sem nome, email nem morada',
    fonte: 'RGPD · minimização',
    estado: 'falta',
    visual: { tipo: 'cadeia', elos: CADEIA_DO_LAGO, ativo: 3 },
    notas:
      'É onde o preditor aprende. Não tem nomes, emails nem moradas — a morada vira uma zona. A privacidade fica garantida ' +
      'pela construção, não por cuidado.',
  },
  {
    id: 'I4',
    lobo: 'I',
    icone: 'CloudSun',
    titulo: 'O preditor',
    frase: 'Uma previsão do tempo para clientes.',
    prova: 'Churn a 90 dias, pessoa a pessoa',
    fonte: 'Plano do Javier · alvo 1',
    estado: 'falta',
    visual: { tipo: 'medidor', percentagem: 70, legenda: 'de risco de sair nos próximos 90 dias' },
    notas:
      'Já sabemos quem entrou, quem saiu e quem cancelou — é o passado, no Mapa de Resultados, e já há contagens mensais ' +
      'por cliente pré-calculadas na Pontuação. O preditor olha para a frente: esta pessoa, nos próximos 90 dias, que ' +
      'probabilidade tem de sair? Aprende padrões que conhecemos de cor, como toda a gente a inscrever-se em janeiro e ' +
      'metade a desaparecer em março. É o único machine learning a fazer, corre num servidor normal, e só entra em ' +
      'produção se ganhar a uma regra simples.',
  },
  {
    id: 'I5',
    lobo: 'I',
    icone: 'MessageCircle',
    titulo: 'O LLM',
    frase: 'A voz. Nunca a calculadora.',
    prova: 'Números só de ferramentas',
    fonte: 'Contrato do BMS.Ai',
    estado: 'existe',
    visual: {
      tipo: 'cadeia',
      elos: [
        { icone: 'Database', rotulo: 'A ferramenta conta' },
        { icone: 'MessageCircle', rotulo: 'O LLM explica' },
        { icone: 'Users', rotulo: 'A pessoa percebe' },
      ],
      ativo: 1,
    },
    notas:
      'LLM é o modelo de linguagem — o Claude, o GPT. Percebe e escreve texto. É a voz e o tradutor: explica uma ' +
      'previsão, propõe uma ação, classifica um texto livre. Mas nunca calcula: todo o número que escreve tem de ter vindo ' +
      'de uma ferramenta. Isto já é regra no BMS.Ai.',
  },
  {
    id: 'I6',
    lobo: 'I',
    icone: 'Hand',
    titulo: 'Olhos e mãos',
    frase: 'Só vê e só faz o que está no catálogo.',
    prova: 'Um registo único, com o risco de cada uma',
    fonte: 'registo.js · catalogoDeAcoes.js',
    estado: 'existe',
    visual: {
      tipo: 'versus',
      a: { valor: '~100', legenda: 'olhos · ferramentas de leitura', tom: 'lima' },
      b: { valor: '12', legenda: 'mãos · ações que propõe', tom: 'lima' },
    },
    notas:
      'Os olhos são as ferramentas de leitura: perto de cem. As mãos são as ações: doze, cada uma um gesto que um ecrã já ' +
      'faz pela mesma rota. Tudo num registo único, com o risco de cada uma declarado. A IA não inventa caminhos.',
  },
  {
    id: 'I7',
    lobo: 'I',
    icone: 'Workflow',
    titulo: 'O motor de workflows',
    frase: 'O motor dos Fluxos, para tudo.',
    prova: 'Corre todas as manhãs no CRM',
    fonte: 'CRM › Automação › Fluxos',
    estado: 'parcial',
    visual: {
      tipo: 'cadeia',
      elos: [
        { icone: 'Bell', rotulo: 'Gatilho' },
        { icone: 'Workflow', rotulo: 'Passos' },
        { icone: 'Users', rotulo: 'Responsável' },
        { icone: 'CalendarDays', rotulo: 'Todas as manhãs' },
      ],
    },
    notas:
      'Já existe e funciona no CRM: gatilhos de uma lista fechada, passos, uma fila de responsáveis. A IA escolhe só de ' +
      'listas; o código monta e valida com o mesmo validador do editor; o que não sabe fazer, recusa e diz porquê. ' +
      'Generalizar este motor a todos os módulos é a ponte entre o que temos e o que queremos.',
  },
  {
    id: 'I8',
    lobo: 'I',
    icone: 'Layers',
    titulo: 'Quatro níveis',
    frase: 'Propõe · Avisa · Faz · Nunca.',
    prova: 'Hoje: propõe (e a voz de vendas faz)',
    fonte: 'Plano do Javier',
    estado: 'parcial',
    visual: {
      tipo: 'escada',
      degraus: [
        { rotulo: 'Propõe e espera', texto: 'Nada acontece sem um humano' },
        { rotulo: 'Faz e avisa', texto: 'O humano pode desfazer' },
        { rotulo: 'Faz sozinho', texto: 'Rotina, sempre registada' },
        { rotulo: 'Nunca', texto: 'Não existe ferramenta para isso' },
      ],
    },
    notas:
      'A confiança não é um interruptor: gradua-se. Cada tarefa tem o seu nível e um limite em euros. Mudar um preço ou ' +
      'cancelar uma inscrição: propõe e espera. Um lembrete de renovação: faz e avisa. O relatório noturno: faz sozinho. ' +
      'Assinar um contrato ou fechar um centro: nunca.',
  },
  {
    id: 'I9',
    lobo: 'I',
    icone: 'TrendingUp',
    titulo: 'A confiança sobe medida',
    frase: '«Já aprovaste 20 destas sem mexer.»',
    prova: 'Um humano decide a subida',
    fonte: 'Regra do plano do Javier',
    estado: 'falta',
    visual: {
      tipo: 'cadeia',
      elos: [
        { icone: 'Check', rotulo: '20 aprovações limpas' },
        { icone: 'Sparkles', rotulo: 'O sistema propõe' },
        { icone: 'Hand', rotulo: 'Um humano decide' },
        { icone: 'TrendingUp', rotulo: 'O nível sobe' },
      ],
      ativo: 2,
    },
    notas:
      'Cada aprovação, rejeição e reversão fica gravada. Quando uma tarefa tem um histórico limpo — vinte vezes aprovada ' +
      'sem ninguém mexer —, o sistema propõe subir o nível. Mas quem sobe é sempre uma pessoa. A IA não faz tudo à ' +
      'partida: ganha o direito de fazer, tarefa a tarefa, centro a centro.',
  },
  {
    id: 'I10',
    lobo: 'I',
    icone: 'GitCompare',
    titulo: 'Experiências',
    frase: 'Sem grupo de controlo é opinião.',
    prova: 'Quem recebeu e quem não',
    fonte: 'Plano do Javier',
    estado: 'falta',
    visual: {
      tipo: 'cadeia',
      elos: [
        { icone: 'Users', rotulo: 'Metade recebe' },
        { icone: 'UsersRound', rotulo: 'Metade não' },
        { icone: 'GitCompare', rotulo: 'Mede-se a diferença' },
      ],
    },
    notas:
      'Para dizer «recuperámos 2.000 euros» é preciso saber o que aconteceria sem a ação. Metade recebe, metade não, e ' +
      'mede-se a diferença. Sem isto não há resultado, há uma opinião.',
  },
  {
    id: 'I11',
    lobo: 'I',
    icone: 'Ban',
    titulo: 'Os limites',
    frase: 'Sem LLM próprio. Sem câmaras.',
    prova: 'RGPD · AI Act · Ley 10/2025',
    fonte: 'Plano do Javier',
    estado: 'nota',
    notas:
      'Não treinamos um modelo de linguagem: os modelos melhoram e ficam mais baratos todos os meses, e o que não se compra ' +
      'são os nossos dados. Sem câmaras nem sensores: privacidade e custo. E nenhuma decisão que afete uma pessoa sem um ' +
      'humano: a IA não bloqueia nem cancela ninguém. As regras do contrato, essas, continuam a correr como hoje.',
  },
  {
    id: 'I12',
    lobo: 'I',
    icone: 'PiggyBank',
    titulo: 'Gastar pouco',
    frase: 'O modelo certo para cada tarefa.',
    prova: 'Lote: metade do preço · cache: até 90% menos',
    fonte: 'Preços públicos da Anthropic e da OpenAI',
    estado: 'nota',
    visual: {
      tipo: 'versus',
      a: { valor: '$0,10', legenda: 'modelo leve · por milhão de tokens', tom: 'lima' },
      b: { valor: '$4', legenda: 'modelo forte · por milhão de tokens', tom: 'neutro' },
      nota: 'Rotina no leve, decisões caras no forte',
    },
    notas:
      'O custo de IA controla-se com quatro alavancas que já existem nos fornecedores. O que pode esperar — o agente da ' +
      'noite, classificar motivos de cancelamento — vai em lote, a metade do preço. O que se repete em cada pedido fica em ' +
      'cache e custa uma fração. A rotina corre num modelo pequeno, até quarenta vezes mais barato; o forte fica para ' +
      'vendas e decisões caras. E a chamada ao modelo tem de ser trocável: hoje estamos presos a um fornecedor só.',
  },

  // ── Transversais ────────────────────────────────────────────────────────────
  {
    id: 'T1',
    lobo: 'T',
    icone: 'Map',
    titulo: 'O caminho',
    frase: 'Novembro de 2026 → 2028.',
    prova: 'Superfit a capturar em janeiro',
    fonte: 'Plano do Javier',
    estado: 'nota',
    visual: {
      tipo: 'tempo',
      marcos: [
        { quando: 'Nov – Jan', oQue: 'Capturar' },
        { quando: 'Fev', oQue: 'Modelo feio' },
        { quando: 'Mar – Abr', oQue: 'Lago' },
        { quando: 'Mai', oQue: 'Prova em euros' },
        { quando: 'Jun – Jul', oQue: 'Cérebro operacional' },
        { quando: '2028', oQue: 'Cérebro de mercado' },
      ],
    },
    notas:
      'A ordem do Javier, com uma ideia importante: o modelo feio vem antes do lago. Em fevereiro, um modelo rápido mostra ' +
      'que tabelas estão partidas — e é isso que diz o que limpar. E uma condição: a Superfit tem de abrir já a capturar ' +
      'tudo.',
  },
  {
    id: 'T2',
    lobo: 'T',
    icone: 'UsersRound',
    titulo: 'Com a equipa que temos',
    frase: 'O melhor de cada um.',
    estado: 'nota',
    extra: {
      tipo: 'lista',
      itens: [
        { rotulo: 'Javier', texto: 'O plano do cérebro: dados, lago e preditor' },
        { rotulo: 'Rúben', texto: 'A app viva, dinâmica pelo conteúdo' },
        { rotulo: 'Operação', texto: 'O dia a dia dos centros, ao minuto e ao cêntimo' },
        { rotulo: 'A equipa', texto: 'Construir sobre o que já existe' },
      ],
    },
    notas:
      'Isto não é um projeto de uma pessoa. O plano do cérebro é do Javier. A ideia de uma app viva, que muda pelo ' +
      'conteúdo, é do Rúben. As duas pessoas novas da operação trazem o dia a dia dos centros. E toda a equipa constrói ' +
      'sobre o que já existe — metade desta inteligência já está feita.',
  },
  {
    id: 'T3',
    lobo: 'T',
    icone: 'Building',
    titulo: 'A fundação, em detalhe',
    frase: 'A apresentação da arquitetura.',
    prova: 'Um clique abre a apresentação da arquitetura',
    fonte: 'Também no menu do lado (M)',
    estado: 'existe',
    acao: { tipo: 'apresentacao', ver: 'arquitetura', rotulo: 'Abrir a fundação em detalhe' },
    notas:
      'O lobo da fundação já foi apresentado por inteiro. O botão abre essa apresentação; para voltar, menu do lado (M) e ' +
      '«O Cérebro» — o roteiro continua onde ficou.',
  },
  {
    id: 'T4',
    lobo: 'T',
    icone: 'Mic',
    titulo: 'Olá, BMS',
    frase: 'Pergunta. Aprende. Pede.',
    prova: 'Já responde com dados e abre pedidos',
    fonte: 'Falta: a voz e o «ensina-me»',
    estado: 'parcial',
    extra: {
      tipo: 'lista',
      itens: [
        { rotulo: '«Quantas aulas hoje?»', texto: 'Já responde, pelas ferramentas' },
        { rotulo: '«Ensina-me uma regra»', texto: 'Guia pelo manual, sem saltar ecrãs' },
        { rotulo: '«Quero isto»', texto: 'Já oferece abrir um pedido à BMS' },
        { rotulo: 'Pela voz', texto: 'Falta — hoje só nas chamadas de vendas' },
      ],
    },
    notas:
      'A ideia: falar com o BMS como com a Siri. Boa parte já existe: o assistente responde com dados reais pelas ' +
      'ferramentas, guia pelo manual sem saltar ecrãs, e quando não resolve oferece abrir um pedido à equipa da BMS. A ' +
      'voz já existe nas chamadas de vendas. Falta juntar a voz ao assistente e o «se já existe, mostro como; se não, ' +
      'peço à BMS».',
  },
  {
    id: 'T5',
    lobo: 'T',
    icone: 'ListChecks',
    titulo: 'O que decidimos hoje',
    frase: 'Quatro perguntas para sair daqui com rumo.',
    estado: 'nota',
    extra: {
      tipo: 'lista',
      itens: [
        { rotulo: '1 · Superfit', texto: 'Abre já a capturar tudo?' },
        { rotulo: '2 · Backend', texto: 'Qual é o primeiro módulo da nova estrutura?' },
        { rotulo: '3 · App', texto: 'O Feed passa a ser a caixa de decisões?' },
        { rotulo: '4 · RGPD', texto: 'Quem escreve a avaliação de impacto?' },
      ],
    },
    notas:
      'Para sair daqui com rumo, quatro decisões. A Superfit abre já a capturar tudo — ou perde-se um ano de dados. Qual é ' +
      'a primeira área a nascer na nova estrutura do backend. Se o Feed passa a ser o sítio onde a IA propõe e o centro ' +
      'decide. E quem escreve a avaliação de impacto que o RGPD exige antes de qualquer treino com dados de clientes.',
  },

  // ── Perguntas previstas (bandeja «Perguntas», por baixo do mapa) ──────────
  {
    id: 'Q1',
    lobo: 'Q',
    icone: 'Coins',
    titulo: 'Quanto custa?',
    frase: 'Pouco para começar. A réplica é a conta grande.',
    prova: 'Estimativa do plano do Javier',
    fonte: 'Plano do Javier · infraestrutura e custos',
    estado: 'nota',
    visual: {
      tipo: 'versus',
      a: { valor: '150–260 €', legenda: 'por mês, sem réplica', tom: 'lima' },
      b: { valor: '+ réplica', legenda: 'até ao custo da base atual', tom: 'neutro' },
      nota: 'Arranca-se com uma cópia noturna, quase a custo zero',
    },
    notas:
      'O plano do Javier estima entre 150 e 260 euros por mês sem réplica: servidores de treino e de previsão, ' +
      'armazenamento e o modelo de linguagem. A conta grande é a réplica da base de dados, que pode custar até o mesmo que ' +
      'a base atual — por isso arranca-se com uma cópia noturna, quase a custo zero, e a réplica só entra quando se pagar a ' +
      'si própria (também tira peso às estatísticas de hoje).',
  },
  {
    id: 'Q2',
    lobo: 'Q',
    icone: 'Clock',
    titulo: 'Quem tem tempo para isto?',
    frase: 'Começar é trabalho normal de backend.',
    prova: 'O primeiro modelo cabe em três semanas',
    fonte: 'Plano do Javier · roadmap',
    estado: 'nota',
    visual: { tipo: 'numero', valor: '~8', legenda: 'dias de backend para começar a capturar' },
    notas:
      'O plano foi pensado para a equipa que temos. Começar a capturar são cerca de oito dias de backend, em paralelo com o ' +
      'resto. O Javier não está a tempo inteiro, e por isso o primeiro modelo cabe em três semanas. E as duas pessoas novas ' +
      'da operação são quem alimenta o cérebro com o dia a dia dos centros.',
  },
  {
    id: 'Q3',
    lobo: 'Q',
    icone: 'MessageCircleQuestionMark',
    titulo: 'Porque não usamos só o ChatGPT?',
    frase: 'O modelo aluga-se. Os dados são nossos.',
    prova: 'Já usamos modelos por API',
    fonte: 'Assistente e BMS.Ai',
    estado: 'nota',
    visual: {
      tipo: 'versus',
      a: { valor: 'Aluga-se', legenda: 'o modelo de linguagem — qualquer um', tom: 'neutro' },
      b: { valor: 'É nosso', legenda: 'os dados, as regras e a confiança', tom: 'lima' },
    },
    notas:
      'Já usamos — o assistente e o BMS.Ai chamam um modelo por API. Mas o ChatGPT sozinho não sabe quanto deve um cliente ' +
      'de um centro, não passa pelos nossos muros e não conhece as 490 leis da casa. O modelo é a parte que se aluga e se ' +
      'troca; o que nenhum concorrente consegue copiar são anos de dados de operação, as regras e a confiança construída à ' +
      'volta.',
  },
  {
    id: 'Q4',
    lobo: 'Q',
    icone: 'ShieldCheck',
    titulo: 'E o RGPD? Não é perigoso?',
    frase: 'Sem nomes. Sem decisões sobre pessoas.',
    prova: 'RGPD art. 22 e 35 · AI Act',
    fonte: 'Plano do Javier · legal e privacidade',
    estado: 'nota',
    visual: {
      tipo: 'cadeia',
      elos: [
        { icone: 'Droplets', rotulo: 'Lago sem nomes' },
        { icone: 'Hand', rotulo: 'Um humano decide' },
        { icone: 'Banknote', rotulo: 'IA longe do dinheiro' },
        { icone: 'ListChecks', rotulo: 'Avaliação de impacto' },
      ],
    },
    notas:
      'Quatro travões. O lago não tem nomes, emails nem moradas. Nenhuma decisão que afete uma pessoa — bloquear, cancelar ' +
      '— é tomada pela IA sem um humano. A IA não toca no dinheiro, e isso está no código. E antes do primeiro treino ' +
      'escreve-se a avaliação de impacto que o RGPD exige para este tipo de análise.',
  },
  {
    id: 'Q5',
    lobo: 'Q',
    icone: 'Handshake',
    titulo: 'Isto já funciona em algum lado?',
    frase: 'Sim: nos Fluxos do CRM.',
    prova: 'Pedido da Nokaute, já em uso',
    fonte: 'CRM › Automação › Fluxos',
    estado: 'existe',
    acao: { tipo: 'percurso', id: 'P1', rotulo: 'Ver o percurso dos Fluxos' },
    notas:
      'Sim. Nos Fluxos do CRM o centro diz a regra por palavras, a IA escolhe de listas fechadas, o código valida, nasce ' +
      'um rascunho e um humano liga-o. É o padrão de confiança inteiro, a funcionar hoje — o botão mostra o percurso.',
  },
  {
    id: 'Q7',
    lobo: 'Q',
    icone: 'Cpu',
    titulo: 'Python ou Rust?',
    frase: 'Python por fora. Motores rápidos por dentro.',
    prova: 'A pergunta do Javier',
    fonte: 'Ferramentas do plano do Javier',
    estado: 'nota',
    visual: {
      tipo: 'versus',
      a: { valor: 'Python', legenda: 'onde se escreve a análise', tom: 'lima' },
      b: { valor: 'Rust · C++', legenda: 'os motores que correm por baixo', tom: 'neutro' },
      nota: 'O Polars é escrito em Rust; o DuckDB e o LightGBM em C++',
    },
    notas:
      'Uma boa pergunta do Javier. O lago e o preditor escrevem-se em Python, porque é aí que vivem as ferramentas de dados ' +
      'e de machine learning. Mas essas ferramentas já correm em motores rápidos por dentro: o Polars é escrito em Rust, o ' +
      'DuckDB e o LightGBM em C++. Temos a velocidade do Rust sem escrever Rust — só se escreve se uma medição mostrar que é ' +
      'preciso. E a app e as ferramentas da IA continuam em Node.',
  },
];

/** As ligações entre pontos — as sinapses que acendem ao clicar. */
export const SINAPSES: [string, string][] = [
  ['F1', 'F3'],
  ['F1', 'B1'],
  ['F1', 'F12'],
  ['F12', 'F3'],
  ['F12', 'F13'],
  ['F13', 'F8'],
  ['F13', 'F5'],
  ['F13', 'I6'],
  ['F2', 'F8'],
  ['F2', 'F9'],
  ['F10', 'F2'],
  ['F4', 'F6'],
  ['F4', 'I6'],
  ['F4', 'B8'],
  ['F5', 'I4'],
  ['F6', 'I8'],
  ['F6', 'I9'],
  ['F7', 'I7'],
  ['B1', 'I5'],
  ['B1', 'I7'],
  ['B2', 'B3'],
  ['B2', 'I6'],
  ['B2', 'I7'],
  ['B3', 'I9'],
  ['B3', 'I10'],
  ['B4', 'I1'],
  ['B5', 'I2'],
  ['B6', 'I1'],
  ['B7', 'I1'],
  ['B8', 'I6'],
  ['B9', 'I6'],
  ['I1', 'I2'],
  ['I2', 'I3'],
  ['I3', 'I4'],
  ['I4', 'I5'],
  ['I5', 'I6'],
  ['I5', 'I12'],
  ['I8', 'I9'],
  ['I10', 'I9'],
  ['I11', 'I8'],
  ['T1', 'B3'],
  ['T1', 'I4'],
  ['T2', 'I4'],
  ['T2', 'F13'],
  ['T2', 'T1'],
  ['T3', 'B2'],
  ['T4', 'I5'],
  ['T4', 'I6'],
  ['T4', 'F7'],
  ['T5', 'B3'],
  ['T5', 'B2'],
  ['T5', 'F4'],
  ['T5', 'I3'],
  // perguntas previstas → o ponto do mapa que as responde
  ['Q1', 'I1'],
  ['Q1', 'T1'],
  ['Q2', 'B3'],
  ['Q2', 'T2'],
  ['Q3', 'I11'],
  ['Q3', 'B6'],
  ['Q3', 'I12'],
  ['Q4', 'I3'],
  ['Q4', 'I11'],
  ['Q4', 'B8'],
  ['Q5', 'F7'],
  ['Q5', 'I7'],
  ['Q6', 'F8'],
  ['Q6', 'F10'],
  ['Q7', 'I4'],
  ['Q7', 'I1'],
];

export const ROTULO_DO_ESTADO: Record<Estado, string> = {
  existe: 'Já temos',
  parcial: 'Em parte',
  curso: 'Em curso',
  falta: 'Falta',
  problema: 'Problema',
  nota: 'Nota',
};

export const PONTO_POR_ID = new Map(PONTOS.map((p) => [p.id, p]));
export const LOBO_POR_ID = new Map(LOBOS.map((l) => [l.id, l]));

/** Título e notas de qualquer coisa para onde um passo aponte: centro, lobo ou ponto. */
export function descreverAlvo(no: string): { codigo: string; titulo: string; frase: string; notas: string } {
  if (no === 'centro') return { codigo: '◎', titulo: CENTRO.titulo, frase: CENTRO.frase, notas: CENTRO.notas };
  if (no.startsWith('lobo-')) {
    const l = LOBO_POR_ID.get(no.replace('lobo-', '') as LoboId)!;
    return { codigo: `Lobo ${l.numero}`, titulo: l.titulo, frase: l.frase, notas: l.notas };
  }
  const p = PONTO_POR_ID.get(no)!;
  return { codigo: p.id, titulo: p.titulo, frase: p.frase, notas: p.notas };
}

/**
 * O ROTEIRO: a história da apresentação, do princípio ao fim. Carrega-se em → e o mapa leva-te
 * de ponto em ponto; podes sair do caminho para responder a uma pergunta e voltar com R.
 */
const ORDEM_DO_ROTEIRO = [
  'centro',
  'lobo-E',
  'F1',
  'F12',
  'F13',
  'F10',
  'F4',
  'lobo-B',
  'B1',
  'B5',
  'B2',
  'B3',
  'B8',
  'lobo-I',
  'I1',
  'I4',
  'I5',
  'I6',
  'I7',
  'I8',
  'I9',
  'T1',
  'T2',
  'T3',
  'T4',
  'T5',
];

/** As perguntas previstas, pela ordem da bandeja. */
export const PERGUNTAS = PONTOS.filter((p) => p.lobo === 'Q').sort((a, b) => a.id.localeCompare(b.id));

const ROTEIRO: Percurso = {
  id: 'R',
  rotulo: 'Roteiro',
  titulo: 'O roteiro',
  frase: 'A história, do princípio ao fim.',
  modo: 'roteiro',
  passos: ORDEM_DO_ROTEIRO.map((no): Passo => {
    const alvo = descreverAlvo(no);
    return { no, frase: alvo.frase, notas: alvo.notas };
  }),
};

export const PERCURSOS: Percurso[] = [
  ROTEIRO,
  {
    id: 'P1',
    rotulo: 'Fluxos',
    titulo: 'Os Fluxos do CRM',
    frase: 'O que já funciona hoje.',
    modo: 'caminho',
    passos: [
      {
        no: 'F7',
        frase: 'O centro diz a regra por palavras.',
        notas:
          'Pedido real da Nokaute: aos 15 dias sem vir, contacto pela receção; aos 30, pelo professor do cliente — ou, ' +
          'sem professor, à vez entre três nomes.',
      },
      { no: 'I5', frase: 'O LLM escolhe só de listas fechadas.', notas: 'Quando e a quem. Não escreve o fluxo.' },
      {
        no: 'I7',
        frase: 'O código monta o fluxo e valida-o.',
        notas: 'Com o mesmo validador que um humano usa no editor. O que não sabe fazer, recusa — e diz porquê.',
      },
      { no: 'B9', frase: 'Os nomes confirmam-se na equipa do centro.', notas: 'Um nome ambíguo não se adivinha: pergunta-se.' },
      { no: 'F6', frase: 'Nasce rascunho.', notas: 'O centro vê o que vai acontecer antes de acontecer.' },
      {
        no: 'I8',
        frase: 'Ligar é humano. Depois, corre sozinho.',
        notas: 'A partir daí cria tarefas todas as manhãs. É o padrão de confiança inteiro, a funcionar hoje.',
      },
    ],
  },
  {
    id: 'P2',
    rotulo: 'Inscrição',
    titulo: 'Inscrição → cobrança → acesso',
    frase: 'Regras. A IA só nas exceções.',
    modo: 'caminho',
    passos: [
      { no: 'F8', frase: 'Inscreve-se: app, balcão ou quiosque.', notas: 'Três portas de entrada, a mesma inscrição.' },
      { no: 'B6', frase: 'O contrato assina-se na hora.', notas: 'A assinatura eletrónica já existe na BMS.' },
      { no: 'B1', frase: 'A porta decide pela régua.', notas: 'O juiz de acesso: uma regra, um sítio.' },
      {
        no: 'B5',
        frase: 'Cobra no dia certo. Pára às três.',
        notas: 'Uma das leis da casa. Nenhuma IA aqui: é regra, e regra é bom.',
      },
      {
        no: 'I4',
        frase: 'A exceção: quem costuma pagar até dia 10?',
        notas: 'Doze débitos falharam; nove destas pessoas costumam pagar até dia 10. O preditor diz quem.',
      },
      { no: 'F4', frase: 'A proposta chega ao Feed.', notas: 'Lembrete a nove, chamada a três — Aprovar ou Rejeitar.' },
      { no: 'I9', frase: 'O humano decide. Fica gravado.', notas: 'E com o histórico, um dia propõe-se fazer isto sozinho.' },
    ],
  },
  {
    id: 'P3',
    rotulo: 'Toalhas',
    titulo: 'As toalhas',
    frase: 'Um processo novo — e o que falta.',
    modo: 'caminho',
    passos: [
      {
        no: 'B6',
        frase: 'O stock de toalhas sujas passa o limiar.',
        notas: 'O stock já existe no BMS. O fornecedor não: falta essa tabela.',
      },
      {
        no: 'I7',
        frase: 'Um gatilho novo no motor.',
        notas: 'O motor só faz o que sabe fazer — o gatilho «stock abaixo do limiar» tem de existir primeiro.',
      },
      { no: 'I5', frase: 'A IA escreve o pedido de orçamento.', notas: 'Envia pelo canal do centro e fica à espera.' },
      { no: 'I6', frase: 'Lê a resposta do fornecedor.', notas: '«38 euros, recolha amanhã.»' },
      { no: 'F4', frase: '«Aceitar 38 €?» no Feed.', notas: 'Dentro do limite do centro, ou acima — destacado.' },
      { no: 'B8', frase: 'Pagar: a IA prepara, o centro carrega.', notas: 'No ecrã de pagamentos que já existe.' },
      {
        no: 'B3',
        frase: 'Recolha e entrega ficam registadas.',
        notas: 'Com minutos e euros. É o custo real de operar um centro — o dado que mais ninguém tem.',
      },
    ],
  },
  {
    id: 'P4',
    rotulo: 'Suporte',
    titulo: 'O pedido que não precisava de existir',
    frase: 'Um pedido real ao suporte.',
    modo: 'caminho',
    passos: [
      { no: 'F1', frase: '«Porque pago 32,10 € e não 42,80 €?»', notas: 'Um pedido real ao suporte desta semana.' },
      { no: 'I6', frase: 'A IA lê a Timeline da cliente.', notas: 'Por uma ferramenta, com os muros de sempre.' },
      { no: 'B4', frase: 'Desconto de 25%: quando e quem.', notas: 'Está tudo no rasto.' },
      { no: 'I5', frase: 'Responde com os números da ferramenta.', notas: 'E mostra onde se vê.' },
      {
        no: 'I9',
        frase: 'Se a pergunta se repete, vai para o manual.',
        notas: 'Menos pedidos ao suporte, mais tempo para construir.',
      },
    ],
  },
];

/**
 * Posição de cada ponto: em grelha de 3 colunas dentro do seu lobo. Os transversais descem por
 * baixo do centro, entre os dois lobos de baixo — o «tronco» do cérebro.
 */
export function posicaoDoPonto(ponto: Ponto): { x: number; y: number } {
  if (ponto.lobo === 'Q') return { x: 0, y: 0 }; // as perguntas não estão no mapa
  if (ponto.lobo === 'T') {
    const transversais = PONTOS.filter((p) => p.lobo === 'T');
    const i = transversais.indexOf(ponto);
    return { x: -125, y: 320 + i * 150 };
  }
  const lobo = LOBO_POR_ID.get(ponto.lobo as LoboId)!;
  const doLobo = PONTOS.filter((p) => p.lobo === ponto.lobo);
  const i = doLobo.indexOf(ponto);
  const col = i % 3;
  const linha = Math.floor(i / 3);
  return { x: lobo.x + 150 + col * 330, y: lobo.y + 190 + linha * 170 };
}
