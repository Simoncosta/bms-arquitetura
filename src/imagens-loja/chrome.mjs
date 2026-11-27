// O Chrome sem janela fotografa uma imagem da loja no tamanho exato. Serve ao script (exportar.mjs) e ao
// botão de download da página (plugin-vite.mjs). Grava PNG sem canal alfa, como as lojas exigem.

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export function encontrarChrome() {
  const candidatos = [
    process.env.CHROME,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  return candidatos.find((c) => c && existsSync(c));
}

/** Largura, altura e se tem canal alfa, lidos do cabeçalho IHDR do PNG. */
export function lerPng(caminho) {
  const b = readFileSync(caminho);
  const tipoDeCor = b[25]; // 2 = RGB, 6 = RGBA, 4 = cinzento+alfa
  return { largura: b.readUInt32BE(16), altura: b.readUInt32BE(20), alfa: tipoDeCor === 4 || tipoDeCor === 6 };
}

/**
 * Fotografa `url` para `ficheiro` com a janela do tamanho pedido. Assíncrono de propósito: quando corre
 * dentro do servidor do Vite, o Chrome precisa que o servidor continue a responder enquanto espera.
 * Cada fotografia usa um perfil temporário próprio, para várias poderem correr ao mesmo tempo.
 */
export function fotografar(chrome, url, largura, altura, ficheiro) {
  const perfil = mkdtempSync(join(tmpdir(), 'bms-loja-'));
  return new Promise((resolve) => {
    const processo = spawn(
      chrome,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        `--user-data-dir=${perfil}`,
        `--window-size=${largura},${altura}`,
        '--virtual-time-budget=8000',
        `--screenshot=${ficheiro}`,
        url,
      ],
      { stdio: 'ignore' },
    );
    processo.on('close', () => {
      rmSync(perfil, { recursive: true, force: true });
      resolve(existsSync(ficheiro));
    });
    processo.on('error', () => resolve(false));
  });
}
