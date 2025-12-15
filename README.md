# Transfer VIP Tour — Novo

Site estático premium com i18n (PT/EN/ES), URLs amigáveis e componentes reutilizáveis.

## Estrutura

- `index.html`: página inicial
- `views/`: páginas internas (`servicos.html`, `contato.html`, `frota-executivos.html`, `frota-blindados.html`)
- `components/`: `header.html`, `footer.html` injetados via `fetch`
- `js/`: `main.js`, `whatsapp-integration.js`, `i18n.js`
- `i18n/`: dicionários `pt.json`, `en.json`, `es.json`
- `assets/`: imagens, ícones e estilos
- `.htaccess`: mapeia rotas amigáveis sem `.html`

## Desenvolvimento

- Servidor: Apache (XAMPP ou hospedagem), basta apontar o DocumentRoot para a pasta `novo`
- Injeção de componentes: `index.html` e páginas em `views/` usam `fetch('/components/header.html')` e `fetch('/components/footer.html')`; após injeção, `I18N.apply()` reaplica traduções
- Idioma: alterado pelo seletor no header. Persistência em `localStorage('lang')`

## Rotas amigáveis

`.htaccess` inclui rewrites:

- `/` → `index.html`
- `/contato` → `views/contato.html`
- `/servicos` → `views/servicos.html`
- `/frota-executivos` → `views/frota-executivos.html`
- `/frota-blindados` → `views/frota-blindados.html`

Coloque o `.htaccess` no diretório servido (raiz do domínio ou subpasta) e ajuste os links para o prefixo correto (`/novo/…` se publicar em subpasta).

## Publicação

- Copiar a pasta `novo` para o servidor
- Garantir que `AllowOverride All` esteja ativo para o VirtualHost, permitindo que o `.htaccess` funcione
- Se publicar em subpasta (ex.: `/novo`), usar links com prefixo `/novo/` (já configurados no header/footer)
- Para publicar na raiz do domínio, mover arquivos para lá e atualizar os links para `/…`

## Git

- Inicialização: `git init`
- Ignorados: `.gitignore` cobre caches, `node_modules`, logs e arquivos de IDE
- Normalização de finais de linha: `.gitattributes` define `eol=lf` para web assets

## Notas

- Não expor segredos: não commitar `.env` (já ignorado)
- Evitar comentar código com credenciais ou URLs privadas
- Para painel administrativo futuro, usar API/JSON ou CMS headless; páginas já separadas para fácil integração
