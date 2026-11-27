// Exporta as imagens da loja em PNG, no tamanho exato de cada preset, para todas as imagens de uma vez.
//
//   pnpm loja:exportar                 → todos os formatos
//   pnpm loja:exportar android         → só um (ids em marca.ts)
//   pnpm loja:exportar --url=http://localhost:5174   → se o projeto correr noutra porta
//
// Precisa do projeto a correr (pnpm dev) e do Google Chrome instalado. Usa o Chrome em modo sem janela para
// fotografar a página ?ver=loja&imagem=…&preset=…: o mesmo desenho e a mesma letra do ecrã, sem instalar nada.
// O Chrome grava PNG sem canal alfa, como a Apple e a Google exigem; no fim confirma-se cada ficheiro.

import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { IMAGENS } from './conteudo.ts';
import { PRESETS } from './marca.ts';
import { encontrarChrome, fotografar, lerPng } from './chrome.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const SAIDA = join(AQUI, 'exportadas');

const args = process.argv.slice(2);
const base = (args.find((a) => a.startsWith('--url='))?.slice(6) ?? 'http://localhost:5173').replace(/\/$/, '');
const pedidos = args.filter((a) => !a.startsWith('--'));
const presets = pedidos.length ? PRESETS.filter((p) => pedidos.includes(p.id)) : PRESETS;
if (!presets.length) sair(`Formato desconhecido: ${pedidos.join(', ')}. Existem: ${PRESETS.map((p) => p.id).join(', ')}.`);

function sair(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

const chrome = encontrarChrome();
if (!chrome) sair('Não encontrei o Google Chrome. Instala-o ou indica o caminho em CHROME=/caminho/para/o/chrome.');

try {
  const r = await fetch(`${base}/?ver=loja`);
  if (!r.ok) throw new Error(String(r.status));
} catch {
  sair(`O projeto não está a responder em ${base}. Corre primeiro «pnpm dev» noutro terminal.`);
}

const problemas = [];
console.log(`\nA exportar ${IMAGENS.length} imagens × ${presets.length} formatos a partir de ${base}\n`);

for (const preset of presets) {
  const pasta = join(SAIDA, preset.id);
  // A pasta de cada formato é só deste script: limpa-se para não ficarem imagens que já saíram da série.
  if (existsSync(pasta)) for (const f of readdirSync(pasta)) if (f.endsWith('.png')) rmSync(join(pasta, f));
  mkdirSync(pasta, { recursive: true });

  console.log(`${preset.nome} · ${preset.loja} · ${preset.largura}×${preset.altura}`);
  for (const [i, entrada] of IMAGENS.entries()) {
    const ficheiro = join(pasta, `${String(i + 1).padStart(2, '0')}-${entrada.id}.png`);
    const url = `${base}/?ver=loja&imagem=${encodeURIComponent(entrada.id)}&preset=${preset.id}`;
    await fotografar(chrome, url, preset.largura, preset.altura, ficheiro);
    if (!existsSync(ficheiro)) {
      problemas.push(`${relative(AQUI, ficheiro)}: o Chrome não gravou o ficheiro`);
      console.log(`  ✖ ${entrada.id}`);
      continue;
    }
    const png = lerPng(ficheiro);
    const certo = png.largura === preset.largura && png.altura === preset.altura && !png.alfa;
    if (!certo) problemas.push(`${relative(AQUI, ficheiro)}: ${png.largura}×${png.altura}${png.alfa ? ', com alfa' : ''}`);
    console.log(`  ${certo ? '✓' : '✖'} ${relative(AQUI, ficheiro)}  ${png.largura}×${png.altura}${png.alfa ? ' (com alfa!)' : ''}`);
  }
  console.log('');
}

if (problemas.length) sair(`Há ficheiros por corrigir:\n  ${problemas.join('\n  ')}`);
console.log(`✓ Pronto. Os PNG estão em ${relative(process.cwd(), SAIDA)}/\n`);
