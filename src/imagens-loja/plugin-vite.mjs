// Só no `pnpm dev`: o botão de download de cada imagem pede /__loja/png?imagem=…&preset=… e o servidor
// devolve o PNG fotografado pelo Chrome, no tamanho exato e sem transparência (o mesmo do exportar.mjs).

import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { encontrarChrome, lerPng, fotografar } from './chrome.mjs';

export function imagensDaLoja() {
  return {
    name: 'bms-imagens-loja',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__loja/png', async (req, res) => {
        const pedido = new URL(req.url ?? '', 'http://x');
        const imagem = pedido.searchParams.get('imagem') ?? '';
        const largura = Number(pedido.searchParams.get('largura'));
        const altura = Number(pedido.searchParams.get('altura'));
        const preset = pedido.searchParams.get('preset') ?? '';
        const nome = (pedido.searchParams.get('nome') ?? `${imagem}-${preset}`).replace(/[^\w.-]/g, '');
        const falhar = (codigo, msg) => {
          res.statusCode = codigo;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(msg);
        };
        if (!/^[\w-]+$/.test(imagem) || !/^[\w-]+$/.test(preset) || !(largura > 0 && altura > 0 && largura <= 4000 && altura <= 4000)) {
          return falhar(400, 'Pedido inválido.');
        }
        const chrome = encontrarChrome();
        if (!chrome) return falhar(500, 'Não encontrei o Google Chrome neste computador.');

        const pasta = mkdtempSync(join(tmpdir(), 'bms-loja-png-'));
        const ficheiro = join(pasta, 'imagem.png');
        try {
          const origem = `http://${req.headers.host}`;
          const ok = await fotografar(chrome, `${origem}/?ver=loja&imagem=${imagem}&preset=${preset}`, largura, altura, ficheiro);
          if (!ok) return falhar(500, 'O Chrome não conseguiu gravar a imagem.');
          const png = lerPng(ficheiro);
          if (png.largura !== largura || png.altura !== altura || png.alfa) {
            return falhar(500, `A imagem saiu com ${png.largura}×${png.altura}${png.alfa ? ' e alfa' : ''}.`);
          }
          res.setHeader('Content-Type', 'image/png');
          res.setHeader('Content-Disposition', `attachment; filename="${nome}.png"`);
          res.end(readFileSync(ficheiro));
        } finally {
          rmSync(pasta, { recursive: true, force: true });
        }
      });
    },
  };
}
