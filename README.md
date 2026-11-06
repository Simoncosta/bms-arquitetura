# Apresentações da BMS: a arquitetura e o cérebro

Duas apresentações num só projeto (React + Vite + Motion + React Flow), pensadas para uma TV:
pouco texto no ecrã, animação a mostrar o que se diz, e as notas na janela do apresentador.

1. **Evoluir sobre o que já construímos** — a arquitetura (o monólito modular), em slides, a laranja.
2. **O Cérebro BMS** — um mapa para explorar: três lobos (Experiência, Fundação, Inteligência),
   os pontos que os ligam e um roteiro do princípio ao fim, com a paleta Lima do design system.

## Arrancar

```bash
cd ~/Desktop/"PROJECTS BMS"/apresentacao-arquitetura
pnpm install
pnpm dev
```

Abre o endereço que aparecer (normalmente http://localhost:5173) e escolhe a apresentação (teclas
**1** e **2**). Dentro de cada uma, encosta o rato à margem esquerda ou carrega em **M** para o menu
que troca de apresentação. **F** para ecrã inteiro, **P** para a janela do apresentador no portátil.

| Endereço | Abre |
|---|---|
| `/` | O ecrã de entrada, para escolher |
| `?ver=arquitetura` | Os slides da arquitetura (os endereços antigos `#5` e `?s=5` também) |
| `?ver=cerebro` | O mapa do cérebro |

## 1. Arquitetura — teclas

| Tecla | Faz |
|---|---|
| → · Espaço · Enter | Próximo passo (cada slide revela-se aos poucos) |
| ← | Passo anterior |
| P | Abre a janela do apresentador: notas, cronómetro e o que vem a seguir, sincronizada |
| B | Ecrã preto, para a atenção ficar em quem fala (B ou clique para voltar) |
| L | Ponteiro laser laranja |
| N | Notas por cima do slide (se não usar a janela do apresentador) |
| F | Ecrã inteiro |
| Home · End | Primeiro · último slide |
| M | Menu das apresentações |

Nos slides 2 e 8 (mapas interativos) dá para arrastar, fazer zoom e mover as peças. No 2 o botão
alterna entre dia normal e hora de ponta; no 8, entre hoje e o novo modelo. No 14 (réplica) os
botões mostram sem e com réplica.

- `?s=8` abre no slide 8; `?s=8&p=3` abre no 3.º passo do slide 8.
- `?estatico=1` mostra os slides sem animações, já no estado final (para rever ou imprimir).

### A metáfora do ginásio

- **Receção** — infraestrutura comum (`src/shared`): autenticação, base de dados, filas.
- **Sala** — uma área de negócio (`src/modules/<sala>`): clientes, faturação, cobranças, acessos.
- **Balcão** — a entrada externa de uma sala: Route + Controller, para pedidos da app.
- **Porta interna** — a entrada interna (`index.ts`): outra sala, um job ou o código antigo.
- **Porta de serviço** — o único caminho para o motor antigo (`engine.port.ts`).
- **Escritório antigo** — o motor de pagamentos de hoje, que não é reescrito.

## 2. O Cérebro — como apresentar

**O roteiro conta a história por ti.** Carrega em **→** (ou num comando de apresentação): o mapa
leva-te de ponto em ponto — o centro, depois cada lobo e os seus pontos — e abre o painel com a
imagem de cada um. São 26 passos e acabam em «O que decidimos hoje»; a régua em baixo à esquerda
mostra onde estás. No T3 («A fundação, em detalhe») um botão abre a apresentação da arquitetura;
ao voltar pelo menu (M → O Cérebro), o **→** continua no mesmo passo.

Se alguém fizer uma pergunta, clica no ponto de que precisas: sais do roteiro sem o perder.
**R** volta ao ponto onde estavas, e **→** continua.

**As perguntas previstas** («eu sabia que iam perguntar isto») vivem na bandeja **Perguntas** (tecla
**Q**), por baixo: quanto custa, quem tem tempo, porque não só o ChatGPT, o RGPD, se já funciona em
algum lado, Flutter ou React, Python ou Rust. Clicar numa abre a resposta e acende no mapa os pontos
que a sustentam.

Os **percursos P1–P4** são para quando perguntarem «mas como é que isso funciona na prática?»:
acendem um processo concreto nó a nó pelos três lobos (os Fluxos do CRM, a inscrição, as toalhas,
um pedido de suporte).

| Gesto · tecla | Faz |
|---|---|
| → · Espaço · Enter | Roteiro: passo seguinte (na visão geral, arranca o roteiro) |
| ← | Passo anterior |
| R | Volta ao roteiro, no ponto onde estavas |
| Q | Abre/fecha a bandeja das perguntas previstas |
| Esc | Fecha o painel, ou sai do roteiro/percurso |
| Arrastar · scroll · pinça | Mover e fazer zoom no mapa, como no Figma |
| Clicar num lobo · 1 · 2 · 3 | Abre o lobo Experiência · Fundação · Inteligência |
| Clicar num ponto | Acende as sinapses e abre o painel |
| 0 · Home · clicar no centro | Visão geral (fecha tudo) |
| E | «O que já temos»: abre tudo e pinta cada ponto pelo estado |
| P · N · B · L · F | Apresentador · notas · ecrã preto · laser · ecrã inteiro |
| M | Menu das apresentações |

### Mudar o conteúdo do cérebro

Tudo o que aparece vive em [`src/cerebro/conteudo.ts`](src/cerebro/conteudo.ts):

- `LOBOS` — os três lobos (ícone, título, frase, notas, posição);
- `PONTOS` — cada ponto: `icone` (nome do lucide), `frase` (o que se vê), `visual` (a imagem do
  painel: número, versus, cadeia, escada, medidor, linha do tempo, telemóvel ou cartão), `prova` +
  `fonte` (o número e de onde vem), `estado` e `notas` (o que se diz);
- `SINAPSES` — as ligações entre pontos;
- as perguntas previstas — os pontos com `lobo: 'Q'` (não aparecem no mapa, só na bandeja); um
  ponto pode ter `acao` (um botão no painel: arrancar um percurso ou abrir a outra apresentação);
- `ORDEM_DO_ROTEIRO` — a ordem da história;
- `PERCURSOS` — os caminhos P1–P4, passo a passo.

Um ponto novo entra na grelha do seu lobo sozinho (3 colunas). Números: só os medidos, com a
fonte ao lado.

## Onde está cada coisa

- `src/main.tsx` — escolhe a apresentação pelo endereço
- `src/Inicio.tsx` · `src/MenuLateral.tsx` — o ecrã de entrada e o menu do lado
- `src/slides/acto1.tsx` — contexto: capa, como as peças conversam hoje, a hora de ponta com os registos
- `src/slides/acto2.tsx` — proposta: três caminhos, o ginásio, a viagem de um pedido, a pasta src/, hora de ponta hoje vs novo modelo, migrar clientes, isolamento, SOLID, padrões na prática
- `src/slides/acto3.tsx` — execução e fecho: três motores, réplica, seis pontos críticos, quem faz o quê (frentes e branches), foco, muros, um sócio novo, prós e contras, fecho
- Cada slide tem `notas` (o que dizer), `steps` (quantos passos revela) e `titulo` (aparece na janela do apresentador).
- `src/cerebro/` — o mapa do cérebro: `Mapa.tsx` (o mapa, o roteiro e as teclas), `nos.tsx` (as peças), `Painel.tsx` e `visuais.tsx` (o painel e as imagens), `conteudo.ts` (o texto), `cerebro.css` (a paleta Lima, só dentro de `.cerebro`)
