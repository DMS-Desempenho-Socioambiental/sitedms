# Frontend — guia de manutenção

Todos os caminhos abaixo são relativos a `frontend/public/`, a pasta publicada na hospedagem. O servidor de desenvolvimento fica fora dela, em `frontend/scripts/dev-server.js`.

## Arquivos principais

| Caminho | Função |
| --- | --- |
| `index.html` | Página principal, na ordem do menu: quem somos (`#sobre`), valores (`#valores`), atuação (`#atuacao`), padrões internacionais e padrões de desempenho IFC (`#padroes`), soluções (`#solucoes`), parcerias (`#parcerias`), projetos na prática (`#projetos`) e contato (`#contato`) |
| `time.html` | Página da equipe |
| `css/styles.css` | Todos os estilos. As seções redesenhadas ficam em blocos próprios no fim do arquivo (atuação, padrões, IFC, soluções, setores, clientes, projetos, contato e rodapé); ajustes de uma seção devem ser feitos no bloco dela |
| `js/main.js` | Ponto de entrada; importa e inicializa cada módulo de `js/modules/` |
| `js/config.js` | URL da API (local em `localhost`, produção nos demais casos) |
| `assets/`, `assets_new/` | Imagens, ícones e logos |
| `robots.txt`, `sitemap.xml` | SEO técnico |
| `_qa-viewport.html` | Harness de QA: `http://localhost:5500/_qa-viewport.html?w=390` renderiza o site num iframe com a largura desejada |
| `demo.html`, `css/demo-styles.css` | Versão antiga de demonstração (`noindex`), não linkada no site |

O JavaScript usa ES modules (`<script type="module">`), então as páginas precisam ser abertas por um servidor HTTP (`npm run dev`, dentro de `frontend/`), não com duplo clique no arquivo.

## Design system (resumo)

- **Fontes:** [Archivo](https://fonts.google.com/specimen/Archivo) para títulos/botões e [Inter](https://fonts.google.com/specimen/Inter) para texto, via Google Fonts (`var(--font-display)` / `var(--font-body)`).
- **Cores (tokens em `:root`):** `--navy #002060`, `--blue #0165b6`, `--sky/--ice` para fundos claros, `--muted` para texto secundário.
- **Breakpoints principais:** 1080/1081px (colapso de grids e menu hambúrguer), 900/901px (títulos e cards), 860/861px (mapa de atuação), 700px (layout mobile), 480px (listas em coluna única, títulos menores), 1440px e 1920px (telas largas).
- **Animações:** reveals de 420ms com stagger via `nth-child`; tudo respeita `prefers-reduced-motion`.
- **Linha condutora:** nasce no `.about-decor` do "Quem somos" e segue pela faixa lateral direita das demais seções, em `<div class="section-line">` (um por seção). Todos usam a mesma caixa de coordenadas da grade do "Quem somos" (mesma largura em cada breakpoint) e `viewBox="0 0 1000 1000"`, então o x onde um trecho termina é o x onde o próximo começa. Os traçados ficam entre 900 e 992 da caixa, fora da área de conteúdo. O ponto de cada seção (`.section-line-dot`) é posicionado em % dessa caixa, sempre sobre a curva. Em fundo escuro use `.section-line--claro`. A linha corre atrás do conteúdo e some abaixo de 1081px.

## Como editar conteúdo

- **Membro do time:** duplique um `<article class="team-card">` em `time.html`. Foto em `assets/team/` (usar `.webp`, ~640px de largura). LinkedIn: `<a class="team-link" href="URL">` (com link) ou `<span class="team-link">` (oculto).
- **Logos de clientes/parceiros:** salve o arquivo em `assets/logos/<setor>/<clientes|parceiros>/` (ou `assets/logos/geral/`) e adicione um `<img>` na nuvem `.logo-cloud` de "Parceiros, Clientes e Projetos" em `index.html`. O `alt` é o nome exibido.
- **Instituições de "Padrões internacionais":** arquivos em `assets/institutions/`, exibidos em cartões brancos na grade `.institution-row`.
- **Vídeos de Projetos na prática:** duplique um `<article class="project-card">` dentro de `.projects-gallery` em `index.html` e troque:
  - o ID do vídeo do YouTube em `data-video-id` e na URL da miniatura (`https://i.ytimg.com/vi/<ID>/maxresdefault.jpg`);
  - o título (`h3`), o parágrafo de descrição e o texto do `aria-label` do botão (`Assistir ao vídeo: <título>`);
  - a imagem do QR Code, salva em `assets/experiences/qrcodes/` e apontando para `https://youtu.be/<ID>`, e seu `alt`.

  O vídeo só é carregado quando a pessoa clica na miniatura, e apenas um toca por vez (`js/modules/project-videos.js`). No celular o QR Code fica oculto, já que a pessoa já está no próprio aparelho.
- **Série #DMSInsights:** o último card da galeria lista os episódios em `<ol class="project-series">`. Cada `<button class="project-episode" data-video-id="...">` toca o episódio no player do próprio card. Para incluir um episódio novo, duplique um `<li>` e atualize o número, o título e o `data-video-id`; o QR Code (`assets/experiences/qrcodes/dms-insights.png`) aponta para a playlist inteira.
- **Cards dos padrões IFC:** giram no hover (desktop) e no clique, que também desvira (`js/modules/ifc-cards.js`).
- **Assuntos do formulário:** atualize o `<select>` em `index.html` **e** `CONTACT_SUBJECTS` em `backend/src/validators/contact.validator.js`.
- **Endereço da API:** `js/config.js` (e o `action` do formulário em `index.html`).
- **reCAPTCHA v2:** a chave do site fica em `RECAPTCHA_SITE_KEY`, em `js/config.js` (é pública por natureza); a chave secreta fica só no `.env` do backend (`RECAPTCHA_SECRET_KEY`). O widget é carregado quando o formulário se aproxima da tela e o botão de envio só habilita depois da confirmação (`js/modules/recaptcha.js`).

## Performance

- Imagens grandes foram convertidas/redimensionadas (WebP para fotos do time, mapa e ilustrações; JPEG progressivo para fundos). Ao adicionar imagens novas, mantenha **≤200 KB** e largura ≤1600px.
- `loading="lazy"` + `decoding="async"` em tudo que fica abaixo da dobra.
- Compressão e HTTPS ficam a cargo do GitHub Pages. O `.htaccess` só teria efeito numa hospedagem Apache e é ignorado pelo Pages.
- Fontes com `display=swap` e `preconnect`.

## SEO

- Meta description, canonical, Open Graph/Twitter cards e JSON-LD (`ProfessionalService`) nos `<head>` das duas páginas. Os dois blocos JSON-LD usam o mesmo `@id` (`https://dmsocioambiental.com/#organization`); o de `time.html` lista também a equipe em `employee` (nome, cargo, foto e LinkedIn) — ao incluir, remover ou alterar alguém no time, atualize também esse bloco.
- `robots.txt` e `sitemap.xml` na raiz de `public/` — atualize o sitemap ao criar páginas novas e o `<lastmod>` da página ao alterar o conteúdo dela.
- `demo.html` e `_qa-viewport.html` têm `noindex` e não entram no sitemap.
- Imagem de compartilhamento: `assets/og-image.jpg` (1200×630).
- Se o domínio mudar, buscar/substituir `dmsocioambiental.com` em `index.html`, `time.html`, `robots.txt`, `sitemap.xml` e `CNAME`, e atualizar `ALLOWED_ORIGINS` no backend.
