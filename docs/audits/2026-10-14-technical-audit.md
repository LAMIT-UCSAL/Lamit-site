# Auditoria técnica e de débito técnico — site LAMIT

- **Data:** 2026-10-14
- **Autora:** Aria (@architect, AIOX)
- **Escopo:** `lamit-site` (React 18.3.1 + Vite 5.4.21 + react-router-dom 6.30.3 + ogl 1.0.11 + motion 12.38.0 + sweetalert2 11.26.24)
- **Base:** `main` @ `59f6bba` + mudanças locais não commitadas (Montserrat, caixa alta restrita, tokens de raio). As mudanças locais foram consideradas intencionais e auditadas como estado atual.
- **Método:** leitura integral de `src/` (21 arquivos, 2.763 linhas), `index.html`, `vite.config.js`, `package.json`, `.gitignore`, `DESIGN.md`, `PRODUCT.md`, `AGENTS.md`; `npx vite build` (com e sem `NODE_ENV=production`) e análise do bundle com `source-map-explorer`; `npm audit --omit=dev`; `npm outdated`. Nenhum arquivo de código foi alterado. `git status` foi conferido antes e depois do build: nada novo apareceu (o `dist/` é ignorado).
- **Referência cruzada:** `lamit-store/docs/audits/2026-10-13-frontend-architecture-audit.md` (pacote de tokens compartilhado).

---

## Recomendação em uma frase

Antes de qualquer refatoração visual, corrigir os quatro defeitos que afetam produção hoje (build de desenvolvimento do React vazando pelo `.env`, falta de fallback de SPA e de rota 404, tela branca quando não há WebGL, e o carrossel que quebra no "loop"), colocar uma rede mínima de lint e testes, e só então reorganizar o app em um layout com rotas carregadas sob demanda e migrar o CSS para tokens semânticos vindos de um pacote `lamit-brand` compartilhado com a loja.

Esforço total estimado: **cerca de 5 a 6 dias** de uma pessoa, em 6 fases independentes e entregáveis (seção 4).

---

## 1. Números medidos

| Métrica | Valor | Comentário |
|---|---|---|
| JS do build local (`npx vite build`) | **673,9 KB / 203,7 KB gzip**, 1 chunk | Inclui `react-dom.development.js` (ver A1) |
| JS do build de produção real (`NODE_ENV=production`) | **440,1 KB / 137,6 KB gzip**, 1 chunk | Abaixo do aviso de 500 KB do Vite, mas tudo num chunk só |
| CSS | 21,1 KB / 4,7 KB gzip | Um arquivo para todas as rotas |
| Composição do JS de produção | react-dom 126,8 KB; motion-dom + framer-motion 121,7 KB; sweetalert2 78,3 KB; ogl 43,4 KB; código próprio 27,1 KB; router 20,1 KB; react 7,1 KB | A Home não usa ogl nem TiltedCard, mas baixa tudo |
| Peso evitável na Home | **cerca de 240 KB minificados** (motion, sweetalert2, ogl) | Com code splitting e trocas pontuais (seção 3, A5) |
| Vídeos do hero (`public/media/videos`) | **37 MB** (4 arquivos, 2 deles `.MOV` QuickTime/H.264) | Todos com `autoPlay`, sem `poster`, sem `preload` |
| Fotos da diretoria | 2,0 MB em PNG, sem WebP, sem `loading="lazy"` | Galerias já foram otimizadas (WebP + JPG) |
| Logo `logo-horizontal.svg` | 141 KB, contém raster embutido (`data:image`) | Não é vetor de fato |
| Favicon | 111 KB PNG | Deveria ter poucos KB |
| Cores literais no CSS | ~35 valores distintos, **0 tokens de cor** | Só raio e fonte viraram token |
| `!important` | 19 | Todos em `style.css` |
| Seletores por id | 8 (`#creditsbtn`, `#downElements`, `#form`, `#sendBtn`, `#titleContainer`, `#contacts`, `#contact_content`, `#storeTitle`) | |
| Vulnerabilidades (`npm audit --omit=dev`) | 3 moderadas, todas no react-router 6.30.3 | Correção disponível em 6.30.6 (semver compatível) |
| Lint / testes / typecheck | inexistentes | `AGENTS.md` exige `npm run lint`, `typecheck` e `test` |

---

## 2. Pontos fortes (manter)

- Separação inicial de dados da Home em `src/data/home.js` (fotos, eventos, CTA), com `width`/`height`, `loading="lazy"`, `decoding="async"` e `<picture>` WebP + JPG nas galerias.
- Componentes da Home pequenos e com landmarks rotulados (`aria-labelledby` em cada seção).
- Carrossel com teclado, `aria-live` no contador, clones marcados com `aria-hidden` e respeito a `prefers-reduced-motion`.
- Formulário de contato com progressive enhancement (`action` + `method` reais e envio AJAX por cima), honeypot e `label`/`htmlFor` corretos.
- `.env` está no `.gitignore` e **nunca foi commitado** (`git log --all -- .env` vazio). Não há segredo no código do cliente nem variável `VITE_*`.
- Grainient com `ResizeObserver`, DPR limitado a 2 e cleanup de `requestAnimationFrame` e do observer.
- Script `scripts/optimize-images.mjs` já estabelece o pipeline com `sharp`.

---

## 3. Achados priorizados

Legenda de esforço: **P** até 1 h, **M** 1 a 4 h, **G** mais de 4 h.

### 3.1 Prioridade ALTA

#### A1. O `.env` local força o build de desenvolvimento do React
- **Onde:** `.env` (linha `NODE_ENV=development`, herdada do template AIOX); efeito em qualquer `vite build` executado nesta máquina.
- **Evidência:** o build local gera 673,9 KB e o source map referencia `react-dom.development.js`; com `NODE_ENV=production` explícito, o mesmo código gera 440,1 KB. O `dist/` que existe hoje na pasta foi gerado assim.
- **Impacto:** se o deploy for feito a partir de um build local (upload manual de `dist/`, `netlify deploy`, `vercel --prebuilt`), produção recebe React em modo desenvolvimento: +53% de JS, renderização mais lenta e avisos de desenvolvimento no console. Em CI o problema não aparece, porque o `.env` não vai para o repositório, o que torna o defeito intermitente e difícil de diagnosticar.
- **Recomendação:** remover `NODE_ENV` do `.env` (e do `.env.example`); a variável não deve ser definida em arquivos `.env` de projetos Vite. As demais chaves do `.env` (DeepSeek, OpenAI, Supabase etc.) são do framework AIOX, estão todas vazias e não são lidas pelo app; mantê-las é seguro porque nenhuma tem prefixo `VITE_`. **Esforço: P.**

#### A2. Sem fallback de SPA, sem rota 404 e sem configuração de deploy versionada
- **Onde:** `src/App.jsx:12-17` (sem `path="*"`); ausência de `netlify.toml`, `vercel.json`, `public/_redirects` ou workflow; GitHub Pages desligado (`has_pages: false`) e nenhum deployment registrado no repositório.
- **Impacto:** com `BrowserRouter`, abrir `/diretoria` ou `/contato` diretamente (link compartilhado no Instagram, recarregar a página) retorna 404 do servidor em qualquer host estático sem regra de rewrite. Uma URL inexistente dentro do app renderiza página vazia (só o `ScrollToTop`). Como o destino do deploy não está no repositório, ninguém além de quem publica sabe reproduzi-lo.
- **Recomendação:** [AUTO-DECISION] Onde publicar? → **Netlify**, o mesmo provedor da loja (`lamitstore.netlify.app`). Motivo: um só painel, um só padrão de `netlify.toml`, e a loja já validou o fluxo "build e publicar só `dist/`". Criar `netlify.toml` com `command = "npm ci && npm run build"`, `publish = "dist"`, `NODE_VERSION` fixo, rewrite `/* /index.html 200` e cabeçalhos (cache `immutable` para `/assets/*`, `X-Content-Type-Options`, `Referrer-Policy`, CSP básica permitindo `fonts.googleapis.com`, `fonts.gstatic.com` e `formsubmit.co`). Adicionar `<Route path="*" element={<NotFound />} />`. Se o site já estiver publicado em outro host, replicar a mesma regra lá. A configuração do provedor é de @devops. **Esforço: P (código) + P (@devops).**

#### A3. Sem WebGL, as páginas internas ficam em branco
- **Onde:** `src/components/Grainient.jsx:125-133`; `node_modules/ogl/src/core/Renderer.js:43-49`; ausência de Error Boundary em `src/main.jsx` e `src/App.jsx`.
- **Impacto:** quando `getContext('webgl2')` e `getContext('webgl')` falham (aceleração desligada, GPU na lista negra, alguns navegadores corporativos ou modos de economia), o ogl faz `console.error` e em seguida acessa `this.gl.renderer`, lançando `TypeError` dentro do `useEffect`. Sem Error Boundary, o React desmonta a árvore inteira: Diretoria, Contato e Shop viram tela preta vazia. Com WebGL 1 apenas, o shader `#version 300 es` não compila e o fundo simplesmente não aparece (degradação aceitável).
- **Recomendação:** testar suporte antes de instanciar (`document.createElement('canvas').getContext('webgl2')`) e envolver a criação em `try/catch`, caindo para um gradiente CSS estático com as mesmas cores; adicionar um `ErrorBoundary` no layout para que falhas de efeitos visuais nunca derrubem o conteúdo. **Esforço: P.**

#### A4. Ciclo de vida do WebGL: contexto nunca liberado, recriado a cada navegação e sem respeito a movimento reduzido
- **Onde:** `src/components/Grainient.jsx:122-213`; `src/components/GrainientBackground.jsx:3-31`; cada página monta o próprio fundo (`src/pages/Diretoria.jsx:66`, `Contato.jsx:51`, `Shop.jsx:8`).
- **Impacto:**
  - O cleanup remove o canvas, mas não chama `WEBGL_lose_context.loseContext()`. Cada navegação entre páginas internas (e cada montagem dupla do `StrictMode` em desenvolvimento) cria um contexto novo; o anterior só é liberado quando o coletor de lixo decide. Navegadores limitam cerca de 16 contextos ativos e passam a perder o mais antigo com aviso no console.
  - Como o fundo pertence à página, ir de Diretoria para Contato desmonta, recompila o shader e reinicia a animação, causando um "piscar".
  - O shader de tela cheia roda a 60 fps em DPR até 2, sem pausa. Em celular, isso é custo contínuo de GPU e bateria para um gradiente que é, por natureza, desfocado (pode ser renderizado em resolução baixa sem perda visível).
  - `prefers-reduced-motion` é ignorado (a animação continua).
  - Não há tratamento de `webglcontextlost`/`webglcontextrestored`.
  - `GrainientBackground` repassa explicitamente os 20 valores padrão e as cores em hex literais duplicadas do `DESIGN.md`.
- **Recomendação:** mover o `GrainientBackground` para um layout das rotas internas (ver M1), de modo que ele seja montado uma vez e persista entre Diretoria, Contato e Shop; no cleanup, chamar `loseContext()` e `program.remove()`/`geometry.remove()`; usar `dpr: 1` (ou 0,5 com upscale CSS) e limitar a 30 fps; com `prefers-reduced-motion: reduce`, renderizar um único quadro estático; pausar com `visibilitychange` (o `requestAnimationFrame` já pausa em aba oculta, mas não em janelas visíveis sem foco em alguns navegadores); ler as cores de tokens via `getComputedStyle` em vez de hex literal. **Esforço: M.**

#### A5. Um único bundle para todas as rotas; a Home baixa ~240 KB que não usa
- **Onde:** `src/App.jsx:2-5` (imports estáticos); `src/components/home/HackathonCarousel.jsx:2` (`useReducedMotion` do `motion` puxa o runtime de animação para a Home); `src/components/Footer.jsx:1` e `src/utils/swal.js:1` (sweetalert2 carregado em todas as páginas para quatro diálogos); `vite.config.js:4-6` (sem configuração de build).
- **Impacto:** o primeiro carregamento da Home (a página mais acessada, vinda das redes) paga motion (121,7 KB), sweetalert2 (78,3 KB) e ogl (43,4 KB) sem usar nenhum deles na renderização inicial. Em 4G médio isso é da ordem de 0,5 a 1 s a mais de parse e execução em aparelhos modestos.
- **Recomendação:**
  1. `React.lazy` + `Suspense` por rota (Diretoria, Contato, Shop, NotFound). A Home pode ficar estática por ser a entrada principal.
  2. Trocar `useReducedMotion` por um hook de 8 linhas com `matchMedia('(prefers-reduced-motion: reduce)')`; o `motion` passa a ser baixado apenas com a Diretoria (TiltedCard).
  3. Substituir o sweetalert2 por um componente `<dialog>` nativo (créditos, aviso de cópia, erro e sucesso do formulário), ou, no mínimo, carregá-lo com `import()` dinâmico no clique. A troca por `<dialog>` também resolve 13 dos 19 `!important` (que existem só para sobrescrever o tema do SweetAlert) e dá foco gerenciado e `Esc` de graça.
  4. Carregar o Grainient com `import()` dinâmico dentro do layout interno.
- **Resultado esperado:** Home com cerca de 165 a 175 KB minificados (~55 KB gzip), contra 440 KB hoje. **Esforço: M.**

#### A6. Carrossel: o "loop" salta antes da hora e o scroll vertical é sequestrado (sem conseguir de fato bloquear)
- **Onde:** `src/components/home/HackathonCarousel.jsx:36-41` e `:63-75`; `src/styles/home.css:255-257`.
- **Impacto:**
  - `onTransitionEnd` está no trilho, mas o evento `transitionend` borbulha dos slides, que têm transição própria de `opacity`/`transform` de 0,4 s (`home.css:256`). O trilho anima em 0,5 s. Ao passar do último para o primeiro, a transição de 0,4 s de um slide dispara o handler, que reposiciona o trilho sem animação 100 ms antes de o movimento terminar: salto visível no "loop".
  - `handleWheel` chama `e.preventDefault()`, mas o React registra `wheel` como listener passivo; o `preventDefault` é ignorado (com aviso no console). Resultado: ao rolar a página com o mouse sobre o carrossel, a página rola **e** o carrossel avança. Se o bloqueio funcionasse, seria pior: o usuário ficaria preso no carrossel ao tentar descer a página (scroll-jacking).
  - O `setTimeout` do cooldown não é limpo na desmontagem (vazamento menor).
- **Recomendação:** filtrar o evento (`if (e.target !== e.currentTarget || e.propertyName !== 'transform') return`); remover o mapeamento de roda vertical e reagir apenas a `deltaX` (trackpad horizontal); se quiser manter a roda, registrar listener nativo com `{ passive: false }` via `useEffect`, só para `deltaX`. Cobrir com teste (ver fase 2). **Esforço: P.**

#### A7. A experiência profissional da diretoria é invisível no celular e inacessível por teclado
- **Onde:** `src/components/DirectorBanner.jsx:12` (a experiência só vai para `captionText`); `src/components/TiltedCard.jsx:121-134`; `src/components/TiltedCard.css:20-27` (`display: none` abaixo de 640 px).
- **Impacto:** o dado de maior peso para credibilidade, segundo o `PRODUCT.md` ("ponte real com o mercado", "Product Analyst @ Ford"), aparece apenas como tooltip que segue o mouse. No celular ele é removido; por teclado nunca aparece (o card não é focável); leitores de tela o leem fora de contexto. Patrocinadores e estudantes que acessam pelo celular (a maioria, vindos do Instagram) não veem essa informação.
- **Recomendação:** renderizar `experience` como texto no `director-banner__content` (por exemplo, abaixo do cargo) e manter o tooltip como reforço visual opcional, com `aria-hidden`. Trocar `setLastY` (estado que re-renderiza o card a cada `mousemove`, `TiltedCard.jsx:41,62`) por `useRef`. Remover as props mortas `showMobileWarning`, `overlayContent` e `displayOverlayContent`. **Esforço: P.**

#### A8. 37 MB de vídeo em autoplay no hero
- **Onde:** `src/pages/Home.jsx:15-26`; `src/styles/style.css:735-741`.
- **Impacto:** no desktop, quatro vídeos começam a baixar juntos ao abrir a Home; dois são `.MOV` (QuickTime, H.264) servidos com `type="video/mp4"`, o que funciona em Chrome e Safari mas depende de tolerância do navegador. No celular, três vídeos ficam com `display: none`, mas os elementos continuam no DOM com `autoPlay` e o navegador pode buscar metadados ou dados. Sem `poster`, o hero fica preto até o primeiro quadro.
- **Recomendação:** transcodificar os quatro para MP4 H.264 720p (e opcionalmente WebM/AV1), alvo de 1 a 2 MB cada (8 a 12 s em loop), com `poster` WebP; `preload="metadata"`; renderizar só um vídeo no celular via `matchMedia` em vez de esconder com CSS; adicionar o passo de vídeo ao `scripts/optimize-images.mjs` (ou um script irmão com `ffmpeg`). Mover os originais para fora de `public/` (como já é feito com `assets-src/`). **Esforço: M.**

### 3.2 Prioridade MÉDIA

#### M1. Moldura de página duplicada em cada rota; navegação sem landmark nem estado ativo
- **Onde:** `src/pages/Diretoria.jsx:65-68`, `Contato.jsx:50-53`, `Shop.jsx:7-10` repetem `<div className="page-bg" style={{ background: 'none' }}><GrainientBackground /><Navbar currentPage="..." /><Footer />`; a Home repete `Navbar` + `Footer` dentro do hero (`Home.jsx:12,29`). `Navbar.jsx:14` filtra a página atual da lista; `Navbar.jsx:17-40` não usa `<nav>`; `Footer.jsx:5` é uma `div`.
- **Impacto:** cada página nova precisa lembrar de quatro peças e do `style` inline morto (`.page-bg` não tem fundo); o `currentPage` em string duplica a fonte de verdade das rotas; sem `<header>`, `<nav>`, `<main>` (Home, Contato e Shop não têm `<main>`) e `<footer>`, leitores de tela não conseguem saltar entre regiões; remover o link atual tira do usuário a referência de onde está; não há skip link; o `Footer` aparece no DOM antes do conteúdo.
- **Recomendação:** um `RootLayout` com `<header>` (logo + `<nav aria-label="Principal">` com `NavLink`, que gera `aria-current="page"`), `<main id="conteudo"><Outlet/></main>`, `<footer>` e skip link; um `InteriorLayout` aninhado que adiciona o Grainient (A4). Rotas aninhadas com `createBrowserRouter`. Menu móvel: fechar com `Esc`, devolver o foco ao botão e bloquear o scroll do `body` quando aberto. Título por rota (`document.title`) num hook simples. **Esforço: M.**

#### M2. CSS: regras globais agressivas que todo componente precisa desfazer
- **Onde:** `src/styles/style.css:11-15` (`* { font-family; box-shadow: none !important }`); `:47-66` (`user-select: none`, `text-align: center`, `overscroll-behavior: none` em `html, body`); `:92-94` (barra de rolagem com 0,1 px); `:419-428` (`h1`/`h2` globais com `width: 60%` e `text-align: end`); `:317-319` (segundo bloco `*`); `:342-344` (`label { margin-bottom: 0vh }`).
- **Impacto:**
  - `user-select: none` impede copiar e-mails, nomes e textos; cada bloco de texto precisa reativar com `user-select: text` (`home.css:74,107,380,425`). É um problema de acessibilidade e de uso (o próprio contato depende de copiar o e-mail).
  - Esconder a barra de rolagem remove o indicador de posição e de "há mais conteúdo".
  - O `h2` global obriga sobrescritas com especificidade extra (`h2.home-cta__title`, `h3.home-event__title`, `.director-banner__content h2`) e torna qualquer `h2` novo torto por padrão.
  - `* { box-shadow: none !important }` impede que um futuro componente compartilhado com a loja (que usa sombras) funcione no site sem outro `!important`.
- **Recomendação:** substituir por um reset mínimo em `base.css` (`box-sizing`, margens, `font-family` no `body` por herança); remover `user-select: none`, o esconderijo da barra de rolagem e os estilos de layout em seletores de elemento; a regra "sem sombra" passa a ser um token (`--shadow-card: none` no tema escuro), não um `!important` universal. **Esforço: M.**

#### M3. CSS: duplicações, `!important`, ids e regras mortas
- **Onde e o quê:**
  - `!important` (19): `style.css:14, 486-488, 495, 503-504, 507, 675-678, 688, 691, 705-707, 714-716`; 18 deles existem só para vencer o tema do SweetAlert.
  - Duplicações: `.swal-confirmBtn` idêntico em `:483-492` e `:711-720`; `.swal-title` em `:96-99` e `:681-685`; `#contacts` duas vezes no mesmo media query (`:759-763` e `:805-809`); `#contacts p button` repetido inteiro em `:772-782`; propriedades repetidas na mesma regra (`#creditsbtn` `display` e `color` em `:107/114` e `:108/119`; `.btn-primary` `color` em `:154/165`; `.swal2-popup` `overflow-y` em `:477/480`).
  - Regras mortas: `.photo_gallery` (`:303-315`, sem uso no JSX); `.diretoria-showcase::before` (`:573-575`); `.director-banner__media::after` (`:618-624`, e `:919-922` define fundo para um pseudo-elemento com `display: none`); `.home-carousel__arrow:disabled` (`home.css:220-223`, as setas nunca ficam desabilitadas); `scroll-behavior` no trilho (`home.css:252`, sem efeito num elemento movido por `transform`); `.tilted-card-mobile-alert` e `.tilted-card-overlay` (`TiltedCard.css:13-28, 52-59`, props sempre desligadas); `.swal-html { left: 90px }` sem `position`.
  - Ids como seletores de estilo: 8 (lista na seção 1), concentrados na página de Contato.
  - Breakpoints 920/760/480 repetidos como literais em `style.css` e `home.css`.
  - Layout de Contato por posicionamento absoluto com porcentagens (`#form` `:321-340` com `top: 58%`; `#titleContainer` `:408-417`; `.contact_msg` `:432-445`), frágil em telas baixas (formulário colide com título e rodapé fixo).
- **Recomendação:** dividir `style.css` (948 linhas) em `base.css` (reset e tipografia), `layout.css` (header, footer, nav) e CSS por página/componente, como já é feito em `home.css` e `TiltedCard.css`; trocar ids por classes BEM; remover o bloco SweetAlert inteiro junto com a troca por `<dialog>` (A5); refazer Contato com grid/flex em fluxo normal. Stylelint (fase 2) com `declaration-no-important`, `selector-max-id: 0` e `declaration-block-no-duplicate-properties` impede a regressão. **Esforço: G.**

#### M4. Cores 100% literais, fora de tokens, e com valores fora da paleta
- **Onde:** ~35 valores distintos em `style.css`, `home.css`, `TiltedCard.css` e `src/utils/swal.js`. Os mais repetidos: `#ffffff` (18), `#e84b13` (8), `#d7c06b` (7), mais de uma dúzia de variações de `rgba(255,255,255,α)`. Fora da paleta do `DESIGN.md`: `rgb(79, 79, 251)` (`style.css:473`, hover do e-mail), `#a3a3a3` (`:766`), `#ffffff00`/`#00000000` (transparente escrito como hex). `#081536` (`home.css:19`) e `#0B0D12` (`style.css:174`) já existem na loja como `--color-night` e `--color-ink`.
- **Impacto:** qualquer ajuste de marca exige busca e substituição em três arquivos; o alinhamento com a loja depende de disciplina manual; o tema escuro não pode ser expresso como "atribuição de variáveis".
- **Recomendação:** ver seção 5 (tokens). Mapear os literais para cerca de 15 tokens semânticos do tema escuro, sem mudança visual. **Esforço: M** (incluído na fase 4).

#### M5. Dados misturados com marcação e duplicados
- **Onde:** diretoria inteira no componente (`src/pages/Diretoria.jsx:6-61`), com `index` e `reverse` escritos à mão (deriváveis da posição no array); pilares em `src/components/home/AboutSection.jsx:1-14`; redes sociais em `Footer.jsx:9-20` e Linktree repetido em `Home.jsx:32`; e-mail de contato três vezes em `Contato.jsx:34, 63, 94`; ano fixo `2026` em `Footer.jsx:6`; créditos como HTML em string em `src/utils/swal.js:7-11`; links da navegação dentro de `Navbar.jsx:7-12`.
- **Impacto:** trocar a diretoria (acontece todo ano numa liga acadêmica) exige editar JSX e acertar índices e alternância à mão; o futuro "hub de eventos" (`PRODUCT.md`, princípio 3) vai precisar desses dados fora dos componentes.
- **Recomendação:** `src/data/site.js` (contato, redes, navegação, créditos) e `src/data/directors.js`; derivar `index` e `reverse` no `map`; ano com `new Date().getFullYear()`. Manter em JS (não JSON) por ora; migrar para JSON/CMS só quando a vitrine de eventos for integrada. **Esforço: P.**

#### M6. Formulário de contato: e-mail exposto ao FormSubmit, sem captcha e com validação que barra usuários válidos
- **Onde:** `src/pages/Contato.jsx:34, 63` (endpoint com o e-mail em claro), `:83` (`_captcha=false`), `:29-30` (telefone obrigatório), `src/utils/validation.js:2, 7, 12`.
- **Impacto:** o e-mail fica visível para robôs no bundle (spam); sem captcha, só o honeypot segura envios automatizados; o regex de nome recusa nomes com caracteres comuns (por exemplo, "D'Ávila" passa, mas "Maria  Silva" com espaço duplo, ou nomes com ponto, como "J. Silva", não); o de e-mail recusa `+` (`nome+lamit@gmail.com`); o de telefone mistura padrão brasileiro e norte-americano e recusa `+55`. Telefone obrigatório é atrito para quem só quer mandar uma mensagem. `copiarTexto` (`swal.js:25-36`) não trata falha do `navigator.clipboard`.
- **Recomendação:** usar o alias aleatório do FormSubmit em vez do e-mail; avaliar reativar o captcha ou usar Netlify Forms (se A2 for Netlify, o formulário passa a ser nativo, com filtro de spam e sem terceiro); validar com os atributos nativos (`required`, `type="email"`, `autocomplete`) e mensagens inline associadas por `aria-describedby`, deixando o telefone opcional (decisão de produto para @pm). **Esforço: M.**

#### M7. `DESIGN.md` contradiz o código
- **Onde:** `DESIGN.md:15-39` (frontmatter ainda com BB Mono), `:127, 133, 161, 170, 173, 233, 237` (caixa alta forçada e fonte única), `:195, 200, 238` (raio 0), `:44-51` (escala de raios antiga: 10/14/15/16 px).
- **Impacto:** o aviso de 2026-10-14 no topo diz que ele "prevalece onde houver conflito", mas o frontmatter é o que ferramentas e agentes leem primeiro; a próxima pessoa ou agente vai reintroduzir a BB Mono e os cantos retos.
- **Recomendação:** reescrever o frontmatter e as seções Typography, Shapes e Do's/Don'ts com os valores atuais, e fazer o `DESIGN.md` apontar para o arquivo de tokens como fonte única (os valores passam a viver no CSS, o documento explica o uso). Responsabilidade de @ux-design-expert. **Esforço: M.**

#### M8. Ausência de lint, testes e CI, contrariando o próprio `AGENTS.md`
- **Onde:** `package.json:6-10` (só `dev`, `build`, `preview`); `AGENTS.md` ("Quality Gates" exige lint, typecheck e test).
- **Impacto:** os defeitos A6 e M3 são exatamente os que um linter e um teste de componente pegam; as fases de refatoração seguintes não têm rede de segurança.
- **Recomendação:** ver fase 2 do plano. **Esforço: M.**

#### M9. Dependência com vulnerabilidades conhecidas
- **Onde:** `react-router-dom` 6.30.3 (3 avisos moderados: open redirect via `//` e `\` em `Link`/`navigate`, e um de hidratação SSR).
- **Impacto:** baixo na prática (não há navegação a partir de entrada do usuário nem SSR), mas a correção é compatível e trivial.
- **Recomendação:** `npm audit fix` (sobe para 6.30.6). Habilitar as flags `future` do v7 (`v7_startTransition`, `v7_relativeSplatPath`) para silenciar os avisos no console e preparar a migração. Não migrar para React 19 / Router 7 / Vite 7+ agora: o ganho é pequeno e a migração deve vir depois dos testes (fase 2). **Esforço: P.**

### 3.3 Prioridade BAIXA

| # | Achado | Onde | Recomendação | Esforço |
|---|---|---|---|---|
| B1 | Fonte BB Manual Mono (193 KB) continua em `public/` sem nenhuma referência no código | `public/fonts/bb-manual-mono-text-semi-regular.otf` | Remover do `public/` (manter em `assets-src/` se houver interesse de arquivo). Ver também a questão de licença levantada na auditoria da loja (R6) | P |
| B2 | Fotos da diretoria em PNG (2 MB), sem WebP, sem `width`/`height`, sem `lazy` | `public/media/directors/*.png`; `TiltedCard.jsx:106-114` | Incluir `directors` no `optimize-images.mjs` (WebP 800 px, alvo < 80 KB cada); `loading="lazy"` a partir do segundo card | P |
| B3 | Logo SVG de 141 KB com raster embutido; favicon de 111 KB; ícones sociais em PNG com `alt` errados ("bandcampicon", "instagramIcon") | `public/media/brand/*`; `Footer.jsx:10-19` | Logo vetorial real; favicon 32 px + `apple-touch-icon` 180 px + SVG; ícones em sprite SVG com `currentColor` (planejado no pacote de marca); `alt=""` no ícone e `aria-label="Instagram da LAMIT"` no link | M |
| B4 | `index.html` sem Open Graph, `canonical`, `theme-color`; título fixo em todas as rotas | `index.html:4-12` | Metatags estáticas (link compartilhado mostra imagem e descrição); título por rota (M1). Pré-renderização só se o SEO por página virar requisito | P |
| B5 | Montserrat via Google Fonts com 5 pesos, nos dois projetos | `index.html:7-9` (site); `lamit-store/index.html:21-23` | Auto-hospedar woff2 com subset latino no pacote de marca (sem requisição a terceiro, melhor para LGPD, cache compartilhado entre os domínios não existe mais nos navegadores atuais); avaliar se o peso 500 e o 600 são usados | P |
| B6 | Imports duplicados do mesmo módulo | `Contato.jsx:5-6` | Unificar | P |
| B7 | `/shop` mostra "Coming Soon", mas a loja já está no ar (`lamitstore.netlify.app`) | `src/pages/Shop.jsx:12-14` | Decisão de produto (@pm): redirecionar `/shop` para a loja ou mostrar uma vitrine com link. Atualizar o `PRODUCT.md`, que ainda diz que a loja "não está integrada" | P |
| B8 | Link de convite do grupo do WhatsApp público no bundle | `src/data/home.js:76` | Esperado (é um CTA público), mas registrar no runbook que, em caso de spam, o link deve ser revogado e trocado só nesse arquivo | P |
| B9 | `sharp` e `@types/*` em `devDependencies` sem script que os use (`optimize-images.mjs` é rodado à mão; não há TypeScript) | `package.json:17-23` | Adicionar `"optimize:images": "node scripts/optimize-images.mjs"`; manter `@types/*` (ajudam o editor) | P |
| B10 | Rodapé fixo com `z-index: 9999` sobrepõe o conteúdo ao rolar a Home no celular | `style.css:139-147` | Avaliar com UX: rodapé em fluxo normal no celular, fixo só no desktop | P |

---

## 4. Plano em fases

Cada fase é entregável sozinha, sem mudança visual até a fase 4 (exceto onde indicado). Ordem pensada para que a rede de segurança (fase 2) exista antes das refatorações grandes.

| Fase | Conteúdo | Achados | Esforço | Dono |
|---|---|---|---|---|
| **1. Correções de produção** | Remover `NODE_ENV` do `.env`; `npm audit fix`; rota 404; `netlify.toml` (build, `dist/`, rewrite SPA, cabeçalhos de cache e segurança); guarda de WebGL + Error Boundary; correção do `transitionend` e da roda no carrossel; experiência da diretoria como texto visível; remover a fonte órfã e as regras CSS mortas | A1, A2, A3, A6, A7, M9, B1, parte de M3 | **0,5 a 1 dia** | @dev; configuração do Netlify e domínio: @devops |
| **2. Rede de segurança** | ESLint 9 (flat config) com `eslint-plugin-react`, `react-hooks`, `jsx-a11y`; Stylelint com `stylelint-config-standard`, `declaration-no-important`, `selector-max-id: 0`, `declaration-block-no-duplicate-properties` (começa como aviso e vira erro ao fim da fase 4); Vitest + Testing Library + jsdom com testes de `validation.js`, renderização de cada rota (smoke), carrossel (avançar, voltar, "loop") e menu móvel (abre, fecha com Esc, `aria-expanded`); scripts `lint`, `lint:css`, `test`, `check`; workflow de CI rodando `check` + `build` em PRs | M8 | **0,5 a 1 dia** | @dev; CI: @devops |
| **3. Estrutura do app** | `RootLayout` e `InteriorLayout` com landmarks, `NavLink`, skip link e título por rota; `React.lazy` por rota; hook próprio de `prefers-reduced-motion`; `<dialog>` no lugar do sweetalert2; Grainient persistente, com `loseContext`, DPR 1, 30 fps, quadro estático com movimento reduzido e fallback CSS; extração de dados para `src/data/` | A4, A5, M1, M5, B6 | **1,5 dia** | @dev |
| **4. CSS e tokens** | Dividir `style.css` em base/layout/páginas; reset mínimo no lugar das regras globais; remover `user-select: none` e o esconderijo da barra de rolagem; trocar ids por classes; tokens semânticos do tema escuro consumindo as primitivas do pacote de marca (seção 5); refazer o layout de Contato em fluxo normal; Stylelint vira erro | M2, M3, M4 | **1 a 1,5 dia** | @dev, com revisão visual de @ux-design-expert |
| **5. Pacote `lamit-brand`** | Repositório próprio com primitivas, temas, fontes woff2, sprite de ícones e logos vetoriais; consumo pelo site (import) e pela loja (cópia no `build.mjs`); `DESIGN.md` reescrito apontando para os tokens | seção 5, M7, B3, B5 | **1 dia** | @architect (estrutura), @dev, @ux-design-expert (`DESIGN.md`); criação do repositório: @devops |
| **6. Mídia e formulário** | Vídeos transcodificados com `poster` e um vídeo só no celular; fotos da diretoria em WebP; metatags OG; formulário com alias/Netlify Forms, validação nativa e telefone opcional (após decisão de @pm) | A8, B2, B4, M6, B7 | **1 dia** | @dev; decisões de produto: @pm |

**Total:** cerca de 5,5 a 7 dias. As fases 1 e 2 (1 a 2 dias) já eliminam todos os riscos de produção.

Fora de escopo agora, por decisão consciente: migração para React 19, React Router 7 ou Vite 7+; TypeScript; pré-renderização/SSR; CMS. Reavaliar quando a vitrine de eventos for integrada ao site.

[AUTO-DECISION] Incluir `typecheck` como exige o `AGENTS.md`? → Não nesta rodada (motivo: o projeto é JavaScript puro; `tsc --noEmit` com `checkJs` geraria ruído alto para pouco ganho num app de 2,7 mil linhas. Lint com `react-hooks` e `jsx-a11y` e testes cobrem os riscos reais. Reavaliar se o site ganhar lógica de dados com a vitrine de eventos).

---

## 5. Caminho para compartilhar tokens com a loja

### 5.1 O que mudou desde a auditoria de 2026-10-13

A auditoria anterior partia de duas marcas divergentes e deixava a paleta e a tipografia como bloqueio de design. Isso foi resolvido:

- A loja adotou a **paleta do site** (`lamit-store/css/tokens.css:19-26`: cobalto `#0A3383`, signal blue `#164194`, signal orange `#E84B13`, âmbar `#C17402`, ouro `#D7C06B`, noite `#081536`).
- O site adotou **Montserrat** e **os mesmos raios** da loja (`--radius-sm` 8, `--radius-md` 12, `--radius-lg` 20, `--radius-pill` 999), com valores idênticos nos dois arquivos.
- A loja tem agora um passo de build (`scripts/build.mjs`, publicando só `dist/`), embora não seja Vite.

Ou seja, a parte compartilhável já existe, mas **duplicada à mão** em dois arquivos. A diferença real que resta é de **tema** (loja clara e com sombras leves; site escuro e sem sombras), que é exatamente o que a camada semântica resolve.

### 5.2 Recomendação

1. **Primitivas iguais, temas separados.** O pacote contém:
   - `primitives.css`: só variáveis de valor bruto. Adotar os **nomes que a loja já usa em produção** (`--color-cobalt`, `--color-signal-blue`, `--color-signal-orange`, `--color-amber`, `--color-gold`, `--color-night`, `--color-ink`, `--color-paper`), mais `--font-primary`, pesos, `--radius-*`, durações e `--ease-broadcast`. Reaproveitar os nomes existentes evita renomear a loja.
   - `theme-light.css` e `theme-dark.css` (ou um arquivo com `[data-theme="light"]` e `[data-theme="dark"]`): papéis semânticos com os mesmos nomes nos dois temas: `--color-bg`, `--color-fg`, `--color-fg-muted`, `--color-kicker`, `--color-focus`, `--color-cta`, `--color-cta-fg`, `--color-cta-hover`, `--color-cta-hover-fg`, `--color-surface-glass`, `--color-surface-glass-hover`, `--color-border`, `--color-border-strong`, `--shadow-card`. No escuro, `--shadow-card: none` substitui o `* { box-shadow: none !important }`.
   - Nenhum seletor de elemento, nenhum reset, nenhum `!important`.
2. **Distribuição:** [AUTO-DECISION] repositório `LAMIT-UCSAL/lamit-brand`, consumido como dependência git com tag (`"lamit-brand": "github:LAMIT-UCSAL/lamit-brand#v1.0.0"`) → mantida a opção A da auditoria anterior (motivo: os dois projetos agora têm `npm` e build; a tag dá atualização explícita e reversível). No site, `import 'lamit-brand/primitives.css'` e `import 'lamit-brand/theme-dark.css'` no `main.jsx`, com `<html data-theme="dark">`. Na loja, o `build.mjs` copia os arquivos de `node_modules/lamit-brand/` para `dist/css/` (cerca de 10 linhas, no mesmo padrão de lista de inclusão já usado), e o `tokens.css` atual passa a conter só os aliases legados da Story 1.2.
3. **Fontes e ícones no mesmo pacote:** Montserrat woff2 (subset latino, 400/700/800 e o que mais for usado) com `font-display: swap`, sprite SVG com `currentColor` para Instagram, TikTok, LinkedIn, link, setas e fechar, e logos vetoriais. Isso remove o Google Fonts dos dois projetos e os PNGs de ícone do site.
4. **Ordem:** fazer a fase 4 do site **mapeando os literais para nomes semânticos locais primeiro** (sem mudança visual), e só na fase 5 trocar a origem das primitivas para o pacote. Assim o risco de regressão visual fica isolado em cada passo.

### 5.3 Trade-offs considerados

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| A. Pacote em repositório próprio, tag git | Fonte única, versão explícita, reversível | Um repositório a mais para manter; atualização exige bump nos dois projetos | **Recomendada** |
| B. Arquivo copiado com script de verificação (como o `partials:check` da loja) | Zero infraestrutura | A cópia diverge em silêncio se alguém editar o arquivo errado; é o problema atual | Plano B, se a criação do repositório atrasar |
| C. Loja carrega o CSS do domínio do site em runtime | Fonte única em produção | Acoplamento em runtime, CORS para fontes, a loja quebra se o site mudar | Rejeitada |
| D. Monorepo | Compartilhamento máximo | Mistura deploys, histórico e stories de dois produtos | Rejeitada por ora |

Componentes React **não** devem ser compartilhados: a loja não tem React e não precisa ter. O que se compartilha é identidade (tokens, fontes, ícones, logos), não implementação.

---

## 6. Segurança (resumo)

| Item | Situação | Ação |
|---|---|---|
| Segredos no repositório | Nenhum. `.env` ignorado e nunca commitado; só chaves vazias do AIOX | Remover `NODE_ENV` (A1) |
| Segredos no bundle | Nenhum. Apenas dados públicos (e-mail de contato, link do WhatsApp) | Alias do FormSubmit (M6) |
| Dependências | 3 avisos moderados no react-router | `npm audit fix` (M9) |
| Links externos | Todos com `rel="noopener noreferrer"` | — |
| Cabeçalhos HTTP | Não há configuração versionada | CSP, `X-Content-Type-Options`, `Referrer-Policy` no `netlify.toml` (A2) |
| Spam no formulário | Captcha desligado, só honeypot | M6 |
| Privacidade | Google Fonts carregado de terceiro | Auto-hospedar (B5) |

---

## 7. Decisões autônomas registradas

- [AUTO-DECISION] Host de deploy → Netlify, como a loja (motivo: um só fluxo e painel; o repositório não indica outro host).
- [AUTO-DECISION] Typecheck → adiado (motivo: JavaScript puro; lint e testes cobrem os riscos reais).
- [AUTO-DECISION] Nomes das primitivas → os da loja (motivo: já estão em produção; evita renomeação).
- [AUTO-DECISION] Distribuição dos tokens → repositório próprio com tag git (motivo: os dois projetos já têm build).
- [AUTO-DECISION] Upgrades de major (React 19, Router 7, Vite 7+) → fora desta rodada (motivo: sem ganho funcional imediato; fazer depois da fase 2, com testes).

Decisões que **não** são de arquitetura e ficam com outros donos: telefone obrigatório e destino do `/shop` (@pm); rodapé fixo no celular e reescrita do `DESIGN.md` (@ux-design-expert); criação do repositório `lamit-brand`, CI e configuração do Netlify (@devops).
