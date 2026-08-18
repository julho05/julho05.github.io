# Central Contabilidade — site institucional

Site estático em HTML, CSS e JavaScript puro. **A pasta do projeto é o site.**
Não há build, não há compilação: o `index.html` que você edita é o mesmo arquivo
que vai para o servidor.

---

## Como abrir o site

Dê **duplo clique em `abrir-site.cmd`**. Ele sobe um servidor local e abre o
navegador em `http://localhost:4321`. Deixe a janela preta aberta enquanto
navega; para encerrar, feche a janela.

Alternativas equivalentes: **Live Server** do VS Code (botão *Go Live*),
`node _build/ferramentas/servidor.js` ou qualquer outro servidor estático.

### ⚠️ Não abra o `index.html` com duplo clique

Abrir o arquivo direto usa o protocolo `file://`, e aí **o site aparece sem
estilo nenhum** — só texto e links azuis. Não é defeito do site.

Dois motivos:

1. Os caminhos dos arquivos são absolutos (`/css/style.css`). Em `file://`, a
   barra inicial aponta para a **raiz do disco**, então o navegador procura
   `D:\css\style.css` — que não existe.
2. Os links internos apontam para pastas (`/quem-somos/`). Em `file://` o
   navegador mostra a listagem da pasta em vez de abrir o `index.html` de
   dentro. Só um servidor faz isso.

Os caminhos são absolutos de propósito: as páginas ficam em profundidades
diferentes (`/quem-somos/`, `/contabilidade-especializada/comercio/`,
`/blog/page/2/`), e caminho relativo exigiria um número diferente de `../` em
cada uma. Com caminho absoluto, funciona igual em toda página do servidor real
— que é como o site vai rodar na hospedagem.

Para publicar: suba **todos os arquivos da raiz, exceto `_build/`,
`README.md` e `abrir-site.cmd`** — ou use o empacotador, que já exclui os três.

---

## Estrutura

```
centra-contabilidade/
│
├── index.html                    ← ARQUIVO PRINCIPAL (a home)
├── 404.html
├── sitemap.xml
├── robots.txt
│
├── css/style.css                 design system completo
├── js/main.js                    menu, FAQ, máscara de telefone, formulários
├── img/                          logo, favicons
│   └── blog/                     230 imagens dos posts
│
├── quem-somos/index.html         páginas institucionais
├── contato/index.html
├── orcamento/index.html
├── politica-de-privacidade/index.html
├── abrir-empresa/index.html      landings de alta intenção
├── migrar-empresa/index.html
├── contabilidade-em-sao-bento-do-sul/index.html
├── central-contabilidade-em-santa-catarina/index.html
│
├── contabilidade-especializada/  índice + 6 segmentos
│   ├── index.html
│   ├── comercio/
│   ├── industria/
│   ├── prestadores-de-servicos/
│   ├── contabilidade-para-condominios/
│   └── administradora-de-bens-e-holding-familiar/
│
├── blog/                         índice paginado (20 páginas)
│   ├── index.html
│   └── page/2..20/
│
├── <233 pastas de post>/         um por artigo, cada uma com index.html
│
├── _build/                       ferramentas — NÃO publicar
└── README.md
```

### Por que os 233 posts ficam soltos na raiz

Porque é **exatamente** onde estavam no WordPress antigo. Manter `/nome-do-post/`
na raiz é o que dispensa qualquer redirect e preserva todo o posicionamento já
conquistado no Google.

Movê-los para `/blog/nome-do-post/` deixaria a pasta mais bonita, mas exigiria
233 redirects 301 no servidor e semanas de reindexação. Não vale a troca.

---

## Editando o site

**Toda página é um `.html` completo.** Abra, edite, salve, atualize o navegador.
Não precisa rodar nada.

### Mudar o menu, o telefone, o endereço, o rodapé, os ícones ou a fonte

Essas partes se repetem nas 270 páginas. O fluxo é:

1. Edite **`index.html`** — ele é a referência
2. Rode:

```bash
node _build/ferramentas/sincronizar-layout.js
```

Isso copia do `index.html` para as outras 269 páginas:

- o **cabeçalho** (barra de contato, logo, menu)
- o **rodapé** (contatos, redes, links)
- o **bloco comum da `<head>`** — favicons, fontes e CSS

O conteúdo de cada página não é tocado, e o item ativo do menu é ajustado
sozinho. Título, description, canonical e tags `og:` também são preservados,
porque são próprios de cada página.

O bloco comum da `<head>` é delimitado por comentários no `index.html`:

```html
<!-- inicio bloco comum -->
<link rel="icon" href="/favicon.ico" sizes="32x32">
...
<link rel="stylesheet" href="/css/style.css">
<!-- fim bloco comum -->
```

Para adicionar algo a todas as páginas (Google Analytics, Search Console,
Pixel do Facebook), coloque dentro desses marcadores e sincronize.

Antes de aplicar, dá para conferir o que mudaria:

```bash
node _build/ferramentas/sincronizar-layout.js --conferir
```

### Mudar cores, fontes ou espaçamentos

Tudo em `css/style.css`, nos tokens do `:root` no topo do arquivo. As duas cores
da marca foram extraídas da logo oficial:

| Token | Valor | Uso |
|---|---|---|
| `--azul` | `#00209C` | Cor institucional, botões, links |
| `--cinza` | `#919191` | Cor secundária |

### Trocar o favicon ou a logo

```bash
powershell -File _build/gerar-favicons.ps1
node _build/ferramentas/sincronizar-layout.js
```

O script recorta o símbolo da logo oficial (`img/LOGO-CENTRAL-CONTABILIDADE.png`)
e gera `favicon.ico` (16, 32 e 48px), `img/favicon-512.png` e
`img/apple-touch-icon.png`.

O ícone usa **fundo azul sólido com o símbolo em branco**, não o símbolo azul
sobre transparente. Motivo: em tamanho de aba o traço fino do swoosh
praticamente desaparece, e sobre fundo transparente ele some de vez em abas
escuras. Com o fundo sólido, o ícone lê bem em qualquer tema.

O `favicon.ico` fica **na raiz do site** de propósito: navegadores pedem
`/favicon.ico` automaticamente, mesmo sem tag no HTML. Sem esse arquivo, o
pedido dá 404 — e o Chrome guarda esse 404 em cache, o que faz o ícone não
aparecer mesmo depois de corrigido. Se isso acontecer durante o
desenvolvimento, force o recarregamento com `Ctrl+Shift+R` ou abra numa janela
anônima.

### Criar uma página nova

1. Copie uma pasta existente (ex.: `abrir-empresa/`) com um nome novo
2. Edite o `index.html` de dentro: `<title>`, `<meta name="description">`,
   `<link rel="canonical">`, as tags `og:` e o conteúdo do `<main>`
3. Acrescente a URL na lista `FIXAS` de `_build/geradores/seo.js`
4. Rode `node _build/gerar-blog.js` para atualizar o `sitemap.xml`

### Publicar um post novo no blog

Copie a pasta de um post existente, troque o conteúdo, e adicione o card no
`blog/index.html`. Para muitos posts seguidos, vale escrever um gerador que leia
Markdown — o blog está parado desde setembro de 2024, então não foi feito.

---

## Quando o blog precisa ser regerado

Só se o conteúdo dos posts mudar:

```bash
node _build/gerar-blog.js
```

Reescreve as 233 páginas de post, as 20 do índice, o `sitemap.xml` e o `404.html`.
O cabeçalho e o rodapé são lidos do próprio `index.html`, então o resultado sai
igual ao resto do site — não existe uma segunda fonte da verdade para desencontrar.

**Cuidado:** este comando sobrescreve as páginas dos posts. Se você editou algum
post à mão, a edição se perde.

---

## Formulários

**Não há backend.** Ao enviar, o JavaScript valida os campos, monta uma mensagem
formatada e abre o WhatsApp da empresa com o texto pronto — a solução mais
confiável para um site estático, já que nenhuma mensagem se perde num servidor
de e-mail mal configurado.

Para trocar por envio real, edite `iniciarFormularios()` em `js/main.js`.
O número de destino está na constante `WHATSAPP`, no mesmo arquivo.

---

## Ferramentas

Ficam em `_build/` e **nunca vão para o servidor**. São 13 arquivos `.js` que
rodam na sua máquina. O site publicado tem **um único** arquivo JavaScript:
`js/main.js`, com 8,7 KB.

```bash
node _build/ferramentas/servidor.js                          # servidor local
node _build/ferramentas/sincronizar-layout.js [--conferir]   # propaga cabeçalho/rodapé
node _build/gerar-blog.js                                    # regera o blog
node _build/ferramentas/teste-mobile.js 390 .                # varredura mobile
node _build/ferramentas/diagnostico-overflow.js <url> 414    # overflow horizontal
node _build/ferramentas/diagnostico-menu.js 390 .            # geometria do menu
node _build/ferramentas/teste-revelar.js <url>               # animação de entrada
node _build/ferramentas/screenshot.js <url> 414 saida.png 1  # captura emulada
```

`_build/migracao/` guarda os scripts que trouxeram o conteúdo do WordPress, e
`_build/cache/` os posts baixados. Não apague o cache se pretende regerar o blog.

O `screenshot.js` usa emulação real de dispositivo. O flag `--screenshot` do
Chrome **não** respeita o meta viewport e produz recortes enganosos — não use
ele para avaliar layout mobile.

---

## Armadilhas do mobile (não reintroduzir)

### `backdrop-filter` no cabeçalho

O `.cabecalho` tem `backdrop-filter: blur(12px)` para o efeito de vidro.
**Isso cria um bloco contentor para descendentes `position: fixed`** — o menu
off-canvas, que é filho do `<header>`, ficava preso dentro da caixa de 77px do
cabeçalho em vez de ocupar a viewport. Resultado: altura de 48px para 389px de
conteúdo, com os 6 itens cortados.

O efeito foi mantido no desktop e desligado até 1024px. Se um dia o menu mobile
"sumir" ou aparecer cortado, olhe primeiro para `backdrop-filter`, `filter`,
`transform` ou `will-change` em algum ancestral.

### `overflow-x` precisa estar no `html`

O menu fechado fica em `translateX(100%)`, fora da tela. Como é `fixed`, o
`overflow-x: hidden` do `body` **não** o contém — o documento ficava com 767px
numa viewport de 414px. A regra está no `html`.

### `minmax()` sem `min()`

`repeat(auto-fit, minmax(400px, 1fr))` estoura em telas menores que 400px.
Todos os grids usam `minmax(min(Npx, 100%), 1fr)`.

### Barra superior escondida no mobile

`.topo-aviso` quebrava em duas linhas e consumia 92px do topo. Fica oculta até
1024px — os telefones seguem no botão flutuante do WhatsApp, nos CTAs e no rodapé.

---

## Migração do site antigo

O site anterior era WordPress + Elementor, e na prática eram **dois sites
sobrepostos**: páginas novas em Elementor convivendo com páginas de 2019 da
agência anterior, com cabeçalho, rodapé, menu e endereço diferentes.

- **250 URLs antigas preservadas** — verificado contra o sitemap em produção.
  Nenhum redirect necessário.
- **233 posts migrados** via REST API do WordPress, com 230 imagens destacadas
  baixadas para `img/blog/`.
- **Links de terceiros removidos.** Os posts linkavam 24 vezes para
  `empreendors.com.br` e 7 para `contabilit.com.br` (rede de conteúdo e agência
  antiga). O texto ficou, o link saiu — não faz sentido o site do cliente passar
  autoridade de SEO para terceiros. Links para `gov.br` e fontes legítimas foram
  mantidos, com `rel="noopener nofollow"`.
- **FAQ corrigido.** O site antigo repetia o mesmo bloco de perguntas (sobre MEI)
  em todas as páginas de serviço, inclusive nas de condomínio e holding. Cada
  página agora tem FAQ próprio, com marcação `FAQPage`.
- **Missão corrigida.** Dizia *"ser reconhecida pelo mercado norte e nordeste"* —
  a empresa fica em Santa Catarina. Era texto copiado de outra empresa.
- **Contabilidade eleitoral removida.** O serviço não é oferecido pelo escritório.
  A página, o item de menu, os cards e as menções em textos, metatags e sitemap
  foram retirados do site.
- **"35 anos" virou "desde 1990"** — a empresa foi fundada em 31/07/1990 e o
  número fixo já estava desatualizado.

---

## Pendências para confirmar com o cliente

1. **Endereço.** O site novo dizia *Travessa Theodoro Koch, 20 — CEP 89280-181*;
   as páginas antigas e o registro do CNPJ dizem *Rua Jorge Lacerda, 273, sala 1
   — CEP 89280-175*. Adotamos o primeiro por ser o mais recente. Para corrigir:
   edite o rodapé do `index.html`, rode `sincronizar-layout.js`, e ajuste também
   `contato/index.html` e `contabilidade-em-sao-bento-do-sul/index.html`.

2. **E-mail.** Estava ofuscado por Cloudflare no site atual e não pôde ser
   extraído. Usamos `contato@centralcontabilidadesbs.com.br`.

3. **Horário de atendimento.** Não constava em lugar nenhum. Assumimos segunda a
   sexta, das 8h às 18h.

4. **Depoimentos.** O site antigo tinha a seção *"O que falam sobre nosso
   trabalho"* com placeholders vazios. A seção não foi recriada — vale coletar
   3 a 5 depoimentos com nome e empresa.

5. **Fotos.** Não há nenhuma foto da equipe ou do escritório; os cards usam
   iniciais. Fotos reais elevariam muito a página *Quem Somos*.

6. **Logo em vetor.** Só existe o PNG. Peça o original em SVG ou AI.

7. **"+1.000 empresas atendidas"** — número herdado do site antigo, não
   verificado.

8. **Área do Cliente.** O site de 2019 tinha link para portal do cliente que
   sumiu na versão nova. Se ainda existe, vale trazer de volta ao menu.

---

## Publicação

O site tem **510 arquivos**. Subir isso um a um por FTP é lento e falha no meio
com facilidade. Use o empacotador:

```bash
node _build/empacotar.js
```

Ele gera `_build/site-para-publicar.zip` (14,6 MB, um arquivo só). Na hospedagem:

1. Envie o `.zip` para a pasta pública (`public_html`, `www` ou `htdocs`)
2. Use **Extrair** no gerenciador de arquivos do painel
3. Apague o `.zip` depois

O pacote já exclui `_build/` e o `README.md`.

> **Por que não usar o `Compress-Archive` do PowerShell diretamente:** no
> Windows PowerShell 5.1 ele grava os caminhos internos com barra invertida
> (`pasta\arquivo.html`), violando a especificação ZIP. Num servidor Linux — que
> é praticamente toda hospedagem — isso extrai como arquivos de nome literal em
> vez de pastas, e o site não funciona. O `empacotar.js` monta o zip com barras
> normais e **confere isso antes de terminar**, falhando se encontrar alguma
> barra invertida.

### Configuração do servidor

Configure o servidor para servir `404.html` nos erros 404. Em Netlify/Vercel é
automático; no Apache, crie um `.htaccess` na raiz:

```apache
ErrorDocument 404 /404.html
```

Após publicar, envie o `sitemap.xml` no Google Search Console.

**O site antigo pode ser desligado com segurança** — as imagens do blog já são
servidas localmente de `/img/blog/`. Nada depende mais dele.

---

## Opcional: agrupar os posts dentro de /blog/

Hoje os 233 posts ficam na raiz para preservar as URLs. Quando a hospedagem
estiver definida, dá para mover os arquivos para dentro de `/blog/` **sem mudar
nenhuma URL**, usando uma reescrita no servidor. O visitante e o Google
continuam vendo `/nome-do-post/`; só o arquivo muda de lugar.

**Apache** (`.htaccess` na raiz):

```apache
RewriteEngine On
# se existir /blog/<slug>/index.html, serve ele na URL /<slug>/
RewriteCond %{DOCUMENT_ROOT}/blog/$1/index.html -f
RewriteRule ^([^/]+)/?$ /blog/$1/index.html [L]
```

**Vercel** (`vercel.json`):

```json
{ "rewrites": [{ "source": "/:slug", "destination": "/blog/:slug" }] }
```

**Netlify** (`_redirects`, note o `200` — é reescrita, não redirect):

```
/:slug  /blog/:slug  200
```

Atenção: se o servidor não suportar reescrita, os 233 posts passam a dar 404.
Teste com alguns antes de aplicar em tudo. Como não há ganho de SEO nenhum
nessa mudança — é só organização de arquivos — não vale correr o risco sem
testar.

### Nomes longos de arquivo

Alguns slugs de post têm mais de 120 caracteres. Em Linux não há problema (o
limite é 255 por componente), mas ao extrair o zip **no Windows** o caminho
total pode passar de 260 caracteres e dar erro. Se acontecer, extraia numa pasta
de caminho curto, como `C:\site\`.
