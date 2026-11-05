# Apresentação: evoluir a BMS sobre o que já construímos

Apresentação animada (React + Vite + Motion + React Flow) da proposta de arquitetura. Pensada para o dono e para os diretores técnicos ao mesmo tempo: pouco texto no ecrã, animação a mostrar o que se diz, e as notas na janela do apresentador.

## Arrancar

```bash
cd ~/Desktop/BMS/apresentacao-arquitetura
pnpm install
pnpm dev
```

Abre o endereço que aparecer (normalmente http://localhost:5173), carrega em **F** para ecrã inteiro e em **P** para abrir a janela do apresentador no portátil.

## Teclas

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

Nos slides 2 e 8 (mapas interativos) dá para arrastar, fazer zoom e mover as peças. No 2 o botão alterna entre dia normal e hora de ponta; no 8, entre hoje e o novo modelo. No 14 (réplica) os botões mostram sem e com réplica.

## A metáfora do ginásio

- **Receção** — infraestrutura comum (`src/shared`): autenticação, base de dados, filas.
- **Sala** — uma área de negócio (`src/modules/<sala>`): clientes, faturação, cobranças, acessos.
- **Balcão** — a entrada externa de uma sala: Route + Controller, para pedidos da app.
- **Porta interna** — a entrada interna (`index.ts`): outra sala, um job ou o código antigo.
- **Porta de serviço** — o único caminho para o motor antigo (`engine.port.ts`).
- **Escritório antigo** — o motor de pagamentos de hoje, que não é reescrito.

## Endereços úteis

- `?s=8` abre no slide 8; `?s=8&p=3` abre no 3.º passo do slide 8.
- `?estatico=1` mostra os slides sem animações, já no estado final (para rever ou imprimir).

## Onde está cada coisa

- `src/slides/acto1.tsx` — contexto: capa, como as peças conversam hoje, a hora de ponta com os registos
- `src/slides/acto2.tsx` — proposta: três caminhos, o ginásio, a viagem de um pedido, a pasta src/, hora de ponta hoje vs novo modelo, migrar clientes, isolamento, SOLID, padrões na prática
- `src/slides/acto3.tsx` — execução e fecho: três motores, réplica, seis pontos críticos, quem faz o quê (frentes e branches), foco, muros, um sócio novo, prós e contras, fecho
- Cada slide tem `notas` (o que dizer), `steps` (quantos passos revela) e `titulo` (aparece na janela do apresentador).
