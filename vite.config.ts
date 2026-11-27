import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Só no pnpm dev: o botão de download das imagens da loja (src/imagens-loja).
import { imagensDaLoja } from './src/imagens-loja/plugin-vite.mjs';

export default defineConfig({
  plugins: [react(), imagensDaLoja()],
  server: { port: 5173 },
});
