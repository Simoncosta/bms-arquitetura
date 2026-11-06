// As imagens do painel: mostrar em vez de escrever. Cada ponto escolhe uma (conteudo.ts → visual).

import { Fragment } from 'react';
import { motion } from 'motion/react';
import type { Visual } from './tipos.ts';
import { Icone } from './icones.tsx';

/** Um valor curto («19») vai enorme; um comprido («150–260 €», «Aluga-se») encolhe para caber. */
function tamanhoDoValor(valor: string) {
  if (valor.length <= 4) return '';
  if (valor.length <= 7) return 'medio';
  return 'longo';
}

const entrar = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.08 * i, duration: 0.35 },
});

export function VisualDoPonto({ visual }: { visual: Visual }) {
  switch (visual.tipo) {
    case 'numero':
      return (
        <div className="v-numero">
          <motion.strong className={`tom-${visual.tom ?? 'lima'}`} {...entrar(0)}>
            {visual.valor}
          </motion.strong>
          <span>{visual.legenda}</span>
        </div>
      );

    case 'versus':
      return (
        <div className="v-versus">
          <div className="v-versus-lados">
            {[visual.a, visual.b].map((lado, i) => (
              <Fragment key={i}>
                {i === 1 && <span className="v-versus-vs">vs</span>}
                <motion.div className="v-versus-lado" {...entrar(i)}>
                  <strong className={`tom-${lado.tom ?? 'lima'} ${tamanhoDoValor(lado.valor)}`}>{lado.valor}</strong>
                  <span>{lado.legenda}</span>
                </motion.div>
              </Fragment>
            ))}
          </div>
          {visual.nota && <p className="v-nota">{visual.nota}</p>}
        </div>
      );

    case 'cadeia':
      return (
        <div className="v-cadeia">
          {visual.elos.map((elo, i) => (
            <Fragment key={elo.rotulo}>
              {i > 0 && <Icone nome="ArrowRight" tamanho={18} className="v-cadeia-seta" />}
              <motion.div className={`v-elo ${visual.ativo === i ? 'ativo' : ''}`} {...entrar(i)}>
                <span className="v-elo-bola">
                  <Icone nome={elo.icone} tamanho={24} />
                </span>
                <span className="v-elo-rotulo">{elo.rotulo}</span>
              </motion.div>
            </Fragment>
          ))}
        </div>
      );

    case 'escada':
      return (
        <div className="v-escada">
          {visual.degraus.map((d, i) => (
            <motion.div
              key={d.rotulo}
              className={`v-degrau ${i === visual.degraus.length - 1 ? 'nunca' : ''}`}
              style={{ width: `${62 + i * 12.5}%` }}
              {...entrar(i)}
            >
              <strong>{d.rotulo}</strong>
              <span>{d.texto}</span>
            </motion.div>
          ))}
        </div>
      );

    case 'medidor': {
      const r = 90;
      const comprimento = Math.PI * r;
      return (
        <div className="v-medidor">
          <svg viewBox="0 0 220 130" width="100%">
            <path d={`M 20 115 A ${r} ${r} 0 0 1 200 115`} className="v-medidor-fundo" />
            <motion.path
              d={`M 20 115 A ${r} ${r} 0 0 1 200 115`}
              className="v-medidor-arco"
              strokeDasharray={comprimento}
              initial={{ strokeDashoffset: comprimento }}
              animate={{ strokeDashoffset: comprimento * (1 - visual.percentagem / 100) }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <strong>{visual.percentagem}%</strong>
          <span>{visual.legenda}</span>
        </div>
      );
    }

    case 'tempo':
      return (
        <ol className="v-tempo">
          {visual.marcos.map((m, i) => (
            <motion.li key={m.quando} {...entrar(i)}>
              <span className="v-tempo-quando">{m.quando}</span>
              <span className="v-tempo-o-que">{m.oQue}</span>
            </motion.li>
          ))}
        </ol>
      );

    case 'telemovel':
      return <Telemovel variante={visual.variante} />;

    case 'cartao':
      return (
        <motion.div className="v-cartao" {...entrar(0)}>
          <div className="v-cartao-topo">
            <Icone nome="Sparkles" tamanho={18} />
            <strong>{visual.titulo}</strong>
          </div>
          <dl>
            <dt>Porquê</dt>
            <dd>{visual.porque}</dd>
            <dt>Efeito</dt>
            <dd>{visual.efeito}</dd>
            <dt>Desfazer</dt>
            <dd>{visual.desfazer}</dd>
          </dl>
          <div className="v-cartao-botoes">
            <span className="v-botao secundario">Rejeitar</span>
            <span className="v-botao primario">Aprovar</span>
          </div>
        </motion.div>
      );
  }
}

const BARRA = [
  { icone: 'House', rotulo: 'Início' },
  { icone: 'CalendarDays', rotulo: 'Agenda' },
  { icone: 'Users', rotulo: 'Clientes' },
  { icone: 'MessageCircle', rotulo: 'Conversas' },
  { icone: 'Ellipsis', rotulo: 'Mais' },
];

/** Um telemóvel: «fixo» mostra a barra de baixo trancada; «vivo» mostra o Início a mudar. */
function Telemovel({ variante }: { variante: 'fixo' | 'vivo' }) {
  const vivo = variante === 'vivo';
  return (
    <div className={`v-telemovel ${variante}`}>
      <div className="v-ecra">
        <div className="v-ecra-topo">
          <span className="v-ecra-titulo">Bom dia, Ana</span>
        </div>
        {vivo ? (
          <>
            <motion.div className="v-hoje" {...entrar(0)}>
              <span>Hoje no teu centro</span>
              <strong>3 clientes em risco · 2 aulas cheias</strong>
            </motion.div>
            <motion.div className="v-atalhos" {...entrar(1)}>
              {['Live', 'Feed', 'Clientes', 'CRM'].map((a) => (
                <span key={a} className="v-atalho">
                  <i />
                  {a}
                </span>
              ))}
            </motion.div>
            <motion.div className="v-contadores" {...entrar(2)}>
              <span>
                <b>12</b> aulas
              </span>
              <span>
                <b>4</b> tarefas
              </span>
            </motion.div>
          </>
        ) : (
          <>
            <div className="v-bloco" />
            <div className="v-bloco curto" />
            <div className="v-bloco" />
          </>
        )}
        <div className={`v-barra ${vivo ? '' : 'destaque'}`}>
          {BARRA.map((b) => (
            <span key={b.rotulo}>
              <Icone nome={b.icone} tamanho={16} />
              {b.rotulo}
            </span>
          ))}
        </div>
      </div>
      <span className="v-telemovel-legenda">
        <Icone nome={vivo ? 'Activity' : 'Lock'} tamanho={16} />
        {vivo ? 'O Início muda todos os dias' : 'A barra é igual para todos'}
      </span>
    </div>
  );
}
