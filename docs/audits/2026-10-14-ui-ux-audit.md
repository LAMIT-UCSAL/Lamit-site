# Auditoria de UI/UX — Site LAMIT

**Data:** 2026-10-14
**Autora:** Uma (@ux-design-expert, AIOX)
**Escopo:** `/`, `/diretoria`, `/contato`, `/shop` em http://localhost:5173 (React 18 + Vite 5), estado de trabalho não commitado.
**Viewports:** 1440×900 e 375×812 (principais), mais 1280×650, 1024×768 e 768×1024 como verificação.
**Método:** leitura do código (`src/`, `DESIGN.md`, `PRODUCT.md`), screenshots do viewport rolando o `document.body` (Playwright + Chrome), testes de interação (menu, teclado, roda do mouse, formulário com resposta simulada do formsubmit, `prefers-reduced-motion`), medição de contraste e de peso de rede, e comparação com a Lamit Store (http://localhost:3000).

Nada no código foi alterado. Screenshots e scripts ficaram fora do repositório, no scratchpad da sessão (`.../scratchpad/audit/`).

## Fora do escopo (decisões do usuário, não reportadas como defeito)

Montserrat no lugar da BB Mono; caixa alta só em menu, kickers, rótulos e datas; cantos via `--radius-sm/md/lg`; CTA "Acesse Nossos Links" de ponta a ponta com pontas retas; `/shop` continua "Coming Soon"; tema escuro com Grainient; nenhuma sombra. Também não se mexeu em `public/media/gallery/about/`.

---

## Resumo executivo

O site tem identidade forte, fotos reais boas e uma narrativa na Home (Sobre → Hackathons → Eventos → CTA) que funciona. Os problemas mais graves não são de estética. São quatro: o **chrome fixo (logo, menu e rodapé) não tem fundo e passa por cima do conteúdo** em todas as páginas; a **navegação entre páginas não volta ao topo**; a **Home baixa cerca de 38 MB de vídeo**, inclusive no celular, onde só um dos quatro vídeos aparece; e o **movimento ignora `prefers-reduced-motion`**, com vídeos em autoplay sem botão de pausa (falha WCAG 2.2.2, nível A). Na jornada, o primeiro e mais forte CTA manda o visitante para fora do site (Linktree), a Home não diz o que é a LAMIT na primeira dobra e não existe caminho para patrocinadores, que é um dos três públicos do `PRODUCT.md`.

| Prioridade | Qtde |
|---|---|
| Alta | 7 |
| Média | 12 |
| Baixa | 10 |

---

## Achados de prioridade ALTA

### A1. O chrome fixo cobre o conteúdo e não tem fundo
- **Evidência:** `src/styles/style.css:201-217` (`.nav-logo` e `.nav_home` com `position: fixed`, sem fundo), `style.css:256-266` (o único "fundo" é um degradê de 80 px a 70% em `body::before`), `style.css:105-147` (crédito, copyright e redes também fixos). Nos screenshots: `home-1440-01` mostra "Acesse Nossos Links" atrás de "SHOP"; `home-1440-02` mostra o kicker "HACKATHONS" atrás do menu; `home-1440-03` mostra "A LAMIT também é palco." atravessado pelos links; `home-1440-01/05` mostram "2026 LAMIT" em cima dos títulos; `home-375-01` mostra o H1 atrás do logo de 72 px; `diretoria-1440-04` mostra a descrição de um diretor cortada sob o menu.
- **Impacto:** é o defeito mais visível do site. Textos ficam ilegíveis durante a rolagem, o menu perde legibilidade sobre o vídeo e o conteúdo, e o rodapé fixo esconde as últimas linhas de cada bloco no celular.
- **Recomendação:** dar ao topo uma faixa própria, no mesmo espírito do cabeçalho da loja: barra fixa de ~72 px com fundo `rgba(0,0,0,.72)` + `backdrop-filter: blur(12px)`, ou com fundo sólido `#000` depois de 80 px de rolagem. Isso entra na Glass Exception sem sombra, mas precisa de decisão explícita no `DESIGN.md`. No celular, reduzir o logo para ~44 px. Para o rodapé: torná-lo estático no fim do documento (como na loja) ou, se a "camada de transmissão" fixa for inegociável, manter fixo só o conjunto de ícones sociais e reservar `padding-bottom` ≥ 64 px nas seções.

### A2. Navegar entre páginas não volta ao topo
- **Evidência:** `src/components/ScrollToTop.jsx:8` chama `window.scrollTo(0, 0)`, mas quem rola é o `body` (`style.css:47-66`, `html, body { height: 100%; overflow-x: hidden }`), então `window` não tem rolagem. No teste: no fim da Home (`body.scrollTop = 4267`), clicar em "DIRETORIA" abre a página em `scrollTop = 2924`, já no último diretor e sem o título (screenshot `x-nav-scroll-restore`).
- **Impacto:** o visitante cai no meio ou no fim da página de destino, sem saber onde está. Afeta qualquer navegação a partir de uma página rolada.
- **Recomendação:** em `ScrollToTop`, rolar o elemento que de fato rola (`document.body.scrollTo(0, 0)` junto com `window.scrollTo`). A correção mais saudável é fazer o documento voltar a rolar: tirar `height: 100%` e `overflow-x: hidden` do `body` e usar `overflow-x: clip` no `#root`. Isso também resolve o screenshot `fullPage` preto e a âncora/rolagem nativa.

### A3. Vídeos em autoplay sem pausa e movimento que ignora `prefers-reduced-motion`
- **Evidência:** `src/pages/Home.jsx:15-26` (quatro `<video autoPlay muted loop>` sem controles); `src/components/Grainient.jsx:189-196` (loop de `requestAnimationFrame` permanente); `src/components/TiltedCard.jsx` (tilt sem checagem). Só o carrossel respeita a preferência (`HackathonCarousel.jsx:16`, `home.css:250`). Teste com `reducedMotion: 'reduce'`: os quatro vídeos continuam tocando e o Grainient continua animando (dois screenshots com 1,5 s de diferença saem diferentes).
- **Impacto:** falha do critério WCAG 2.2.2 (Pausar, Parar, Ocultar, nível A) para os vídeos com mais de 5 s, e desconforto para quem tem sensibilidade vestibular. O Grainient é fundo fixo e está em movimento contínuo em três das quatro páginas.
- **Recomendação:** (1) com `prefers-reduced-motion: reduce`, não dar autoplay e mostrar `poster`; o Grainient desenha um único quadro e para o loop; o TiltedCard desliga o tilt. (2) Um botão de pausar/retomar vídeos no hero, discreto e no canto, acessível por teclado. (3) Bônus de desempenho: pausar o loop do Grainient com `document.visibilityState === 'hidden'`.

### A4. A Home baixa ~38 MB de vídeo, inclusive no celular
- **Evidência:** `public/media/videos/`: `podcast.MOV` 16,4 MB, `onboarding.mp4` 10,7 MB, `gdg-salvador.MOV` 8,3 MB, `lamit-redbull.mp4` 2,8 MB. Medido na rede: ~42 MB na Home a 1440 px e **também ~42 MB a 375 px**, embora `style.css:735-737` esconda três vídeos com `display: none`. Vídeo escondido continua baixando. Sem `poster`: o hero fica preto até o primeiro quadro. Os `.MOV` vão com `type="video/mp4"` (`Home.jsx:19, 25`). As fotos da diretoria são PNG de até 680 KB (`public/media/directors/luan-galvao.png`) sem WebP, ao contrário do resto da galeria.
- **Impacto:** em 4G, a primeira dobra demora vários segundos e consome franquia de dados, justamente do público estudante. Prejudica o LCP.
- **Recomendação:** recodificar cada vídeo em H.264/MP4 (e opcionalmente WebM/AV1), 720p no máximo, 6–10 s em loop, sem áudio, mirando ≤ 1,5 MB cada. Adicionar `poster` (WebP do primeiro quadro) e `preload="none"`/`"metadata"`. No celular, renderizar só um `<video>` (condicionar com `matchMedia` em vez de esconder com CSS). Converter as fotos da diretoria para WebP com `<picture>`, como já foi feito em eventos e hackathons.

### A5. A primeira dobra não diz o que é a LAMIT, e o CTA principal manda para fora
- **Evidência:** `Home.jsx:11-34`: o hero é só vídeo, sem título nem texto. O único texto da primeira dobra é "Acesse Nossos Links", que leva para `linktr.ee` em nova aba (screenshot `home-1440-00`). O H1 ("INOVAÇÃO, TECNOLOGIA E COMUNIDADE.") só aparece depois da faixa azul.
- **Impacto:** dos três públicos do `PRODUCT.md`, estudante e patrocinador chegam sem resposta para "o que é isso e o que eu faço aqui". O gesto mais forte da página tira a pessoa do site e entrega a um agregador de links, o contrário do princípio de "hub de centralização".
- **Recomendação:** manter o vídeo e o CTA (decisões do usuário), mas sobrepor ao hero um bloco mínimo, alinhado à esquerda sobre uma máscara escura no terço inferior: kicker "Liga acadêmica · UCSal", H1 curto (pode ser "Maratonas, inovação e tecnologia na UCSal") e uma linha de apoio. Trocar o rótulo do CTA por algo que diga o destino, por exemplo "Todos os nossos links ↗", com a seta de link externo, que é a mesma convenção da loja ("LAMIT ↗", "Instagram ↗").

### A6. A experiência profissional dos diretores só aparece no hover do desktop
- **Evidência:** `DirectorBanner.jsx:12` passa `experience` só como legenda do TiltedCard; `TiltedCard.css:20-27` esconde a legenda com `display: none` abaixo de 640 px; a legenda depende de `onMouseEnter` (`TiltedCard.jsx:65-68`), sem equivalente para foco ou toque.
- **Impacto:** "Product Analyst at Ford", "System Engineer at Ford", "Professor na UCSal" são a ponte com o mercado que o `PRODUCT.md` chama de diferencial. No celular, no toque e no teclado essa informação simplesmente não existe, e com `display: none` também some para leitores de tela.
- **Recomendação:** mostrar `experience` como texto fixo no bloco de conteúdo, abaixo do nome (por exemplo `0.85rem`, branco 80%), e deixar a legenda que segue o cursor como enfeite redundante no desktop. Traduzir "at" para "na" ("Product Analyst na Ford").

### A7. Contraste insuficiente sobre as zonas âmbar do Grainient
- **Evidência:** medido contra `#C17402` (o âmbar do Grainient; nos picos fica mais claro, por volta de `#E8820A`):
  - branco 100%: 3,64:1 (cai para 2,75:1 nos picos);
  - descrição dos diretores `rgba(255,255,255,.82)` (`style.css:661`): ~2,9:1;
  - cargo `rgba(255,255,255,.72)` (`style.css:645`): ~2,3:1;
  - índice dourado `#d7c06b` (`style.css:638`): ~2,0:1;
  - e-mail `#ffbb00` em `/contato` (`style.css:467`): 2,14:1;
  - e-mail no celular, `#a3a3a3` (`style.css:766`): 1,44:1.

  Os screenshots `diretoria-1440-00/01`, `contato-1440-00` e `contato-375-00` mostram texto pequeno sobre a faixa laranja. Para comparar, o dourado sobre o azul da Home (`#081536`) dá 9,94:1.
- **Impacto:** falha WCAG 1.4.3 (AA, 4,5:1) no texto de corpo. Como o gradiente se mexe, a legibilidade muda com o tempo e com a posição na tela, e piora no celular, onde a faixa âmbar cai no centro.
- **Recomendação:** sem tirar o Grainient: (1) um "véu" de leitura atrás dos blocos de texto, por exemplo `background: linear-gradient(90deg, rgba(0,0,0,.45), transparent)` em `.director-banner__content`, que não é sombra; (2) texto de corpo em branco 100% com ≥ 1rem sobre o Grainient; (3) o e-mail de `/contato` em branco sublinhado, deixando o ouro para fundos azuis; (4) se preciso, baixar `colorBalance`/`contrast` do `GrainientBackground` para o âmbar ocupar menos área.

---

## Achados de prioridade MÉDIA

### M1. Rodar a roda do mouse sobre o carrossel mexe a página e o carrossel ao mesmo tempo
- **Evidência:** `HackathonCarousel.jsx:63-75` chama `e.preventDefault()` dentro do `onWheel` do React, que é passivo. O console mostra "Unable to preventDefault inside passive event listener". No teste, 6 movimentos de roda sobre o carrossel rolaram a página 720 px **e** avançaram de 01 para 02.
- **Impacto:** a foto troca sem querer enquanto a pessoa só está passando pela seção. A intenção (sequestrar a rolagem vertical) também seria um anti-padrão.
- **Recomendação:** não tratar `deltaY` no carrossel. Reagir só a `deltaX` (trackpad horizontal), arraste e setas, e deixar a rolagem vertical sempre com a página.

### M2. A página atual some do menu em vez de ser destacada
- **Evidência:** `Navbar.jsx:14` filtra a página atual. Por isso os links mudam de posição a cada página ("DIRETORIA" fica em x≈578 na Home e x≈722 em `/contato`), e não existe `aria-current`.
- **Impacto:** o visitante perde a referência de onde está, e o menu "pula" a cada navegação. A loja e a maioria dos sites mantêm a lista estável.
- **Recomendação:** sempre mostrar os quatro links e marcar o atual com `aria-current="page"` e com o sublinhado laranja fixo (o mesmo `::after` do hover). Avaliar trocar "HOME" por "INÍCIO", já que o logo também leva à Home.

### M3. O menu mobile não fecha com Esc, não prende o foco e esconde a marca
- **Evidência:** `Navbar.jsx` não tem handler de teclado. No teste, Esc não fechou o menu. O overlay (`style.css:850-866`, `z-index: 15`) cobre o logo (`z-index: 10`), e o rodapé fixo continua visível por cima (screenshot `x-mobile-menu`). O fundo continua rolável por trás.
- **Impacto:** é uma armadilha para quem usa teclado ou leitor de tela, e o overlay fica sem identidade visual.
- **Recomendação:** Esc fecha; o foco vai para o primeiro link ao abrir e volta para o botão ao fechar; o foco fica preso dentro do menu; travar a rolagem do fundo; subir o logo acima do overlay; fechar ao trocar de rota.

### M4. Ordem de foco e marcos de página
- **Evidência:** o `Footer` é renderizado antes do conteúdo (`Home.jsx:29`, `Diretoria.jsx:68`, `Contato.jsx:53`). No teste de Tab, a sequência é logo → menu → CREDITS → 4 ícones sociais → só depois "Acesse Nossos Links". Não há link "pular para o conteúdo". Home, Contato e Shop não têm `<main>`; o rodapé é `<div>`, não `<footer>`; o menu é `<div>`, não `<nav>`.
- **Impacto:** cinco Tabs a mais por página antes do conteúdo, e navegação por marcos quebrada para leitor de tela.
- **Recomendação:** renderizar `Footer` depois do conteúdo, envolver o conteúdo em `<main id="conteudo">`, usar `<header>`, `<nav aria-label="Principal">` e `<footer>`, e adicionar um skip link visível no foco.

### M5. Formulário de contato: validação via modal, um erro por vez e regras restritivas demais
- **Evidência:** `Contato.jsx:25-31` valida campo a campo e mostra cada erro num modal do SweetAlert (screenshot `x-form-error-empty`). Quando o modal fecha, o foco vai para o botão "ENVIAR", não para o campo com problema. `validation.js:11-13` rejeita `+55 71 99999-9999` ("Por favor insira um telefone válido"); `validation.js:6-9` rejeita "João da Silva Jr.". O telefone é obrigatório. Nenhum campo indica que é obrigatório, e não há `aria-invalid`/`aria-describedby`.
- **Impacto:** atrito e abandono, principalmente de patrocinadores (telefone com DDI, nome com abreviação). Corrigir quatro campos pode custar quatro modais.
- **Recomendação:** mensagens inline abaixo de cada campo, em texto e com borda laranja, todas de uma vez no submit, com foco no primeiro campo inválido; `required` e `autocomplete` (`name`, `email`, `tel`); telefone **opcional**, com validação tolerante (só dígitos, de 10 a 13); nome aceitando `.`; um campo "Assunto" com opções ("Quero participar", "Parceria/patrocínio", "Imprensa", "Outro"), que também atende M9.

### M6. Formulário sem estado de carregamento e com risco de envio duplicado
- **Evidência:** com a resposta do formsubmit atrasada em 1,5 s, o botão continuou habilitado e com o texto "ENVIAR" durante o envio (`Contato.jsx:33-46`). O sucesso diz só "Sua mensagem foi enviada com sucesso" (screenshot `x-form-success`) e não diz o que acontece depois.
- **Impacto:** cliques repetidos geram mensagens duplicadas, e a pessoa não sabe se ou quando vai receber resposta.
- **Recomendação:** desabilitar o botão e mostrar "Enviando…" com `aria-busy`; no sucesso, uma mensagem inline no lugar do formulário ("Recebemos sua mensagem. Respondemos pelo e-mail informado em até X dias úteis."); no erro, oferecer o e-mail como alternativa no próprio texto.

### M7. O e-mail não é link, não dá para selecionar e o aviso de cópia fica ilegível
- **Evidência:** `Contato.jsx:94`: o e-mail é um `<button>` que copia para a área de transferência, sem `mailto:`. `style.css:49-52` aplica `user-select: none` em `html, body`, então o texto não pode ser selecionado. O modal de confirmação (`swal.js:25-36`) usa fundo transparente e nenhum backdrop, e o texto "O endereço foi copiado" fica por cima dos campos do formulário (screenshot `x-copy-email`). O hover muda para `rgb(79,79,251)` (`style.css:473`), cor fora da paleta com 2,12:1 sobre o azul.
- **Impacto:** quem quer abrir o cliente de e-mail ou copiar manualmente não consegue, e quem clica não entende de cara que o clique copia.
- **Recomendação:** transformar em `<a href="mailto:contato.lamit@gmail.com">` e pôr um botão secundário "Copiar" ao lado; trocar a confirmação por um toast inline com `aria-live`; tirar o `user-select: none` global (ele também impede copiar nomes e textos institucionais); hover em laranja, a cor de interação do sistema.

### M8. Ícones sociais pequenos demais para toque, e CREDITS inacessível em `/contato` no celular
- **Evidência:** a 375 px, os ícones medem 25×18 px de área clicável (`style.css:722-726`, imagem de 15 px), abaixo do mínimo de 24×24 do WCAG 2.5.8 e dos 44 px recomendados. O botão CREDITS mede 61×16. Em `/contato` no celular, `.contact_msg` cobre o CREDITS e o clique não chega ao botão (o Playwright reportou interceptação de ponteiro).
- **Impacto:** toques errados nas redes sociais, que são justamente o canal que o site mais empurra, e um controle que existe mas não pode ser usado.
- **Recomendação:** áreas de toque de 44×44 com ícone de 20–24 px, como os círculos de 44 px do rodapé da loja; resolver o empilhamento (rodapé com `z-index` acima do conteúdo, ou estático, conforme A1).

### M9. Não existe caminho para patrocinadores e parceiros
- **Evidência:** `PRODUCT.md` lista "patrocinadores, parceiros e a universidade" como público. Nenhuma página tem CTA, texto ou opção de contato para parceria; a Home termina em "Entrar na comunidade" (estudantes) e `/contato` tem só "Deixe uma mensagem".
- **Impacto:** um dos três públicos fica sem próximo passo, e o site perde a chance de converter a credibilidade que constrói (eventos com 100 a 180 pessoas, diretoria ligada à Ford).
- **Recomendação:** um bloco curto antes do rodapé da Home ou em `/contato` ("Quer apoiar a LAMIT? Fale com a diretoria sobre parcerias e patrocínios"), que leve a `/contato?assunto=parceria` com o assunto já preenchido (ver M5). Usar só dados reais que já estão no site.

### M10. "Entrar na comunidade" não avisa que abre o WhatsApp
- **Evidência:** `CommunityCTA.jsx:16-23` + `data/home.js:75-77` (link `chat.whatsapp.com`). O rótulo e o texto falam em "grupo", sem dizer que é WhatsApp nem mostrar o indicador de link externo.
- **Impacto:** a troca de contexto (abre o app, pede para entrar num grupo) pega o visitante de surpresa, e quem não usa WhatsApp não sabe antes de clicar.
- **Recomendação:** "Entrar no grupo do WhatsApp ↗", ou manter "Entrar na comunidade" e adicionar uma linha de apoio "Grupo aberto no WhatsApp". Mesma convenção ↗ da loja.

### M11. `/shop` "Coming Soon" é um beco sem saída
- **Evidência:** `Shop.jsx:12-14`: só um H1 "Coming Soon", em inglês, a 1,5 rem (`style.css:419-422`), centralizado sobre o Grainient, sem contexto, sem próximo passo e sem citar a Lamit Store (screenshots `shop-1440-00`, `shop-375-00`). Enquanto isso, a loja já existe em desenvolvimento com identidade própria (screenshot `store-1440-top`).
- **Impacto:** quem clica em "SHOP" não sabe o que vem, quando vem nem como acompanhar, e sai sem ação. O site é o único ponto do ecossistema que menciona a loja e não aproveita isso.
- **Recomendação (mantendo o "Coming Soon"):** compor como teaser: kicker "LAMIT Store" (ouro, caixa alta), "Coming Soon" em tamanho de display (o mesmo `clamp(2.7rem, 6vw, 5rem)` de "Diretoria"), uma linha em pt-BR com o que já é público no `PRODUCT.md` ("A loja oficial da LAMIT está chegando. Primeiro drop: camisetas e ecobags."), e CTA "Acompanhe no Instagram ↗", que é o mesmo padrão da loja. Sem preços nem imagens de produto até a loja publicar (Princípio 4). Quando a loja for ao ar, esse CTA vira "Ir para a Lamit Store ↗".

### M12. Títulos de página inconsistentes entre as rotas
- **Evidência:** "Diretoria" usa `clamp(2.7rem, 6vw, 5rem)` com kicker (`style.css:549-553`); "Deixe uma mensagem" e "Coming Soon" usam o H1 genérico de 1,5 rem (`style.css:419-422`), ou seja, menos que um H3 da Home. Em `/contato` o título fica solto no canto (`#titleContainer`, `style.css:408-417`, posicionado com `absolute` e porcentagens) e o bloco do e-mail fica à direita, com um vazio grande no meio a 1440 px (screenshot `contato-1440-00`).
- **Impacto:** cada página parece de um site diferente, e Contato e Shop parecem inacabadas ao lado da Diretoria.
- **Recomendação:** um padrão único de cabeçalho de página (kicker ouro + H1 display + intro de uma linha), reaproveitando `.diretoria-hero` como componente `PageHero`. Em `/contato`, um grid de duas colunas (form | contato direto) dentro de um container com `max-width`, em vez de três peças com `position: absolute`.

---

## Achados de prioridade BAIXA

### B1. Mesmo `<title>` em todas as rotas, e sem metadados de compartilhamento
`index.html:11`, sem atualização por rota. Abas e histórico ficam todos iguais, e compartilhar em WhatsApp ou LinkedIn não gera prévia. **Recomendação:** `document.title` por página ("Diretoria · LAMIT", "Contato · LAMIT") e `og:title/description/image`. A loja já tem `assets/og/`, que pode servir de referência.

### B2. Microcopy em inglês e textos alternativos errados
"CREDITS" (`Footer.jsx:7`), "Coming Soon" (decisão mantida, mas recomenda-se uma linha de apoio em pt-BR, ver M11), "at Ford" (`Diretoria.jsx:12, 21`), o modal de créditos em inglês e possivelmente desatualizado ("Web Designer by Guilherme Mota", "Pictures by Mike FILLIPPOV", `swal.js:8-10`). Os `alt` dos ícones são `bandcampicon` (no ícone do Linktree), `instagramIcon` etc. (`Footer.jsx:10-19`), e o leitor de tela anuncia "bandcampicon". **Recomendação:** "Créditos"; `aria-label="LAMIT no Instagram (abre em nova aba)"` no link e `alt=""` na imagem; revisar o conteúdo dos créditos com a diretoria de comunicação.

### B3. Grafia inconsistente de UCSal e caixa do H1
A Home usa "UCSAL" (`AboutSection.jsx:25`, `data/home.js:49, 54`); a Diretoria e o `PRODUCT.md` usam "UCSal". O H1 da Home está digitado em caixa alta no código ("INOVAÇÃO, TECNOLOGIA E COMUNIDADE.", `AboutSection.jsx:22`), enquanto os outros títulos da mesma página estão em caixa normal, o que contraria a nova regra de "títulos seguem a caixa do conteúdo". O rodapé da loja usa "Inovação, tecnologia e comunidade.". **Recomendação:** padronizar "UCSal" e escrever o H1 em caixa normal.

### B4. Os rótulos dos pilares estão centralizados e o texto alinhado à esquerda
`.home-about__pillar-label` (`home.css:93-98`) herda `text-align: center` do `body` (`style.css:56`), mas o texto abaixo está à esquerda (screenshots `home-1440-01`, `home-375-01`). **Recomendação:** `text-align: left` em `.home-about__pillar`.

### B5. Fotos de eventos arredondadas encostadas na borda da janela
`.home-event__media` com `border-radius: var(--radius-lg)` (`home.css:327-331`), mas a coluna começa em x=0, então os cantos arredondados encostam na borda da tela e parecem acidentais (screenshot `home-1440-03`). **Recomendação:** arredondar só os cantos internos, ou dar à lista uma margem lateral igual à do texto (`clamp(24px, 6vw, 96px)`) para a foto "flutuar" como os cards da loja.

### B6. Kicker "LAMIT" da Diretoria com tamanho exagerado no desktop
`.diretoria-kicker` com `font-size: 2rem` (`style.css:544`) no desktop contra `0.72rem` no celular (`style.css:894`). Nos outros kickers é `0.9rem`. A 1440 px o kicker compete com o H1 (screenshot `diretoria-1440-00`). **Recomendação:** `0.9rem`, igual aos outros kickers.

### B7. Fotos da diretoria pequenas no celular
`.director-banner__media { min-height: 280px }` (`style.css:915-917`) com `object-fit: contain` (`TiltedCard.css:545`): a pessoa ocupa ~110 px de largura numa tela de 375 (screenshots `diretoria-375-00/02`). **Recomendação:** no celular, `min-height: 360px` e enquadramento mais fechado (`object-position: center top`) ou um recorte específico.

### B8. Barra de rolagem oculta
`::-webkit-scrollbar { width: 0.1px }` (`style.css:92-94`). No desktop não há indicação de que a página continua nem de quanto falta, o que pesa mais porque o hero ocupa a tela inteira. **Recomendação:** manter a barra nativa ou uma barra fina estilizada; se ficar oculta, colocar uma pista de rolagem no hero (seta ou "Role para conhecer").

### B9. Títulos com `white-space: nowrap`
`.home-carousel__title` e `.home-events__title` (`home.css:141, 301`) usam `nowrap` com `clamp(1rem, 6vw, 3rem)`. Em telas estreitas, ou com fonte ampliada (zoom só de texto, WCAG 1.4.4), o título vaza ou fica pequeno demais. **Recomendação:** tirar o `nowrap` e usar `text-wrap: balance`.

### B10. Avisos de console e dívida técnica de UI
Avisos de "future flag" do React Router v7 e o erro de `preventDefault` passivo (M1). O CSS de mobile do SweetAlert (`style.css:674-720`) tem posicionamentos frágeis (`left: 90px`, `width: 500px !important` numa tela de 375). **Recomendação:** ativar os future flags; ao migrar os feedbacks do formulário para inline (M5–M7), remover a maior parte da customização do SweetAlert.

---

## Consistência com a Lamit Store

| Aspecto | Site | Loja | Leitura |
|---|---|---|---|
| Tipografia | Montserrat 800, kickers ouro com tracking largo | Igual | Alinhado (mudança recente bem-sucedida) |
| Cabeçalho | Logo e links fixos, sem fundo | Barra fixa com fundo, links 0,9 rem | Divergente: ver A1 |
| Página atual | Some do menu | Lista estável | Divergente: ver M2 |
| Links externos | Sem indicação | Seta "↗" | Adotar ↗ no site (A5, M10) |
| Rodapé | Fixo, ícones 15–24 px, "CREDITS" | Estático, ícones em círculos de 44 px, colunas com rótulos | Divergente: ver A1, M8 |
| Ligação entre os dois | `/shop` não cita a loja | "LAMIT ↗" vai para o Linktree, não para o site | O ecossistema não se liga nos dois sentidos |

**Recomendação de ecossistema:** quando os dois estiverem publicados, o "LAMIT ↗" da loja deve apontar para o site institucional, e o `/shop` do site para a loja (M11). Até lá, os dois podem compartilhar o mesmo rodapé (redes em círculos de 44 px + "2026 LAMIT").

---

## Quick wins (baixo esforço, alto retorno)

1. `ScrollToTop`: rolar também o `document.body` (A2). Uma linha.
2. `poster` + `preload="none"` nos vídeos, e deixar de renderizar os três vídeos escondidos no celular (A4).
3. Respeitar `prefers-reduced-motion` nos vídeos, no Grainient e no TiltedCard (A3).
4. Mostrar `experience` como texto fixo no `DirectorBanner` (A6).
5. Tirar `e.preventDefault()`/`deltaY` do `handleWheel` do carrossel (M1).
6. Manter os quatro links no menu, com `aria-current` + sublinhado laranja (M2).
7. Esc fecha o menu mobile (M3).
8. Botão "Enviando…" desabilitado durante o submit; telefone opcional e aceitando `+55` (M5, M6).
9. E-mail como `mailto:` e sem `user-select: none` global (M7).
10. `alt`/`aria-label` corretos nos ícones sociais; "CREDITS" → "Créditos"; "at" → "na" (B2).
11. `text-align: left` nos pilares e kicker da Diretoria a 0,9 rem (B4, B6).
12. `document.title` por rota (B1).

## Evidências (screenshots no scratchpad da sessão, fora do repositório)

`home-1440-00..06`, `home-375-00..06`, `diretoria-1440-00..04`, `diretoria-375-00..04`, `contato-1440-00`, `contato-375-00..01`, `shop-1440-00`, `shop-375-00`, `x-nav-scroll-restore`, `x-mobile-menu`, `x-form-error-empty`, `x-form-error-phone`, `x-form-success`, `x-copy-email`, `x-focus-2`, `e-*` (1280×650, 1024×768, 768×1024), `store-1440-top/bottom`, `store-375-top/bottom`. Scripts: `audit/shots.cjs`, `audit/interact.cjs`, `audit/extra.cjs`, `audit/store.cjs`.
