# Imagens da loja (App Store e Google Play)

Gerador das capturas que os **clientes dos centros** veem na ficha da app BMS. Fica à parte das apresentações; só partilha o ecrã de entrada (opção 4) e o menu.

## Correr

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:5173/?ver=loja` (ou carrega no 4 no ecrã de entrada). Vês a série completa lado a lado, como aparece na loja. Em cima escolhes o formato (iPhone 6,9″, iPhone 6,3″, Android) e o tamanho da pré-visualização.

## Mudar os textos

Tudo está em **`conteudo.ts`**, uma entrada por imagem e pela ordem da loja:

- `frase`: a frase principal. Uma palavra entre `*asteriscos*` fica em destaque.
- `subtitulo`: uma linha com o benefício.
- `captura` (e `captura2` na composição `dois`): o nome do ficheiro em `capturas/`.
- `fundo`: `escuro`, `claro` ou `lima`.
- `composicao`: `abertura` (com o logótipo), `centrado`, `inclinado` ou `dois`.
- `estado`: muda para `validado` quando a frase for aprovada.

Regras:

- Português de Portugal, tratando o cliente por tu.
- Nunca «ginásio» nem «sócio»: é **centro** e **cliente**.
- Só funcionalidades que a app já tem.
- A App Store aceita até 10 imagens e a Google Play até 8.

## Pôr as capturas

Larga os ecrãs da app nova em **`capturas/`** (PNG, JPG ou WebP), com o nome que está no `conteudo.ts`. A página atualiza sozinha. Enquanto um ficheiro faltar, o telemóvel mostra um ecrã de espera com o nome em falta.

- Tira-as no telemóvel, ao alto, com a barra de estado.
- Usa um centro de demonstração, nunca dados de clientes reais.
- O ecrã ajusta-se pela largura e corta em baixo se for mais comprido.

## Exportar os PNG

**Uma a uma:** passa o rato por cima de uma imagem e carrega no ícone de download, no canto superior direito. Recebes o PNG do formato escolhido, no tamanho exato e sem transparência. Leva uns segundos e o ícone pisca enquanto é gerado. O botão só existe com o `pnpm dev`, porque é o servidor que gera o PNG.

**Todas de uma vez:** com o `pnpm dev` a correr, abre outro terminal:

```bash
pnpm loja:exportar
```

Para exportar só um formato:

```bash
pnpm loja:exportar android
```

Se o projeto estiver noutra porta:

```bash
pnpm loja:exportar --url=http://localhost:5174
```

Os ficheiros saem em `exportadas/<formato>/01-abertura.png`, … com o tamanho exato e sem transparência. No fim, o script confirma cada um. Esta pasta não vai para o git.

O script precisa do **Google Chrome** instalado. Usa-o sem janela para fotografar cada imagem no tamanho real, com a mesma letra do ecrã, sem instalar mais nada. Noutro sítio, indica o caminho com `CHROME=/caminho/do/chrome`.

## Formatos (confirmados a 27/11/2026)

| Formato | Loja | Píxeis | Nota |
| --- | --- | --- | --- |
| iPhone 6,9″ | App Store | 1320×2868 | A resolução mais alta: a Apple reduz para os outros iPhones |
| iPhone 6,3″ | App Store | 1206×2622 | O único tamanho de iPhone obrigatório |
| Android 9:16 | Google Play | 1080×1920 | O mínimo para a Google poder promover a app (pelo menos 4 imagens) |

Fontes:

- [Apple, Screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)
- [Google Play, Add preview assets](https://support.google.com/googleplay/android-developer/answer/9866151)

## Onde está cada coisa

| Ficheiro | O que tem |
| --- | --- |
| `conteudo.ts` | Os textos e as escolhas de cada imagem |
| `marca.ts` | As cores (as do site novo) e os formatos |
| `Imagem.tsx` + `loja.css` | O desenho: fundos, texto, moldura do telemóvel e composições |
| `ImagensLoja.tsx` + `pagina.css` | A página de pré-visualização |
| `exportar.mjs` | A exportação de todas para PNG |
| `chrome.mjs` + `plugin-vite.mjs` | O Chrome que fotografa cada imagem e o botão de download (só no `pnpm dev`) |
