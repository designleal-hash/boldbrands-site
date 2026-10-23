# Site BoldBrands

Landing page estática (HTML + CSS + JS). Não precisa instalar nada para editar.

## Como editar (sem programar)
1. Abra o repositório no GitHub e aperte a tecla **.** (ponto) para abrir o editor no navegador.
2. Abra `index.html`. Procure os comentários **TROCAR AQUI** — eles indicam cada texto editável.
3. Troque só o texto entre as tags. Não apague os símbolos `<` e `>`.
4. Clique em **Commit** (ícone de ramificação à esquerda), escreva uma mensagem e confirme.
5. Em ~1 minuto o site atualiza sozinho.

## O que trocar e onde
| O que | Onde |
|---|---|
| Textos (bio, tese, serviços, portfólio, bios, cargos, e-mail) | `index.html` |
| Thumbnails do portfólio (home e página Cases) | `img/thumbs/` — imagens **16:9 (1920×1080)**. Para trocar, substitua o arquivo mantendo o nome. Elas aparecem em preto e branco e ganham cor no mouse. |
| Páginas de cada case | `cases/<nome-do-case>/index.html` (textos) e `cases/<nome-do-case>/media/` (imagens) |
| Lista de todos os cases | `cases/index.html` |
| Fotos dos sócios | `img/socio-bruno.jpg`, `socio-eduardo.jpg`, `socio-felipe.jpg` (retrato 3:4) |
| Cores e tamanhos | `style.css`, no topo, em `:root` |
| Logos | pasta `logo/` |

## Cuidados
- Os textos animados no scroll são montados pelo `main.js`: edite sempre no `index.html`, nunca no `main.js`.
- Não renomeie as pastas `fonts`, `img`, `logo`.
- Para testar antes de publicar, use a extensão **Live Server** do VS Code.

## Publicação (já configurada)
O site é publicado pelo Netlify. Cada commit na branch `main` gera uma nova versão. Para voltar atrás: Netlify → Deploys → escolher uma versão anterior → *Publish deploy*.

## Domínio
Netlify → Domain settings → Add a domain. Depois configure no provedor do domínio:
- registro **A** do domínio raiz → IP indicado pelo Netlify
- registro **CNAME** de `www` → o endereço `.netlify.app` do site
O HTTPS é ativado sozinho.
